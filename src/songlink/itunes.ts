// https://itunes.apple.com/search?term=jamiroquai&country=FR&entity=song,album&callback=__jp0

import Axios, { AxiosResponse } from 'axios'
import { queryInfoLogger } from '../utils/logs'

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
   * TODO
   *  Manage HTTP error
   * (node:19415) UnhandledPromiseRejectionWarning: Error: getaddrinfo ENOTFOUND itunes.apple.com itunes.apple.com:443
   *   at GetAddrInfoReqWrap.onlookup [as oncomplete] (dns.js:67:26)
   *  (node:19415) UnhandledPromiseRejectionWarning: Unhandled promise rejection. This error originated either by throwing inside of an async function without a
   *  catch block, or by rejecting a promise which was not handled with .catch(). (rejection id: 2)
   *  (node:19415) [DEP0018] DeprecationWarning: Unhandled promise rejections are deprecated. In the future, promise rejections that are not handled will terminate
   *  the Node.js process with a non-zero exit code.
   *
   * @param arg the track the user is looking for.
   * @param attempts (optional) the query may fail so we keep count of the amount of retry before we give up.
   */
  async queryItunesApi(arg: string, queryUuid: string, attempts: number = 0): Promise<ItunesResponse> {
    let response
    try {
      const itunesUrl = this.getItunesUrl(arg)
      queryInfoLogger.info(`[${attempts}] querying ${itunesUrl}`, { queryUuid })
      response = (await Axios.get(itunesUrl)) as AxiosResponse<object>
    } catch (err) {
      if (attempts < 5) {
        attempts += 1
        response = await this.queryItunesApi(arg, queryUuid, attempts)
      }
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
