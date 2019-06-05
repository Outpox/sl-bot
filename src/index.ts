import * as dotenv from 'dotenv'
dotenv.config()

import { Command } from './discord/command'
import * as Discord from 'discord.js'

import * as songlink from './songlink/songlink'

const client = new Discord.Client()

const commandBag = [
  new Command({
    prefix: '!sl',
    func: (ctx, args) => {
    songlink.queryItunesApi(args!['query']).then(response => {
        if (response.resultCount > 0) {
          ctx.channel.send(songlink.getSongLinkUrl(response))
        }
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
