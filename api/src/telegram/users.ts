import { Claim, Identity, Credential, AbstractIdentity } from 'daf-core'
import { ActionSignW3cVc, ActionTypes } from 'daf-w3c'
import { agent } from '../agent/agent'
import { User } from 'telegram-typings'
import Telegram  from 'telegraf/telegram'

const telegram = new Telegram(process.env.TELEGRAM_TOKEN)

export const getTelegramUserIdentity = async (user: User): Promise<Identity> => {
  const connection = await agent.dbConnection
  const claim = await connection.getRepository(Claim).findOne({
    where: { 
      issuer: process.env.MAIN_DID,
      type: 'telegramUsername',
      value: user.username
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
    const picture = await getProfilePicture(user)

    if ( credentialSubject.name !== user.first_name + ' ' + user.last_name
      || credentialSubject.nickname !== user.username
      || credentialSubject.picture !== picture
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

  const picture = await getProfilePicture(user)

  const credentialSubject = {
    id: identity.did,
    telegramUserId: user.id,
    telegramUsername: user.username,
    name: user.first_name + ' ' + user.last_name,
    nickname: user.username,
    picture
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

const getProfilePicture = async (user: User): Promise<string> => {
  const photos = await telegram.getUserProfilePhotos(user.id)
  const url = await telegram.getFileLink(photos.photos[0].pop().file_id)
  return url
}


export const getTelegramUsernameIdentity = async ( username: string): Promise<Identity> => {
  const connection = await agent.dbConnection
  const claim = await connection.getRepository(Claim).findOne({
    where: { 
      issuer: process.env.MAIN_DID,
      type: 'telegramUsername',
      value: username
    },
  })
  if (claim) {
    return claim.subject
  } else {

    const identity = await agent.identityManager.createIdentity(process.env.DEFAULT_IDENTITY_PROVIDER)
    const credentialSubject = {
      id: identity.did,
      telegramUsername: username,
      name: username,
      nickname: username
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
  
    
    return connection.getRepository(Identity).findOne(identity.did)
  }
}