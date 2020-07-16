import { TAgent } from "daf-core"
import { IDataStoreORM } from "daf-typeorm"

type Context = {
  agent: TAgent<IDataStoreORM>
}

export interface IGetLatestClaimValue {
  getLatestClaimValue: ( args: { did: string, credentialType: string, type: string}, context: Context)=>Promise<string>
}

export const getLatestClaimValue = async ( args: {
  did: string,
  credentialType: string,
  type: string
}, context: Context ): Promise<string> => {

  const credentials = await context.agent.dataStoreORMGetVerifiableCredentialsByClaims({
    where: [
      // { column: 'issuer', value: [args.did, process.env.MAIN_DID], op: 'In' },
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