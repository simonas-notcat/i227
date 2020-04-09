import * as Daf from 'daf-core'
import { W3cGql } from 'daf-w3c'
import { SdrGql } from 'daf-selective-disclosure'
import { ApolloServer } from 'apollo-server-express'
import merge from 'lodash.merge'
import express from 'express'
import { agent } from './agent'

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

const app = express();
server.applyMiddleware({ app, path: '/graphql' });

app.listen({port: 8080})
console.log(`🚀  Server ready at http://localhost:8080`)
