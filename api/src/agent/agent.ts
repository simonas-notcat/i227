import { Entities, migrations, KeyStore, IdentityStore, Agent} from 'daf-core'
import { JwtMessageHandler } from 'daf-did-jwt'
import { W3cMessageHandler, W3cActionHandler} from 'daf-w3c'
import { SdrMessageHandler, SdrActionHandler } from 'daf-selective-disclosure'
import { IdentityProvider } from 'daf-ethr-did'
import { KeyManagementSystem, SecretBox} from 'daf-libsodium'
import { DafResolver } from 'daf-resolver'
import { createConnection } from 'typeorm'

let didResolver = new DafResolver({ infuraProjectId: process.env.INFURA_PROJECT_ID })

const dbConnection = createConnection({
  type: 'sqlite',
  database: 'database.sqlite',
  synchronize: true,
  logging: process.env.DB_DEBUG=='1',
  entities: Entities,
  migrations: [...migrations]
})

const identityProviders = [
  new IdentityProvider({
    kms: new KeyManagementSystem(new KeyStore(dbConnection, new SecretBox(process.env.SECRET_KEY))),
    identityStore: new IdentityStore('rinkeby-ethr', dbConnection),
    network: 'rinkeby',
    rpcUrl: 'https://rinkeby.infura.io/v3/' + process.env.INFURA_PROJECT_ID,
  }),
]
const serviceControllers = []

const messageHandler = new JwtMessageHandler()
messageHandler
  .setNext(new W3cMessageHandler())
  .setNext(new SdrMessageHandler())

const actionHandler = new W3cActionHandler()
actionHandler.setNext(new SdrActionHandler())

export const agent = new Agent({
  dbConnection,
  identityProviders,
  serviceControllers,
  didResolver,
  messageHandler,
  actionHandler,
})
