export interface SonglinkResponse {
  entityUniqueId: string
  userCountry: string
  pageUrl: string
  entitiesByUniqueId: { [key: string]: SonglinkEntity }
  linksByPlatform: LinkByPlatform
}

export interface SonglinkEntity {
  id: string
  type: string
  title: string
  artistName: string
  thumbnailUrl: string
  thumbnailWidth: number
  thumbnailHeight: number
  apiProvider: string
  platforms: string[]
  linksByPlatform: LinkByPlatform
}

interface LinkByPlatform {
  appleMusic: SonglinkPlatformApple
  spotify: SonglinkPlatformSpotify
  youtube: SonglinkPlatform
  youtubeMusic: SonglinkPlatform
  google: SonglinkPlatform
  pandora: SonglinkPlatform
  deezer: SonglinkPlatform
  amazonMusic: SonglinkPlatform
  tidal: SonglinkPlatform
  napster: SonglinkPlatform
  yandex: SonglinkPlatform
  itunes: SonglinkPlatformApple
  googleStore: SonglinkPlatform
  amazonStore: SonglinkPlatform
}

interface SonglinkPlatform {
  url: string
  entityUniqueId: string
}

interface SonglinkPlatformApple extends SonglinkPlatform {
  nativeAppUriMobile: string
  nativeAppUriDesktop: string
}

interface SonglinkPlatformSpotify extends SonglinkPlatform {
  nativeAppUriDesktop: string
}

export interface ParsedSonglinkResponse {
  artist: string
  title: string
  cover: string
  entitiesByUniqueId: { [key: string]: SonglinkEntity }
  linksByPlatform: LinkByPlatform
}
