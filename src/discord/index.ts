import { ParsedSonglinkResponse } from '../../typings'
import { RichEmbed, RichEmbedOptions, User } from 'discord.js'
import { platforms } from '../songlink'

export function richEmbedfromSonglinkResponse(author: User, response: ParsedSonglinkResponse): RichEmbed {
  const config: RichEmbedOptions = {
    title: 'Songlink',
    description: `<@!${author.id}> has shared **${response.title}** by **${response.artist}**`,
    color: 0X00c4b0,
    thumbnail: { url: response.cover },
    fields: platforms
      .filter(platform => {
        return response.linksByPlatform[platform.name] !== undefined
      })
      .map(platform => {
        return {
          name: platform.name.charAt(0).toUpperCase() + platform.name.slice(1),
          value: `[<:${platform.name}:${platform.emoji}>](${response.linksByPlatform[platform.name].url})`,
          inline: true,
        }
      }),
  }

  return new RichEmbed(config)
}
