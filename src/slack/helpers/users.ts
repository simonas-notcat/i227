import { Claim } from 'daf-core'
import { ActionSignW3cVc, ActionTypes } from 'daf-w3c'
import { App } from '@slack/bolt'
import { agent } from '../../agent'

export const getSlackUserDid = async (slackUserId: string, app: App, token: string) => {
  const claim = await Claim.findOne({
    where: { 
      issuer: process.env.MAIN_DID,
      type: 'slackUserId',
      value: slackUserId
     }
  })
  if (claim) {
    return claim.subject.did
  } else {

    const result = await app.client.users.info({ token, user: slackUserId })

    const identity = await agent.identityManager.createIdentity(process.env.DEFAULT_IDENTITY_PROVIDER)
    const credentialSubject = {
      id: identity.did,
      slackUserId,
      // @ts-ignore
      name: result.user?.name,
    }
    // @ts-ignore
    if (result.user?.profile?.image_512){
      // @ts-ignore
      credentialSubject['profileImage'] = result.user?.profile?.image_512
    }
    await agent.handleAction({
      type: ActionTypes.signCredentialJwt,
      save: true,
      data: {
        '@context': ['https://www.w3.org/2018/credentials/v1'],
        type: ['VerifiableCredential', 'SlackUser'],
        issuer: process.env.MAIN_DID,
        credentialSubject
      }
    } as ActionSignW3cVc)
    return identity.did
  }
}