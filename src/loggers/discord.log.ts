'use strict'
import { Client, TextChannel, GatewayIntentBits } from 'discord.js'
import 'dotenv/config'
class LoggerService {
  client: Client
  channelId: string
  constructor() {
    this.client = new Client({
      intents: [
        GatewayIntentBits.DirectMessages,
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent
      ]
    })
    this.channelId = process.env.CHANNEL_ID as string
    this.client.on('ready', () => {
      console.log(`Logged is as ${this.client.user?.tag}`)
    })
    this.client.login(process.env.BOT_TOKEN)
  }
  sendToFormatCode(logData: any) {
    const { code, message = 'This is some additional information about the code.', title = 'Code Example' } = logData
    const codeMessage = {
      content: message,
      embeds: [
        {
          color: parseInt('00ff00', 16),
          title,
          description: '```json\n' + JSON.stringify(code, null, 2) + '\n```'
        }
      ]
    }
    this.sendToMessage(codeMessage)
  }
  sendToMessage(message: any = 'message') {
    const channel = this.client.channels.cache.get(this.channelId) as TextChannel
    if (!channel) {
      console.error(`Counld't find the channel...`, this.channelId)
      return
    }

    channel.send(message).catch((e: Error) => console.error(e))
  }
}
const loggerService = new LoggerService()
export default loggerService
