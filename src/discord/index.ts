import { ParsedSonglinkResponse } from '../../typings'
import { RichEmbed, RichEmbedOptions, User } from 'discord.js'
import { buildFields } from './richEmbed'

export function richEmbedfromSonglinkResponse(author: User, response: ParsedSonglinkResponse): RichEmbed {
  const songlinkId = response.entitiesByUniqueId[response.linksByPlatform.appleMusic.entityUniqueId].id
  const config: RichEmbedOptions = {
    title: 'SongLink',
    description: `<@!${author.id}> has shared **${response.title}** by **${response.artist}**
    More on [<:songlink:603626770796642354> SongLink](https://song.link/i/${songlinkId})`,
    color: 0X00c4b0,
    thumbnail: { url: response.cover },
    fields: buildFields(response),
  }

  return new RichEmbed(config)
}

export function getIntroMessage(): string {
  // tslint:disable: max-line-length
  return `Hey there!
  I'm here to help you share Songlink(s), a service that lets you share music better and more efficiently without worrying about which music streaming platform your friends, family or fans use.
  To do so you can either search for a given music or directly share a platform's link such as spotify.
  Examples:
  \`!songlink Hello Adele\`
  or
  \`!songlink https://open.spotify.com/track/4sPmO7WMQUAf45kwMOtONw\`
  Also if you prefer, \`!sl\` is an alias for \`!songlink\`.
  \`!sl_help\` for more.
  `
}

/**
 * Outpox : 116939657677111298
 * Zooly : 225317425342578689
 */
export function getHelpMessage(): string {
  return `I'm a wip bot created by <@!116939657677111298> and <@!225317425342578689>.
  Available commands:
  - \`!songlink Hello Adele\` or \`!sl Hello Adele\` (\`!sl\` is an alias for \`!songlink\`)
  - \`!sl_help\` to display this help message

  The \`!sl\` command also accept an URL instead of simple words for the following supported platforms:
  - Spotify
  - Apple Music/iTunes
  - YouTube
  - Pandora
  - Tidal
  - SoundCloud
  - Deezer
  - Google Play Music/Google Play Store
  - Napster
  - Amazon Music/Amazon Store
  - Yandex.Music
  - Spinrilla

  Example:
  - \`!sl <https://open.spotify.com/track/4sPmO7WMQUAf45kwMOtONw>\`
  - \`!sl <https://www.youtube.com/watch?v=w4AQbsCz1AY>\`
  - \`!sl <https://play.google.com/music/m/Tlt5evhf54uii3dnyc6spjfy7sm?t=La-haut_-_LImperatrice>\`

  New features such as language selection, improved response and general behavior, song selection, etc are to be expected at some point. We're still working on it.
  Also thanks to Kurt from Songlink who's been helping us and answering our questions!
  `
}
