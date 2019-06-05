// https://itunes.apple.com/search?term=jamiroquai&country=FR&entity=song,album&callback=__jp0
import Axios, { AxiosResponse } from 'axios'

export interface ItunesTrack {
    trackId: number
    artistName: string
    collectionName: string
}

export interface ItunesResponse {
    resultCount: number
    results: ItunesTrack[]
}

/**
 * TODO
 *  Manage HTTP error
 * (node:19415) UnhandledPromiseRejectionWarning: Error: getaddrinfo ENOTFOUND itunes.apple.com itunes.apple.com:443
    at GetAddrInfoReqWrap.onlookup [as oncomplete] (dns.js:67:26)
    (node:19415) UnhandledPromiseRejectionWarning: Unhandled promise rejection. This error originated either by throwing inside of an async function without a catch block, or by rejecting a promise which was not handled with .catch(). (rejection id: 2)
    (node:19415) [DEP0018] DeprecationWarning: Unhandled promise rejections are deprecated. In the future, promise rejections that are not handled will terminate the Node.js process with a non-zero exit code.
 */
export async function queryItunesApi(arg: string, attempts: number = 0): Promise<ItunesResponse> {
    let response
    try {
        response = (await Axios.get(getItunesUrl(arg))) as AxiosResponse<object>
    } catch (err) {
        if (attempts < 5) {
            response = await queryItunesApi(arg, attempts++)
        }
    }
    return response.data as ItunesResponse
}

function getItunesUrl(arg: string): string {
    // entity: song only because we are looking for trackId
    return `https://itunes.apple.com/search?term=${arg}&country=FR&entity=song&limit=1`
}

export function getSongLinkUrl(response: ItunesResponse): string {
    console.log(response)
    const first = response.results[0]
    return `https://song.link/i/${first.trackId}`
}
