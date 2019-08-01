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
