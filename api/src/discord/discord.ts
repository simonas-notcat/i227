import Discord, { User } from 'discord.js'
import { config } from 'dotenv'
config()
import { prefix } from './config'
import { agent } from '../agent/agent'
import shortId from 'shortid'
import { getIdentityAndUpdateProfile } from '../helpers/users'

async function getIdentity(user: User) {
  return getIdentityAndUpdateProfile({
    alias: 'discord|' + user.id,
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

  if (command === 'tweet') {
    const mentionedUser = message.mentions.users.first()
    if (!args.length || !mentionedUser) {
      return message.reply(`You need to provide member tag and some text. E.x.:\n${prefix}ty @user for this or that`)
    } else {
      const comment: string = args.filter(i => !i.includes(mentionedUser.id)).join(' ')
      const issuer = await getIdentity(message.author)
      const subject = await getIdentity(mentionedUser)

      const credentialURL = process.env.BASE_URL + 'c/' + shortId.generate()

      const credential = await agent.createVerifiableCredential({
        proofFormat: 'jwt',
        save: true,
        credential: {
          id: credentialURL,
          '@context': ['https://www.w3.org/2018/credentials/v1'],
          type: ['VerifiableCredential', 'Post'],
          issuer: { id: issuer.did },
          issuanceDate: new Date().toISOString(),
          credentialSubject: {
            id: subject.did,
            comment
          }
        }
      })

      const embed = new Discord.MessageEmbed()
      .setColor('#0099ff')
      .setTitle('i227')
      .setURL(credentialURL)
      .setDescription(`[${message.author.username}](${process.env.BASE_URL}identity/${issuer.did}) [${mentionedUser.username}](${process.env.BASE_URL}identity/${subject.did}) [${comment}](${process.env.BASE_URL}c/${credential.id})`)
      .setImage(process.env.BASE_URL + 'img/c/' + credential.id + '/png')
      
      return message.channel.send(embed)
            
    }
  }
})

client.login(process.env.DISCORD_TOKEN)