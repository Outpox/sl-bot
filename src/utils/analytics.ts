import { Client } from 'discord.js'
import { logger } from './logs'

export function discordAnalytics(client: Client) {
  client.on('guildCreate', guild => {
    logger.info('guildCreate', guild)
  })

  client.on('guildDelete', guild => {
    logger.info('guildDelete', guild)
  })
}
