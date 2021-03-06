import { Claim, Identity } from 'daf-core'
import { ActionSignW3cVc, ActionTypes } from 'daf-w3c'
import { App } from '@slack/bolt'
import { agent } from '../../agent/agent'

export const getSlackUserIdentity = async (slackUserId: string, app: App, token: string): Promise<Identity> => {
  const connection = await agent.dbConnection
  const claim = await connection.getRepository(Claim).findOne({
    where: { 
      issuer: process.env.MAIN_DID,
      type: 'slackUserId',
      value: slackUserId
     }
  })
  if (claim) {
    return claim.subject
  } else {

    const result = await app.client.users.info({ token, user: slackUserId })

    const identity = await agent.identityManager.createIdentity(process.env.DEFAULT_IDENTITY_PROVIDER)
    const credentialSubject = {
      id: identity.did,
      slackUserId,
      // @ts-ignore
      nickname: result.user?.name,
    }
    // @ts-ignore
    if (result.user?.profile?.image_512){
      // @ts-ignore
      credentialSubject['picture'] = result.user?.profile?.image_512
    }
    // @ts-ignore
    if (result.user?.profile?.real_name){
      // @ts-ignore
      credentialSubject['name'] = result.user?.profile?.real_name
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