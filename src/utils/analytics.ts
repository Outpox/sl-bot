import { Client } from 'discord.js'
import { guildEventLogger } from './logs'

export function discordAnalytics(client: Client) {
  client.on('guildCreate', guild => {
    guildEventLogger.info('guildCreate', guild)
  })

  client.on('guildDelete', guild => {
    guildEventLogger.info('guildDelete', guild)
  })
}
