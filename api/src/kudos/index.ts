import { Identity, Credential } from 'daf-core'
import { ActionSignW3cVc, ActionTypes } from 'daf-w3c'
import { agent } from '../agent/agent'
import shortId from 'shortid'

export const getAvailableKudos = async() => [
  'Thank you',
  'Going Above and Beyond',
  'Inspirational Leader',
  'Team Player',
  'Great Job',
  'Making Work Fun',
  'Amazing Mentor',
  'Outside the Box Thinker',
  'Great Presentation',
  'Making an Impact',
  ]

export const issueKudosPost = async (issuer: Identity, subject: Identity, kudos: string): Promise<Credential> => {
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

  return credential
}