// https://api.song.link/v1-alpha.1/links?url=spotify%3Atrack%3A0Jcij1eWd5bDMU5iPbxe2i&userCountry=US&key=%3Ckey

import Axios, { AxiosResponse } from 'axios'
import { URL } from 'url'
import { richEmbedfromSonglinkResponse } from '../discord'
import { ItunesClient } from './itunes'
import { SonglinkResponse, ParsedSonglinkResponse, SonglinkEntity } from '../../typings'
import { RichEmbed, User } from 'discord.js'

const itunesClient = new ItunesClient()

export const platforms = [
    {
        name: 'spotify', emoji: '601869177950568448',
    },
    {
        name: 'youtube', emoji: '601875627594874988',
    },
    {
        name: 'google', emoji: '601874400911949864',
    },
    {
        name: 'deezer', emoji: '601875350149922816',
    },
]

export interface SonglinkClient {
    search(author: User, query: string): Promise<RichEmbed>
}

export class SonglinkClient {

    /**
     *
     * @param query user query or platform url ie Spotify.
     */
    search(author: User, query: string): Promise<RichEmbed> {
        return this.parseQuery(query)
            .then(parsedQuery => this.querySonglinkApi(parsedQuery))
            .then(response => this.parseSonglinkResponse(response))
            .then(parsedResponse => richEmbedfromSonglinkResponse(author, parsedResponse))
    }

    parseSonglinkResponse(response: SonglinkResponse): Promise<ParsedSonglinkResponse> {
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
    private parseQuery(query: string): Promise<number | URL> {
        try {
            console.log('parsing url')
            return Promise.resolve(new URL(query))
        } catch (err) {
            console.log('not a url given, querying itunes')
            return itunesClient.queryItunesApi(query).then(response => {
                if (response.resultCount > 0) {
                    console.log('we\'ve got a result')
                    const first = response.results[0]
                    return first.trackId!
                } else {
                    return 281524690
                }
            })
        }
    }

    private async querySonglinkApi(query: number | URL): Promise<SonglinkResponse> {
        console.log('querying songlink api', this.getSonglinkApiUrl(query))
        try {
            const response = (await Axios.get(this.getSonglinkApiUrl(query))) as AxiosResponse<object>
            console.log('no error')
            return response.data as SonglinkResponse
        } catch (err) {
            console.log('error querySonglinkApi')
            // tslint:disable-next-line: max-line-length
            return JSON.parse('{"entityUniqueId":"SPOTIFY_SONG::0Jcij1eWd5bDMU5iPbxe2i","userCountry":"US","pageUrl":"https://song.link/s/0Jcij1eWd5bDMU5iPbxe2i","entitiesByUniqueId":{"SPOTIFY_SONG::0Jcij1eWd5bDMU5iPbxe2i":{"id":"0Jcij1eWd5bDMU5iPbxe2i","type":"song","title":"Kitchen","artistName":"Kid Cudi","thumbnailUrl":"https://i.scdn.co/image/477884e59cbdf2b7ff2cae31d57f0a7b2fde1b97","thumbnailWidth":640,"thumbnailHeight":640,"apiProvider":"spotify","platforms":["spotify"]},"ITUNES_SONG::1443109064":{"id":"1443109064","type":"song","title":"Kitchen","artistName":"Kid Cudi","thumbnailUrl":"https://is4-ssl.mzstatic.com/image/thumb/Music118/v4/ac/2c/60/ac2c60ad-14c3-a8b2-d962-dc08de2da546/source/512x512bb.jpg","thumbnailWidth":512,"thumbnailHeight":512,"apiProvider":"itunes","platforms":["appleMusic","itunes"]},"YOUTUBE_VIDEO::w3LJ2bDvDJs":{"id":"w3LJ2bDvDJs","type":"song","title":"Kitchen","artistName":"Kid Cudi","thumbnailUrl":"https://i.ytimg.com/vi/w3LJ2bDvDJs/hqdefault.jpg","thumbnailWidth":480,"thumbnailHeight":360,"apiProvider":"youtube","platforms":["youtube","youtubeMusic"]},"GOOGLE_SONG::Tj3j7gin3skidcsqsqdzdxxr6t4":{"id":"Tj3j7gin3skidcsqsqdzdxxr6t4","type":"song","title":"Kitchen","artistName":"Kid Cudi","thumbnailUrl":"https://lh3.googleusercontent.com/3cs-Hry0V8Au2vLTXXLBpEQH66WLK__NU_96XAhtYbF-ptOyPzutiH1OS4aWJj6NnWyInuJGQw","thumbnailWidth":512,"thumbnailHeight":512,"apiProvider":"google","platforms":["google","googleStore"]},"PANDORA_SONG::TR:13075840":{"id":"TR:13075840","type":"song","title":"Kitchen","artistName":"Kid Cudi","thumbnailUrl":"https://content-images.p-cdn.com/images/public/int/5/8/6/1/00602557251685_500W_500H.jpg","thumbnailWidth":500,"thumbnailHeight":500,"apiProvider":"pandora","platforms":["pandora"]},"DEEZER_SONG::138241229":{"id":"138241229","type":"song","title":"Kitchen","artistName":"Kid Cudi","thumbnailUrl":"https://cdns-images.dzcdn.net/images/cover/44026168938d157092e584a37a5a8ef3/500x500-000000-80-0-0.jpg","thumbnailWidth":500,"thumbnailHeight":500,"apiProvider":"deezer","platforms":["deezer"]},"AMAZON_SONG::B01NAJ0SPH":{"id":"B01NAJ0SPH","type":"song","title":"Kitchen","artistName":"Kid Cudi","thumbnailUrl":"https://images-na.ssl-images-amazon.com/images/I/41leZvuzzIL.jpg","thumbnailWidth":500,"thumbnailHeight":500,"apiProvider":"amazon","platforms":["amazonMusic","amazonStore"]},"TIDAL_SONG::67784545":{"id":"67784545","type":"song","title":"Kitchen","artistName":"Kid Cudi","thumbnailUrl":"https://resources.tidal.com/images/a660376f/4fba/400a/9f8b/da00f7cab11e/640x640.jpg","thumbnailWidth":640,"thumbnailHeight":640,"apiProvider":"tidal","platforms":["tidal"]},"NAPSTER_SONG::tra.246588040":{"id":"tra.246588040","type":"song","title":"Kitchen","artistName":"Kid Cudi","thumbnailUrl":"https://direct.rhapsody.com/imageserver/images/alb.246588025/385x385.jpeg","thumbnailWidth":385,"thumbnailHeight":385,"apiProvider":"napster","platforms":["napster"]},"YANDEX_SONG::32504596":{"id":"32504596","type":"song","title":"Kitchen","artistName":"Kid Cudi","thumbnailUrl":"https://avatars.yandex.net/get-music-content/38044/2ce3bc1b.a.3962211-1/600x600","thumbnailWidth":600,"thumbnailHeight":600,"apiProvider":"yandex","platforms":["yandex"]}},"linksByPlatform":{"spotify":{"url":"https://open.spotify.com/track/0Jcij1eWd5bDMU5iPbxe2i","nativeAppUriDesktop":"spotify:track:0Jcij1eWd5bDMU5iPbxe2i","entityUniqueId":"SPOTIFY_SONG::0Jcij1eWd5bDMU5iPbxe2i"},"appleMusic":{"url":"https://music.apple.com/us/album/kitchen/1443108737?i=1443109064&uo=4&app=music&ls=1&at=1000lHKX","nativeAppUriMobile":"music://music.apple.com/us/album/kitchen/1443108737?i=1443109064&uo=4&app=music&ls=1&at=1000lHKX","nativeAppUriDesktop":"itms://music.apple.com/us/album/kitchen/1443108737?i=1443109064&uo=4&app=music&ls=1&at=1000lHKX","entityUniqueId":"ITUNES_SONG::1443109064"},"youtube":{"url":"https://www.youtube.com/watch?v=w3LJ2bDvDJs","entityUniqueId":"YOUTUBE_VIDEO::w3LJ2bDvDJs"},"youtubeMusic":{"url":"https://music.youtube.com/watch?v=w3LJ2bDvDJs","entityUniqueId":"YOUTUBE_VIDEO::w3LJ2bDvDJs"},"google":{"url":"https://play.google.com/music/m/Tj3j7gin3skidcsqsqdzdxxr6t4?signup_if_needed=1","entityUniqueId":"GOOGLE_SONG::Tj3j7gin3skidcsqsqdzdxxr6t4"},"pandora":{"url":"https://www.pandora.com/artist/kid-cudi/passion-pain-and-demon-slayin/kitchen/TRptv2hl5r9m5hV","entityUniqueId":"PANDORA_SONG::TR:13075840"},"deezer":{"url":"https://www.deezer.com/track/138241229","entityUniqueId":"DEEZER_SONG::138241229"},"amazonMusic":{"url":"https://music.amazon.com/albums/B01MYZLDCF?trackAsin=B01NAJ0SPH&do=play","entityUniqueId":"AMAZON_SONG::B01NAJ0SPH"},"tidal":{"url":"https://listen.tidal.com/track/67784545","entityUniqueId":"TIDAL_SONG::67784545"},"napster":{"url":"http://napster.com/artist/art.19296515/album/alb.246588025/track/tra.246588040","entityUniqueId":"NAPSTER_SONG::tra.246588040"},"yandex":{"url":"https://music.yandex.ru/track/32504596","entityUniqueId":"YANDEX_SONG::32504596"},"itunes":{"url":"https://music.apple.com/us/album/kitchen/1443108737?i=1443109064&uo=4&app=itunes&ls=1&at=1000lHKX","nativeAppUriMobile":"itms://music.apple.com/us/album/kitchen/1443108737?i=1443109064&uo=4&app=itunes&ls=1&at=1000lHKX","nativeAppUriDesktop":"itms://music.apple.com/us/album/kitchen/1443108737?i=1443109064&uo=4&app=itunes&ls=1&at=1000lHKX","entityUniqueId":"ITUNES_SONG::1443109064"},"googleStore":{"url":"https://play.google.com/store/music/album?id=B7xsarspqwsinxzont6zdvd2hny&tid=song-Tj3j7gin3skidcsqsqdzdxxr6t4","entityUniqueId":"GOOGLE_SONG::Tj3j7gin3skidcsqsqdzdxxr6t4"},"amazonStore":{"url":"https://www.amazon.com/Kitchen/dp/B01NAJ0SPH?SubscriptionId=AKIAJRL4NME2ROVJ4Q5Q&tag=songlink0d-20&linkCode=xm2&camp=2025&creative=165953&creativeASIN=B01NAJ0SPH","entityUniqueId":"AMAZON_SONG::B01NAJ0SPH"}}}') as SonglinkResponse
        }
    }

    private getSonglinkApiUrl(query: number | URL): string {
        if (typeof query === 'number') {
            return `https://api.song.link/v1-alpha.1/links?id=${query}&platform=appleMusic&type=song&userCountry=${process.env.DEFAULT_LANG}&key=${process.env.SL_API_KEY}`
        } else {
            return `https://api.song.link/v1-alpha.1/links?url=${query.href}&userCountry=${process.env.DEFAULT_LANG}&key=${process.env.SL_API_KEY}`
        }
    }
}
