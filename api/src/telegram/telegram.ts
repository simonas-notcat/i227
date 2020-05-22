import { Telegraf } from 'telegraf'
import { config } from 'dotenv'
config()
import { getAvailableKudos, issueKudosPost } from '../kudos'
import { getTelegramUserIdentity, getTelegramUsernameIdentity } from './users'

const bot = new Telegraf(process.env.TELEGRAM_TOKEN)
bot.command('kudos', async (ctx) => {
  const { message } = ctx.update
  const firstMention = message.entities.filter(e => e.type === 'mention').shift()
  if (!firstMention) {
    return ctx.reply('Please provide username. E.x.: /kudos @User Thank you')
  }

  const username = message.text.substr(firstMention.offset + 1, firstMention.length - 1)
  const kudos = message.text.slice(firstMention.offset + firstMention.length).trim()
  const availableKudos = await getAvailableKudos()

  if (!availableKudos.includes(kudos)) {
    return ctx.reply('available kudos types: \n' + availableKudos.join('\n'))
  }

  const issuer = await getTelegramUserIdentity(message.from)
  const subject = await getTelegramUsernameIdentity(username)
  const credential = await issueKudosPost(issuer, subject, kudos)

  ctx.reply(process.env.BASE_URL + 'c/' + credential.id)
})

bot.launch()