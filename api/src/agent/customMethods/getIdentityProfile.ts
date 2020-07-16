import { TAgent } from "daf-core"
import { IDataStoreORM } from "daf-typeorm"
import { IGetLatestClaimValue } from './getLatestClaimValue'

type Context = {
  agent: TAgent<IDataStoreORM & IGetLatestClaimValue>
}

export interface IdentityProfile {
  did: string
  name?: string
  nickname?: string
  picture?: string
}
export interface IGetIdentityProfile {
  getIdentityProfile: ( args: { did: string }, context: Context)=>Promise<IdentityProfile>
}

export const getIdentityProfile = async (args: { did: string }, context: Context): Promise<IdentityProfile> => { 
  return {
    did: args.did,
    name: await context.agent.getLatestClaimValue({ did: args.did, type: 'name', credentialType: 'VerifiableCredential,Profile'}),
    nickname: await context.agent.getLatestClaimValue({ did: args.did, type: 'nickname', credentialType: 'VerifiableCredential,Profile'}),
    picture: await context.agent.getLatestClaimValue({ did: args.did, type: 'picture', credentialType: 'VerifiableCredential,Profile'}),
  }
}

