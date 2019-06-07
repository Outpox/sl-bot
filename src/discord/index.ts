import { ParsedSonglinkResponse } from '../../typings'
import { RichEmbed, RichEmbedOptions, User } from 'discord.js'
import { platforms } from '../songlink'

export function richEmbedfromSonglinkResponse(author: User, response: ParsedSonglinkResponse): RichEmbed {
  const config: RichEmbedOptions = {
    title: 'Songlink',
    description: `${author.username} has shared **${response.title}** by **${response.artist}**`,
    image: { url: response.cover },
    thumbnail: { url: 'https://assets.outpox.fr/songlink.png' },
    fields: platforms
      .filter(platform => {
        return response.linksByPlatform[platform] !== undefined
      })
      .map(platform => {
        return {
          name: platform,
          value: `[${platform}](${response.linksByPlatform[platform].url})`,
          inline: true,
        }
      }),
  }

  return new RichEmbed(config)
}
