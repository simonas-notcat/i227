import { config } from 'dotenv'
import * as Daf from 'daf-core'
import { W3cGql } from 'daf-w3c'
import { SdrGql } from 'daf-selective-disclosure'
import { ApolloServer } from 'apollo-server-express'
import merge from 'lodash.merge'
import express from 'express'
import jwt from 'express-jwt'
import jwksRsa from 'jwks-rsa'
import cors from 'cors'
import fetch from 'node-fetch'
import { agent } from './agent/agent'
import { getAuth0UserIdentity } from './auth0'
import { ActionTypes, ActionSignW3cVc } from 'daf-w3c'
import shortId from 'shortid'


config()

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

const checkJwt = jwt({
  secret: jwksRsa.expressJwtSecret({
    cache: true,
    rateLimit: true,
    jwksRequestsPerMinute: 5,
    jwksUri: process.env.AUTH0_DOMAIN + '.well-known/jwks.json'
  }),
  audience: process.env.AUTH0_AUDIENCE,
  issuer: process.env.AUTH0_DOMAIN,
  algorithm: ["RS256"]
});

var corsOptions = {
  origin: '*',
}

app.options('/sign', cors(corsOptions))
app.post('/sign', cors(corsOptions), express.json(), checkJwt, async (req, res) => {

  if (!req.body.subject || !req.body.kudos) {
    res.send({error: 'Subject and kudos are required'})
  } else {
    const request = await fetch(process.env.AUTH0_DOMAIN + 'userinfo', {
      headers: { Authorization: req.headers.authorization }
    })
    const userInfo = await request.json()
    
    const issuer = await getAuth0UserIdentity(userInfo)
    
    const credential: Credential = await agent.handleAction({
      type: ActionTypes.signCredentialJwt,
      save: true,
      data: {
        id: shortId.generate(),
        '@context': ['https://www.w3.org/2018/credentials/v1'],
        type: ['VerifiableCredential', 'Kudos'],
        issuer: issuer.did,
        credentialSubject: {
          id: req.body.subject,
          kudos: req.body.kudos
        }
      }
    } as ActionSignW3cVc)
    
    
    res.send({id: credential.id})
  }
    
})

app.listen({port: 8080})
console.log(`🚀  Server ready at http://localhost:8080`)
