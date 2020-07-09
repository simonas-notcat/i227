import Discord, { User } from 'discord.js'
import { config } from 'dotenv'
config()
import { prefix } from './config'
import { getAvailableKudos, issueKudosPost } from '../kudos'
import { getIdentityAndUpdateProfile } from '../helpers/users'

async function getIdentity(user: User) {
  return getIdentityAndUpdateProfile({
    alias: 'discord' + user.id,
    name: user.username,
    nickname: `${user.username}#${user.discriminator}`,
    picture: user.displayAvatarURL({format: "png"})
  })
}

const client = new Discord.Client()

client.on('ready', () => {
  console.log(`Logged in as ${client.user.tag}!`)
})

client.on('message', async (message) => {
  if (!message.content.startsWith(prefix) || message.author.bot) return
  const args = message.content.slice(prefix.length).split(' ')
  const command = args.shift().toLowerCase();

  if (command === 'kudos') {
    const mentionedUser = message.mentions.users.first()
    if (!args.length || !mentionedUser) {
      return message.reply(`You need to provide member tag and kudos type. E.x.:\n${prefix}kudos @user Thank you`)
    } else {
      const availableKudos = await getAvailableKudos()
      const kudos: string = args.filter(i => !i.includes(mentionedUser.id)).join(' ')
      if (!availableKudos.includes(kudos)) {
        return message.reply('available kudos types: \n' + availableKudos.join('\n'))
      }

      const issuer = await getIdentity(message.author)
      const subject = await getIdentity(mentionedUser)
      const credential = await issueKudosPost(issuer, subject, kudos)

      const embed = new Discord.MessageEmbed()
      .setColor('#0099ff')
      .setTitle('i227')
      .setURL(process.env.BASE_URL + 'c/' + credential.id)
      .setDescription(`[${message.author.username}](${process.env.BASE_URL}identity/${issuer.did}) gave [${kudos}](${process.env.BASE_URL}c/${credential.id}) kudos to [${mentionedUser.username}](${process.env.BASE_URL}identity/${subject.did})`)
      .setImage(process.env.BASE_URL + 'img/c/' + credential.id + '/png')
      
      return message.channel.send(embed)
            
    }
  }
})

client.login(process.env.DISCORD_TOKEN)