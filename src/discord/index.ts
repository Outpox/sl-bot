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
