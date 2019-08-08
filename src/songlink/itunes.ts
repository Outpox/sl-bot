// https://itunes.apple.com/search?term=jamiroquai&country=FR&entity=song,album&callback=__jp0

import Axios, { AxiosResponse } from 'axios'
import { queryInfoLogger } from '../utils/logs'
import { CustomError, ERROR_TYPE } from '../utils/errors'

export interface ItunesClient {
  queryItunesApi(arg: string, queryUuid: string, attempts?: number): Promise<ItunesResponse>
}

export interface ItunesTrack {
  trackId?: number
  artistName: string
  collectionName: string
  country: string
}

export interface ItunesResponse {
  resultCount: number
  results: ItunesTrack[]
}

/**
 * A simple class that just query the itunes api.
 */
export class ItunesClient {
  /**
   * Query the itunes api with the user query.
   * Returns a promise of an ItunesResponse.
   *
   * @param arg the track the user is looking for.
   * @param attempts (optional) the query may fail so we keep count of the amount of retry before we give up.
   */
  async queryItunesApi(arg: string, queryUuid: string): Promise<ItunesResponse> {
    let response
    try {
      const itunesUrl = this.getItunesUrl(arg)
      queryInfoLogger.info(`Querying ${itunesUrl}`, { queryUuid })
      response = (await Axios.get(itunesUrl)) as AxiosResponse<object>
    } catch (err) {
      throw new CustomError({ message: 'Error querying iTunes', errorType: ERROR_TYPE.ITUNES_API, queryUuid, originalError: err })
    }
    return Promise.resolve(response.data as ItunesResponse)
  }

  /**
   * Prepare an itunes api url that we can query.
   *
   * @param arg The tune's title we're looking for.
   */
  private getItunesUrl(arg: string): string {
    // entity: song only because we are looking for trackId
    return `https://itunes.apple.com/search?term=${encodeURIComponent(arg)}&country=${process.env.DEFAULT_LANG}&entity=song&limit=5`
  }
}
