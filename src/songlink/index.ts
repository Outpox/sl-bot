// https://api.song.link/v1-alpha.1/links?url=spotify%3Atrack%3A0Jcij1eWd5bDMU5iPbxe2i&userCountry=US&key=%3Ckey

import Axios, { AxiosResponse } from 'axios'
import { URL } from 'url'
import { richEmbedfromSonglinkResponse } from '../discord/richEmbed'
import { ItunesClient } from './itunes'
import { SonglinkResponse, ParsedSonglinkResponse, SonglinkEntity } from '../../typings'
import { RichEmbed, Message, RichEmbedOptions } from 'discord.js'
import { queryLogger, queryInfoLogger, errorLogger } from '../utils/logs'
import uuid from 'uuid/v1'
import { ERROR_TYPE, CustomError } from '../utils/errors'
import { asyncGet, redisClient } from '../utils/redis'

const itunesClient = new ItunesClient()

export const platforms = [
    {
        key: 'spotify', emoji: '601869177950568448', display: 'Spotify',
    },
    {
        key: 'youtube', emoji: '601875627594874988', display: 'YouTube',
    },
    {
        key: 'google', emoji: '601874400911949864', display: 'Google Play Music',
    },
    {
        key: 'deezer', emoji: '601875350149922816', display: 'Deezer',
    },
    {
        key: 'appleMusic', emoji: '606458463610208276', display: 'Apple Music',
    },
]

export interface SonglinkClient {
    search(context: Message, query: string): Promise<RichEmbed>
}

export class SonglinkClient {

    /**
     *
     * @param query user query or platform url ie Spotify.
     */
    async search(context: Message, query: string): Promise<RichEmbed | RichEmbed[]> {
        const queryUuid = uuid()
        queryInfoLogger.info(`${context.author.tag} sent the command: '${context.content}'`, { queryUuid })
        queryLogger.info('userQuery', {
            query,
            queryUuid,
            author: {
                id: context.author.id,
                tag: context.author.tag,
            },
            guild: {
                id: context.guild.id,
                name: context.guild.name,
            },
        })

        try {
            const parsedQuery = await this.parseQuery(query, queryUuid)
            if (parsedQuery instanceof URL) {
                // If the user given query is an URL we've just got to hit the Songlink API.
                return this.querySonglinkApi(parsedQuery, queryUuid)
                    .then(response => this.parseSonglinkResponse(response))
                    .then(parsedResponse => richEmbedfromSonglinkResponse(context.author, parsedResponse))
            } else {
                // However if the query was a string we had to query the iTunes API which returns an array of response.
                // So for each response we hit the Songlink API and then create a RichEmbed from it.
                // The process has to be split because `promises` is of type Promise<ParsedSonglinkResponse>[] which is an array of promises and as
                // such must be resolved using Promise.all(). We can then map the result and create RichEmbeds of type Promise<RichEmbed[]>.
                // Doing everything at once would yield the type Promise<RichEmbed>[].
                const promises = parsedQuery.map(pQuery => this.querySonglinkApi(pQuery, queryUuid)
                    .then(response => this.parseSonglinkResponse(response))
                    .catch(err => {
                        console.log(err)
                        return null
                    }),
                )

                return Promise.all(promises)
                    .then(response => response
                        .filter(resp => resp !== null)
                        .map(resp => richEmbedfromSonglinkResponse(context.author, resp!)))
            }
        } catch (err) {
            return this.handleError(err)
        }
    }

    private parseSonglinkResponse(response: SonglinkResponse): Promise<ParsedSonglinkResponse> {
        const entity: SonglinkEntity = response.entitiesByUniqueId[response.entityUniqueId]
        return Promise.resolve({
            artist: entity.artistName,
            title: entity.title,
            cover: entity.thumbnailUrl,
            entitiesByUniqueId: response.entitiesByUniqueId,
            linksByPlatform: response.linksByPlatform,
        })
    }

    /**
     * If the given string is an URL we don't need to process it.
     * If it isn't we query the itunes api to retrieve a trackId.
     *
     * @param query an url or a string to search
     */
    private parseQuery(query: string, queryUuid: string): Promise<number[] | URL> {
        try {
            return Promise.resolve(new URL(query))
        } catch (err) {
            queryInfoLogger.info('Not an url given, querying iTunes', { queryUuid })
            return itunesClient.queryItunesApi(query, queryUuid).then(response => {
                if (response.resultCount > 0) {
                    queryInfoLogger.info('We\'ve got a result on iTunes', { queryUuid })
                    return response.results
                        .filter(track => track.trackId !== undefined)
                        .map(track => track.trackId!)
                } else {
                    throw new CustomError({ message: 'No result on iTunes for the query', errorType: ERROR_TYPE.NOT_FOUND, queryUuid })
                }
            })
        }
    }

    private async querySonglinkApi(query: number | URL, queryUuid: string): Promise<SonglinkResponse> {
        const cache = await asyncGet(query.toString())
        if (cache) {
            queryInfoLogger.info('Songlink cache HIT for ' + query.toString(), { queryUuid })
            return JSON.parse(cache) as SonglinkResponse
        }

        queryInfoLogger.info('Songlink cache MISS for ' + query.toString(), { queryUuid })
        const slUrl = this.getSonglinkApiUrl(query)
        queryInfoLogger.info('Querying Songlink api ' + slUrl.replace(process.env.SL_API_KEY!, 'songlink_api_key'), { queryUuid })
        try {
            const response = (await Axios.get(slUrl)) as AxiosResponse<object>
            queryInfoLogger.info('No error querying Songlink', { queryUuid })
            // Set cache
            redisClient.set(query.toString(), JSON.stringify(response.data))
            return response.data as SonglinkResponse
        } catch (err) {
            throw new CustomError({ message: 'Error querying Songlink', errorType: ERROR_TYPE.SL_API, queryUuid, originalError: err })
        }
    }

    private getSonglinkApiUrl(query: number | URL): string {
        if (typeof query === 'number') {
            return `https://api.song.link/v1-alpha.1/links?id=${query}&platform=appleMusic&type=song&userCountry=${process.env.DEFAULT_LANG}&key=${process.env.SL_API_KEY}`
        } else {
            return `https://api.song.link/v1-alpha.1/links?url=${query.href}&userCountry=${process.env.DEFAULT_LANG}&key=${process.env.SL_API_KEY}`
        }
    }

    private handleError(error: CustomError): Promise<RichEmbed> {
        const config: RichEmbedOptions = {
            title: 'Songlink',
            description: '',
            color: 0X00c4b0,
        }

        switch (error.errorType) {
            case ERROR_TYPE.NOT_FOUND:
                config.description = 'No result found.'
                break

            case ERROR_TYPE.SL_API:
            case ERROR_TYPE.ITUNES_API:
                config.description = 'An error occured.'
                break
        }

        return Promise.resolve(new RichEmbed(config))
    }
}
