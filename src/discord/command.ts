import * as Discord from 'discord.js'

export enum ChannelType {
  TextChannel,
  DMChannel,
  GroupDMChannel,
}

export interface Command {
  prefix: string
  alias: string[]
  func: (ctx: Discord.Message, args?: string[]) => void
  argsSeparator: string
  args: string[]
  allowedChannels: ChannelType[]
  _help?: string
}

export interface CommandOptions {
  prefix: string
  alias?: string[]
  func: (ctx: Discord.Message, args?: string[]) => void
  argsSeparator?: string
  args?: string[]
  allowedChannels?: ChannelType[]
  help?: string
}

export class Command {
  constructor({
    prefix,
    alias = [],
    func,
    argsSeparator = ', ',
    args = [],
    allowedChannels = [ChannelType.TextChannel, ChannelType.DMChannel, ChannelType.GroupDMChannel],
    help,
  }: CommandOptions) {
    if (process.env.ENV !== 'production') {
      this.prefix = `${prefix}_dev`
      this.alias = alias.map(alia => `${alia}_dev`)
    } else {
      this.prefix = prefix
      this.alias = alias
    }

    this.func = func
    this.argsSeparator = argsSeparator
    this.args = args
    this.allowedChannels = allowedChannels
    this._help = help
  }

  execute(context: Discord.Message) {
    // Stop execution if the message comes from a bot or if the channel is not allowed or if the input is not matched.
    if (context.author.bot === true || !this._validateChannelType(context.channel) || !this._matchInput(context.content)) {
      return
    }

    if (this.args.length === 0) {
      return this.func(context)
    }
    try {
      const parsedInput = this._parseInput(context.content)
      this.func(context, parsedInput)
    } catch (err) {
      console.log('Error with the previous command.', err)
      context.reply(`${err.message}\n${this.getHelp()}`)
    }
  }

  getHelp() {
    if (this._help) {
      return this._help
    }
    if (this.args.length > 1) {
      return `Usage: \`${this.prefix} ${this.args.join(
        this.argsSeparator,
      )}\`.\nPlease remember to split your parameters with \`${
        this.argsSeparator
        }\`.`
    } else {
      return `Usage: \`${this.prefix} ${this.args.join(
        this.argsSeparator,
      )}\`.`
    }
  }

  private _matchInput(rawInput: string): boolean {
    const firstWord = rawInput.split(' ')[0]
    let matchAlias = false
    this.alias.forEach(alias => {
      if (alias === firstWord) {
        matchAlias = true
      }
    })
    return this.prefix === firstWord || matchAlias
  }

  private _validateChannelType(channel: Discord.TextChannel | Discord.DMChannel | Discord.GroupDMChannel): boolean {
    if (channel instanceof Discord.TextChannel && this.allowedChannels.includes(ChannelType.TextChannel)) {
      return true
    }
    if (channel instanceof Discord.DMChannel && this.allowedChannels.includes(ChannelType.DMChannel)) {
      return true
    }
    if (channel instanceof Discord.GroupDMChannel && this.allowedChannels.includes(ChannelType.GroupDMChannel)) {
      return true
    }
    return false
  }

  private _cleanInput(rawInput: string): string {
    return rawInput.slice(this.prefix.length).trim()
  }

  private _parseInput(rawInput: string): string[] {
    const cleanedInput = this._cleanInput(rawInput)
    const parsedInput = []
    const splittedArgs = cleanedInput
      .split(this.argsSeparator)
      .filter(v => v !== '')

    if (splittedArgs.length !== this.args.length) {
      const given =
        splittedArgs.length === 1 || splittedArgs.length === 0
          ? `${splittedArgs.length} given parameter`
          : `${splittedArgs.length} given parameters`
      const expected =
        this.args.length === 1 || this.args.length === 0
          ? `${this.args.length} expected parameter`
          : `${this.args.length} expected parameters`
      throw new Error(`${given}, ${expected}`)
    }

    splittedArgs.map((arg, i) => {
      parsedInput[this.args[i]] = arg
    })

    return parsedInput
  }
}
