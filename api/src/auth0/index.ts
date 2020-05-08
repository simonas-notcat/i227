import { Claim, Identity } from 'daf-core'
import { ActionSignW3cVc, ActionTypes } from 'daf-w3c'
import { App } from '@slack/bolt'
import { agent } from '../agent/agent'

export interface Auth0UserInfo{
  sub: string,
  nickname: string,
  name: string,
  picture: string,
  email?: string,
}

export const getAuth0UserIdentity = async ( userInfo: Auth0UserInfo): Promise<Identity> => {
  const connection = await agent.dbConnection
  const claim = await connection.getRepository(Claim).findOne({
    where: { 
      issuer: process.env.MAIN_DID,
      type: 'auth0sub',
      value: userInfo.sub
     }
  })
  if (claim) {
    return claim.subject
  } else {


    const identity = await agent.identityManager.createIdentity(process.env.DEFAULT_IDENTITY_PROVIDER)
    const credentialSubject = {
      id: identity.did,
      auth0sub: userInfo.sub,
      // @ts-ignore
      name: userInfo.name,
      nickname: userInfo.nickname,
      picture: userInfo.picture
    }

    await agent.handleAction({
      type: ActionTypes.signCredentialJwt,
      save: true,
      data: {
        '@context': ['https://www.w3.org/2018/credentials/v1'],
        type: ['VerifiableCredential', 'ExternalUser'],
        issuer: process.env.MAIN_DID,
        credentialSubject
      }
    } as ActionSignW3cVc)
    return connection.getRepository(Identity).findOne(identity.did)
  }
}