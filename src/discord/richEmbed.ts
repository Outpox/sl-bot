import { ParsedSonglinkResponse } from '../../typings'
import { platforms } from '../songlink'

export interface RichEmbedField {
  name: string
  value: string
  inline?: boolean
}

export function buildFields(response: ParsedSonglinkResponse): RichEmbedField[] {
  const fields: RichEmbedField[] = []

  platforms
    .filter(platform => response.linksByPlatform[platform.name] !== undefined)
    .forEach(platform => {
      fields.push({
        name: platform.name.charAt(0).toUpperCase() + platform.name.slice(1),
        value: `[<:${platform.name}:${platform.emoji}>](${response.linksByPlatform[platform.name].url})`,
        inline: true,
      })
    })

  return fields
}
