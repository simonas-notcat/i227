import * as Daf from 'daf-core'
import { JwtMessageHandler } from 'daf-did-jwt'
import { W3cMessageHandler, W3cActionHandler} from 'daf-w3c'
import { SdrMessageHandler, SdrActionHandler } from 'daf-selective-disclosure'
import * as DafEthrDid from 'daf-ethr-did'
import * as DafLibSodium from 'daf-libsodium'
import { DafResolver } from 'daf-resolver'
import { createConnection } from 'typeorm'

const infuraProjectId = '5ffc47f65c4042ce847ef66a3fa70d4c'

let didResolver = new DafResolver({ infuraProjectId })

const dbConnection = createConnection({
  type: 'sqlite',
  database: 'database.sqlite',
  synchronize: true,
  logging: process.env.DB_DEBUG=='1',
  entities: Daf.Entities,
})

const identityProviders = [
  new DafEthrDid.IdentityProvider({
    kms: new DafLibSodium.KeyManagementSystem(new Daf.KeyStore(dbConnection)),
    identityStore: new Daf.IdentityStore('rinkeby-ethr', dbConnection),
    network: 'rinkeby',
    rpcUrl: 'https://rinkeby.infura.io/v3/' + infuraProjectId,
  }),
]
const serviceControllers = []

const messageHandler = new JwtMessageHandler()
messageHandler
  .setNext(new W3cMessageHandler())
  .setNext(new SdrMessageHandler())

const actionHandler = new W3cActionHandler()
actionHandler.setNext(new SdrActionHandler())

export const agent = new Daf.Agent({
  dbConnection,
  identityProviders,
  serviceControllers,
  didResolver,
  messageHandler,
  actionHandler,
})
