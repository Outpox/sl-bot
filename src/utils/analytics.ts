import { Client } from 'discord.js'
import { guildEventsLogger } from './logs'

export function discordAnalytics(client: Client) {
  client.on('guildCreate', guild => {
    guildEventsLogger.info('guildCreate', guild)
  })

  client.on('guildDelete', guild => {
    guildEventsLogger.info('guildDelete', guild)
  })
}
