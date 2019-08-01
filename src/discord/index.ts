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
  `
}
