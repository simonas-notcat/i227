import { IIdentity } from 'daf-core'
import { agent } from '../agent/agent'
import shortId from 'shortid'


export interface UserInfo {
  provider?: string,
  alias: string,
  nickname: string,
  name: string,
  picture: string
}

export const getIdentityAndUpdateProfile = async ( userInfo: UserInfo ): Promise<IIdentity> => {

  const identity = await agent.identityManagerGetOrCreateIdentity({
    alias: userInfo.alias,
    provider: userInfo.provider
  })

  //Update profile info
  const credentials = await agent.dataStoreORMGetVerifiableCredentials({
    where: [
      { column: 'subject', value: [identity.did], op: 'Equal'},
      { column: 'type', value: ['VerifiableCredential,Profile'], op: 'Equal'}
    ],
    order: [
      { column: 'issuanceDate', direction: 'DESC' }
    ]
  })

  if (credentials.length === 0  || (
    credentials[0].credentialSubject['name'] !== userInfo.name ||
    credentials[0].credentialSubject['nickname'] !== userInfo.nickname ||
    credentials[0].credentialSubject['picture'] !== userInfo.picture
  )) {
    await agent.createVerifiableCredential({
      save: true,
      proofFormat: 'jwt',
      credential: {
        '@context': ['https://www.w3.org/2018/credentials/v1'],
        type: ['VerifiableCredential', 'Profile'],
        id: process.env.BASE_URL + 'c/' + shortId.generate(),
        issuer: { id: process.env.MAIN_DID },
        issuanceDate: new Date().toISOString(),
        credentialSubject: {
          id: identity.did,
          name: userInfo.name,
          nickname: userInfo.nickname,
          picture: userInfo.picture
        }
      }
    })
  }

  return identity
}

export const getLatestClaimValue = async ( args: {
  did: string,
  credentialType: string,
  type: string
} ): Promise<string> => {

  const credentials = await agent.dataStoreORMGetVerifiableCredentialsByClaims({
    where: [
      { column: 'issuer', value: [args.did, process.env.MAIN_DID], op: 'In' },
      { column: 'subject', value: [args.did] },
      { column: 'credentialType', value: [args.credentialType] },
      { column: 'type', value: [args.type] },
    ],
    order: [
      { column: 'issuanceDate', direction: 'DESC'}
    ],
  })

  return credentials[0]?.credentialSubject[args.type]
}