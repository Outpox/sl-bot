import * as dotenv from 'dotenv'
dotenv.config()

import { Command, ChannelType } from './discord/command'
import * as Discord from 'discord.js'

import { discordAnalytics } from './utils/analytics'
import { getIntroMessage, getHelpMessage, handleQuery } from './discord'

const client = new Discord.Client()

const commandBag = [
  new Command({
    prefix: '!sl',
    alias: ['!songlink'],
    func: (ctx, args) => handleQuery(ctx, client, args),
    args: ['query'],
    allowedChannels: [ChannelType.TextChannel],
  }),
  new Command({
    prefix: '!sl_help',
    func: ctx => {
      ctx.channel.send(getHelpMessage())
    },
  }),
]

client.on('ready', async () => {
  console.log('Bot ready!')
  client.user.setActivity('!sl_help for help', { type: 'LISTENING' })
})

discordAnalytics(client)

client.on('guildCreate', guild => {
  (guild.systemChannel as Discord.TextChannel).send(getIntroMessage())
})

client.on('message', message => {
  if (!message.author.bot) {
    commandBag.map(cmd => {
      cmd.execute(message)
    })
  }
})

client.login(process.env.DISCORD_KEY)
