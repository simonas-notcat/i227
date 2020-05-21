import { Claim, Identity, Credential, AbstractIdentity } from 'daf-core'
import { ActionSignW3cVc, ActionTypes } from 'daf-w3c'
import { agent } from '../agent/agent'
import { User } from 'discord.js'

export const getDiscordUserIdentity = async ( user: User): Promise<Identity> => {
  const connection = await agent.dbConnection
  const claim = await connection.getRepository(Claim).findOne({
    where: { 
      issuer: process.env.MAIN_DID,
      type: 'discordUserId',
      value: user.id
    },
  })
  if (claim) {

    const credential = await connection.getRepository(Credential).findOne({
      where: { 
        issuer: process.env.MAIN_DID,
        type: 'VerifiableCredential,Profile',
        subject: claim.subject
      },
    })

    const credentialSubject: any = credential.credentialSubject

    if ( credentialSubject.name !== user.username
      || credentialSubject.nickname !== `${user.username}#${user.discriminator}`
      || credentialSubject.picture !== user.displayAvatarURL({format: "png"})
    ) {
      await issueProfileCredential(claim.subject, user)
    } 

    return claim.subject
  } else {

    const identity = await agent.identityManager.createIdentity(process.env.DEFAULT_IDENTITY_PROVIDER)
    await issueProfileCredential(identity, user)
    
    return connection.getRepository(Identity).findOne(identity.did)
  }
}

const issueProfileCredential = async(identity: AbstractIdentity | Identity, user: User): Promise<boolean> => {
  console.log('Issuing ', identity, user)
  const credentialSubject = {
    id: identity.did,
    discordUserId: user.id,
    // @ts-ignore
    name: user.username,
    nickname: `${user.username}#${user.discriminator}`,
    picture: user.displayAvatarURL({format: "png"})
  }

  await agent.handleAction({
    type: ActionTypes.signCredentialJwt,
    save: true,
    data: {
      '@context': ['https://www.w3.org/2018/credentials/v1'],
      type: ['VerifiableCredential', 'Profile'],
      issuer: process.env.MAIN_DID,
      credentialSubject
    }
  } as ActionSignW3cVc)

  return true
}