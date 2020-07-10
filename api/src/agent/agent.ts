import {
  createAgent,
  IAgentBase,
  KeyManager,
  IdentityManager,
  TAgent,
  IIdentityManager,
  IResolveDid,
  IKeyManager,
  IDataStore,
  IHandleMessage,
  MessageHandler,
} from 'daf-core'
import { createConnection } from 'typeorm'
import { DafResolver } from 'daf-resolver'
import { JwtMessageHandler } from 'daf-did-jwt'
import { W3c, IW3c, W3cMessageHandler } from 'daf-w3c'
import { EthrIdentityProvider } from 'daf-ethr-did'
import { WebIdentityProvider } from 'daf-web-did'
import { Sdr, ISdr, SdrMessageHandler } from 'daf-selective-disclosure'
import { KeyManagementSystem, SecretBox } from 'daf-libsodium'
import { Entities, KeyStore, IdentityStore, IDataStoreORM, DataStore, DataStoreORM } from 'daf-typeorm'

const databaseFile = process.env.DATABASE_FILE
const infuraProjectId = process.env.INFURA_PROJECT_ID
const secretKey = process.env.SECRET_KEY

const dbConnection = createConnection({
  type: 'sqlite',
  database: databaseFile,
  synchronize: true,
  logging: false,
  entities: Entities,
})


export const agent = createAgent<
TAgent<
  IAgentBase &
  IIdentityManager &
    IKeyManager &
    IDataStore &
    IDataStoreORM &
    IResolveDid &
    IHandleMessage &
    IW3c &
    ISdr
>
>({
context: {
  // authenticatedDid: 'did:example:3456'
},
plugins: [
  new KeyManager({
    store: new KeyStore(dbConnection, new SecretBox(secretKey)),
    kms: {
      local: new KeyManagementSystem(),
    },
  }),
  new IdentityManager({
    store: new IdentityStore(dbConnection),
    defaultProvider: 'did:ethr:rinkeby',
    providers: {
      'did:ethr:rinkeby': new EthrIdentityProvider({
        defaultKms: 'local',
        network: 'rinkeby',
        rpcUrl: 'https://rinkeby.infura.io/v3/' + infuraProjectId,
        gas: 1000001,
        ttl: 60 * 60 * 24 * 30 * 12 + 1,
      }),
      'did:web': new WebIdentityProvider({
        defaultKms: 'local',
      }),
    },
  }),
  new DafResolver({ infuraProjectId }),
  new DataStore(dbConnection),
  new DataStoreORM(dbConnection),
  new MessageHandler({
    messageHandlers: [
      new JwtMessageHandler(),
      new W3cMessageHandler(),
      new SdrMessageHandler(),
    ],
  }),
  new W3c(),
  new Sdr(),
],
})

