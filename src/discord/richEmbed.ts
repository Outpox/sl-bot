import { ParsedSonglinkResponse } from '../../typings'
import { platforms } from '../songlink'
import { User, RichEmbed, RichEmbedOptions } from 'discord.js'

export interface RichEmbedField {
  name: string
  value: string
  inline?: boolean
}

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

function buildFields(response: ParsedSonglinkResponse): RichEmbedField[] {
  const fields: RichEmbedField[] = []

  platforms
    .filter(platform => response.linksByPlatform[platform.key] !== undefined)
    .forEach(platform => {
      fields.push({
        name: platform.display,
        value: `[<:${platform.key}:${platform.emoji}>](${response.linksByPlatform[platform.key].url})`,
        inline: true,
      })
    })

  return fields
}
