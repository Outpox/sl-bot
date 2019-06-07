import * as dotenv from 'dotenv'
dotenv.config()

import { Command } from './discord/command'
import * as Discord from 'discord.js'

import { SonglinkClient } from './songlink'

const client = new Discord.Client()
const songlinkClient = new SonglinkClient()

const commandBag = [
  new Command({
    prefix: '!sl',
    func: (ctx, args) => {
      songlinkClient.search(ctx.author, args!['query']).then(response => {
        ctx.channel.send(response)
      })
    },
    args: ['query'],
  }),
]

client.on('ready', async () => {
  console.log('Bot ready!')
})

client.on('message', message => {
  if (!message.author.bot) {
    commandBag.map(cmd => {
      cmd.execute(message)
    })
  }
})

client.login(process.env.DISCORD_KEY)
