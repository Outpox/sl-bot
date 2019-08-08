import { Message, RichEmbed, Client } from 'discord.js'
import { SonglinkClient } from '../songlink'
import { Carousel } from './carousel'

const songlinkClient = new SonglinkClient()

export async function handleQuery(ctx: Message, client: Client, args?: string[]) {
  const msg = await ctx.channel.send(new RichEmbed({ title: 'Songlink', description: 'Searching...', color: 0X00c4b0 })) as Message
  const result = await songlinkClient.search(ctx, args!['query'])

  if (Array.isArray(result)) {
    new Carousel(result).attach(client, msg)
  } else {
    msg.edit(result)
  }
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
