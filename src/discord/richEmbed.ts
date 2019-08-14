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
    title: minifyTitle(response),
    url: `https://song.link/i/${songlinkId}`,
    description: `Shared by <@!${author.id}>`,
    color: 0X00c4b0,
    thumbnail: { url: response.cover },
    fields: buildFields(response),
  }

  return new RichEmbed(config)
}

function minifyTitle(response: ParsedSonglinkResponse): string {
  const CONNECTOR = ' by '
  const MARKDOWN_ELEMENTS_LENGTH = 8
  let title = `**${response.title}** by **${response.artist}**`
  if ((response.title.length + response.artist.length + CONNECTOR.length + MARKDOWN_ELEMENTS_LENGTH) > 256) {
    title = `**${response.title.substring(0, 251)}**`
  }
  return title
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
