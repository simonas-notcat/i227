import { TAgent } from "daf-core"
import { IDataStoreORM } from "daf-typeorm"
import { IGetLatestClaimValue } from './getLatestClaimValue'

type Context = {
  agent: TAgent<IDataStoreORM> & IGetLatestClaimValue
}

export const getIdentityProfile = async (args: { did: string }, context: Context): Promise<{did: string, name?: string, nickname?: string, picture?: string}> => { 
  return {
    did: args.did,
    name: await context.agent.getLatestClaimValue({ did: args.did, type: 'name', credentialType: 'VerifiableCredential,Profile'}, context),
    nickname: await context.agent.getLatestClaimValue({ did: args.did, type: 'nickname', credentialType: 'VerifiableCredential,Profile'}, context),
    picture: await context.agent.getLatestClaimValue({ did: args.did, type: 'picture', credentialType: 'VerifiableCredential,Profile'}, context),
  }
}

