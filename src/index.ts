import * as dotenv from 'dotenv'
dotenv.config()

import { Command, ChannelType } from './discord/command'
import * as Discord from 'discord.js'

import { SonglinkClient } from './songlink'
import { discordAnalytics } from './utils/analytics'
import { getIntroMessage } from './discord'

const client = new Discord.Client()
const songlinkClient = new SonglinkClient()

const commandBag = [
  new Command({
    prefix: '!sl',
    alias: ['!songlink'],
    func: (ctx, args) => {
      songlinkClient.search(ctx, args!['query']).then(response => {
        ctx.channel.send(response)
      })
    },
    args: ['query'],
    allowedChannels: [ChannelType.TextChannel],
  }),
]

client.on('ready', async () => {
  console.log('Bot ready!')
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
