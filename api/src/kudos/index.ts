import { IIdentity, VerifiableCredential } from 'daf-core'
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

export const issueKudosPost = async (issuer: IIdentity, subject: IIdentity, kudos: string): Promise<VerifiableCredential> => {
  const credential = await agent.createVerifiableCredential({
    proofFormat: 'jwt',
    save: true,
    credential: {
      id: shortId.generate(),
      '@context': ['https://www.w3.org/2018/credentials/v1'],
      type: ['VerifiableCredential', 'Post'],
      issuer: { id: issuer.did },
      issuanceDate: new Date().toISOString(),
      credentialSubject: {
        id: subject.did,
        kudos
      }
    }
  })

  return credential
}