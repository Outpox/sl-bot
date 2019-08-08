import { Message, RichEmbed, Client } from 'discord.js'

export interface Carousel {
  messages: RichEmbed[]
}

export class Carousel {
  index = 0

  constructor(queries: RichEmbed[]) {
    this.messages = queries
  }

  attach(client: Client, message: Message) {
    message.edit(this.messages[this.index])
    message.react('⬅')
    message.react('➡')

    client.on('messageReactionAdd', (messageReaction, user) => {
      console.log(messageReaction.message.id === message.id)
      console.log(user !== client.user)
      if (messageReaction.message.id === message.id && user !== client.user) {
        // switch (messageReaction.emoji)
      }
    })
  }
}
