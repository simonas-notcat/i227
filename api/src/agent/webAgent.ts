import jwt from 'express-jwt'
import jwksRsa from 'jwks-rsa'
import { AgentRouter } from 'daf-express'
import { Request } from 'express'
import fetch from 'node-fetch'
import { getIdentityAndUpdateProfile } from '../helpers/users'

import { Agent,KeyManager, IdentityManager } from 'daf-core'
import { createConnection } from 'typeorm'
import { W3c } from 'daf-w3c'
import { EthrIdentityProvider } from 'daf-ethr-did'
import { KeyManagementSystem, SecretBox } from 'daf-libsodium'
import { Entities, KeyStore, IdentityStore, DataStore, DataStoreORM } from 'daf-typeorm'

import { getAuthenticatedDid } from './customMethods/getAuthenticatedDid'
import { getIdentityProfile } from './customMethods/getIdentityProfile'
import { getLatestClaimValue } from './customMethods/getLatestClaimValue'
import { getAllIdentitiesWithProfiles } from './customMethods/getAllIdentitiesWithProfiles'

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

export const checkJwt = jwt({
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


const getAgentForRequest = async (req: Request): Promise<Agent> => {
  const request = await fetch(process.env.AUTH0_DOMAIN + 'userinfo', {
    headers: { Authorization: req.headers.authorization }
  })
  
  const context = {}

  if (request.status === 200) {
    const userInfo = await request.json()
  
    const authorizedIdentity = await getIdentityAndUpdateProfile({
      alias: userInfo.sub,
      nickname: userInfo.nickname,
      name: userInfo.name,
      picture: userInfo.picture,
    })

    context['authenticatedDid'] = authorizedIdentity.did
  }

  const agent = new Agent({
    context,
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
        },
      }),
      new DataStoreORM(dbConnection),
      new DataStore(dbConnection),
      new W3c(),
    ],
    overrides: {
      getAuthenticatedDid,
      getIdentityProfile,
      getLatestClaimValue,
      getAllIdentitiesWithProfiles,
    }
  })

  return agent
}

export const agentRouter = AgentRouter({
  getAgentForRequest,
  overrides: {
    getAuthenticatedDid: { type: 'POST', path: '/getAuthenticatedDid'},
    getIdentityProfile: { type: 'POST', path: '/getIdentityProfile'},
    getAllIdentitiesWithProfiles: { type: 'POST', path: '/getAllIdentitiesWithProfiles'}
  },
  exposedMethods: [
    'getIdentityProfile',
    'getAllIdentitiesWithProfiles',
    'getAuthenticatedDid',
    'createVerifiableCredential',
    'createVerifiablePresentation',
    'dataStoreORMGetVerifiablePresentations',
    'dataStoreORMGetVerifiableCredentials',
    'dataStoreORMGetIdentities',
  ],
})

agentRouter.use(checkJwt)
