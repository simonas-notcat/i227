import { TAgent } from "daf-core"
import { IDataStoreORM } from "daf-typeorm"
import { IGetIdentityProfile, IdentityProfile } from './getIdentityProfile'

type Context = {
  agent: TAgent<IDataStoreORM & IGetIdentityProfile>
}

export const getAllIdentitiesWithProfiles = async (args: any, context: Context): Promise<IdentityProfile[]> => { 
  const identities = await context.agent.dataStoreORMGetIdentities()
  const result: IdentityProfile[] = []
  for (const identity of identities) {
    const profile = await context.agent.getIdentityProfile({ did: identity.did })
    result.push(profile)
  }
  return result
}

