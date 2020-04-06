import * as Daf from 'daf-core'
import { JwtMessageHandler } from 'daf-did-jwt'
import { W3cMessageHandler, W3cActionHandler, W3cGql } from 'daf-w3c'
import { SdrMessageHandler, SdrActionHandler, SdrGql } from 'daf-selective-disclosure'
import * as DafEthrDid from 'daf-ethr-did'
import * as DafLibSodium from 'daf-libsodium'
import { DafResolver } from 'daf-resolver'
import { ApolloServer } from 'apollo-server'
import merge from 'lodash.merge'
import { createConnection } from 'typeorm'

const infuraProjectId = '5ffc47f65c4042ce847ef66a3fa70d4c'

let didResolver = new DafResolver({ infuraProjectId })

const identityProviders = [
  new DafEthrDid.IdentityProvider({
    kms: new DafLibSodium.KeyManagementSystem(new Daf.KeyStore()),
    identityStore: new Daf.IdentityStore('rinkeby-ethr'),
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
  identityProviders,
  serviceControllers,
  didResolver,
  messageHandler,
  actionHandler,
})

const server = new ApolloServer({
  typeDefs: [
    Daf.Gql.baseTypeDefs,
    Daf.Gql.Core.typeDefs,
    Daf.Gql.IdentityManager.typeDefs,
    W3cGql.typeDefs,
    SdrGql.typeDefs,
  ],
  resolvers: merge(
    Daf.Gql.Core.resolvers,
    Daf.Gql.IdentityManager.resolvers,
    W3cGql.resolvers,
    SdrGql.resolvers,
  ),
  context: ({ req }) => {
    
    return { agent }
  },
  introspection: true,
})

const main = async () => {
  await createConnection({
    type: 'sqlite',
    database: './database.sqlite',
    synchronize: true,
    logging: false,
    entities: [...Daf.Entities],
  })

  const info = await server.listen({port: 8080, path: '/graphql'})
  console.log(`🚀  Server ready at ${info.url}`)
}

main().catch(console.log)
