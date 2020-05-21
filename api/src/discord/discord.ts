import Discord from 'discord.js'
import { config } from 'dotenv'
config()
import { prefix, availableKudos } from './config'
import { getDiscordUserIdentity } from './users'
import { ActionSignW3cVc, ActionTypes } from 'daf-w3c'
import { agent } from '../agent/agent'
import shortId from 'shortid'

const client = new Discord.Client();

client.on('ready', () => {
  console.log(`Logged in as ${client.user.tag}!`)
})

client.on('message', async (message) => {
  if (!message.content.startsWith(prefix) || message.author.bot) return;
  const args = message.content.slice(prefix.length).split(' ');
  const command = args.shift().toLowerCase();
  // console.log(message)

  if (command === 'kudos') {
    const mentionedUser = message.mentions.users.first()
    if (!args.length || !mentionedUser) {
      return message.reply(`You need to provide member tag and kudos type. E.x.:\n${prefix}kudos @user Thank you`);
    } else {
      
      const kudos: string = args.filter(i => !i.includes(mentionedUser.id)).join(' ')
      if (!availableKudos.includes(kudos)) {
        return message.reply('available kudos types: \n' + availableKudos.join('\n'))
      }

      const issuer = await getDiscordUserIdentity(message.author)
      const subject = await getDiscordUserIdentity(mentionedUser)

      const credential: Credential = await agent.handleAction({
        type: ActionTypes.signCredentialJwt,
        save: true,
        data: {
          id: shortId.generate(),
          '@context': ['https://www.w3.org/2018/credentials/v1'],
          type: ['VerifiableCredential', 'Post'],
          issuer: issuer.did,
          credentialSubject: {
            id: subject.did,
            kudos
          }
        }
      } as ActionSignW3cVc)


      const embed = new Discord.MessageEmbed()
      .setColor('#0099ff')
      .setTitle('i227')
      .setURL(process.env.BASE_URL + 'c/' + credential.id)
      // .setAuthor('Some name', 'https://i.imgur.com/wSTFkRM.png', 'https://discord.js.org')
      .setDescription(`[${message.author.username}](${process.env.BASE_URL}identity/${issuer.did}) gave [${kudos}](${process.env.BASE_URL}c/${credential.id}) kudos to [${mentionedUser.username}](${process.env.BASE_URL}identity/${subject.did})`)
      .setImage(process.env.BASE_URL + 'img/c/' + credential.id + '/png')
      
      return message.channel.send(embed)
      
      
    }
  }
})

client.login(process.env.DISCORD_TOKEN)