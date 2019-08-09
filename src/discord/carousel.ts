import { Message, RichEmbed, Client, Emoji, User } from 'discord.js'

enum Emojis {
  next = '➡',
  previous = '⬅',
}

export interface Carousel {
  client: Client
  botMessage: Message
  requestAuthor: User
  results: RichEmbed[]
}

export class Carousel {
  index = 0

  constructor(client: Client, botMessage: Message, requestAuthor: User, queries: RichEmbed[]) {
    this.client = client
    this.botMessage = botMessage
    this.requestAuthor = requestAuthor
    this.results = queries

    this.addFooterToResults()
  }

  async attach() {
    this.renderResult()
    await this.botMessage.react(Emojis.previous)
    this.botMessage.react(Emojis.next)

    // Listen to all reactions from the original user only.
    this.botMessage.createReactionCollector((_, user) => user === this.requestAuthor && !user.bot)
      .on('collect', async messageReaction => {
        // Remove all reactions except from the bot
        (await messageReaction.fetchUsers())
          .filter(u => u !== this.client.user)
          .forEach(u => messageReaction.remove(u))

        switch (messageReaction.emoji.name) {
          case Emojis.next:
            this.nextResult()
            break
          case Emojis.previous:
            this.previousResult()
            break
        }
      })
  }

  private nextResult() {
    this.index += 1
    if (this.index > this.results.length - 1) {
      this.index = 0
    }
    this.renderResult()
  }

  private previousResult() {
    this.index -= 1
    if (this.index < 0) {
      this.index = this.results.length - 1
    }
    this.renderResult()
  }

  private renderResult() {
    this.botMessage.edit(this.results[this.index])
  }

  private addFooterToResults() {
    for (let i = 0; i < this.results.length; i++) {
      this.results[i].setFooter(`Result ${i + 1}/${this.results.length}`)
    }
  }
}
