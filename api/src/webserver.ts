import { config } from 'dotenv'
config()

import { ApolloServer } from 'apollo-server-express'
import exphbs from 'express-handlebars'
import sharp from 'sharp'
import fileType from 'file-type'
import express from 'express'
import jwt from 'express-jwt'
import jwksRsa from 'jwks-rsa'
import cors from 'cors'
import fetch from 'node-fetch'
import { agent } from './agent/agent'
import { getIdentityAndUpdateProfile } from './helpers/users'
import shortId from 'shortid'
const fs = require('fs')

import { createSchema } from 'daf-graphql'
const enabledMethods = ['resolveDid', 'identityManagerCreateIdentity']

const { typeDefs, resolvers } = createSchema({ enabledMethods })

const server = new ApolloServer({
  typeDefs,
  resolvers,
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
  const { credentialSubject, type } = req.body
  if (!credentialSubject?.id || !type) {
    res.send({error: 'credentialSubject.id and type are required'})
  } else {
    const request = await fetch(process.env.AUTH0_DOMAIN + 'userinfo', {
      headers: { Authorization: req.headers.authorization }
    })
    const userInfo = await request.json()
    
    const issuer = await getIdentityAndUpdateProfile({
      alias: userInfo.sub,
      nickname: userInfo.nickname,
      name: userInfo.name,
      picture: userInfo.picture,
    })
    
    const credential = await agent.createVerifiableCredential({
      save: true,
      proofFormat: 'jwt',
      credential: {
        id: shortId.generate(),
        '@context': ['https://www.w3.org/2018/credentials/v1'],
        type: ['VerifiableCredential', type],
        issuer: { id: issuer.did },
        issuanceDate: new Date().toISOString(),
        credentialSubject
      }
    })
    
    res.send({id: credential.id})
  }
    
})

app.options('/auth0did', cors(corsOptions))
app.post('/auth0did', cors(corsOptions), express.json(), checkJwt, async (req, res) => {
  const request = await fetch(process.env.AUTH0_DOMAIN + 'userinfo', {
    headers: { Authorization: req.headers.authorization }
  })
  const userInfo = await request.json()  
  const issuer = await getIdentityAndUpdateProfile({
    alias: userInfo.sub,
    nickname: userInfo.nickname,
    name: userInfo.name,
    picture: userInfo.picture,
  })
  res.send({did: issuer.did})
})


const hbs = exphbs.create();

app.engine('handlebars', hbs.engine);
app.set('view engine', 'handlebars');
app.set('views', './src/views')

const reactBuildPath = '../web/build'

const meta = {
  og_title: 'i227',
  og_site_name: 'i227',
  og_url: process.env.BASE_URL,
  og_description: 'Your verifiable reputation',
  og_image: process.env.BASE_URL + 'img/default.png'
}

// app.get('/c/:id', async (req, res) => {
//   const { id } = req.params
//   const { credentials } = await api.request(queries.getCredentialsById, { id })
//   const credential = credentials[0]
//   const og_image = meta.og_url + 'img/c/' + credential.id + '/png'
//   const og_url = meta.og_url + 'c/' + credential.id
//   const og_title = `${credential.issuer.name} gave ${credential.claims[0].value} kudos to ${credential.subject.name}`
//   const html = await hbs.render(reactBuildPath + '/index.html', { ...meta, og_url, og_image, og_title, credential })
//   res.send(html)
// })

// app.get('/img/c/:id/:type', async (req, res) => {
//   const { id, type } = req.params
//   const { credentials } = await api.request(queries.getCredentialsById, { id })
//   const credential = credentials[0]

//   const bgImg = fs.readFileSync('/home/simonas/dev/i227/web/public/' + credential.claims[0].value + '.png')
//   const bgImgType = await fileType.fromBuffer(bgImg)
//   const bgImgBase64 = bgImg.toString('base64')

//   let subjectImgBuffer
//   const subjectPictureUrl = credential.subject.picture || process.env.BASE_URL + 'default'

//   if (credential.subject.picture) {
//     const subjectImgReq = await fetch(credential.subject.picture)
//     subjectImgBuffer = await subjectImgReq.buffer()
//   } else {
//     subjectImgBuffer = fs.readFileSync('/home/simonas/dev/i227/web/public/defaultavatar.png')
//   }
//   const subjectImgtype = await fileType.fromBuffer(subjectImgBuffer)
//   const subjectImgbase64 = subjectImgBuffer.toString('base64')

//   const svg = await hbs.render('src/views/svg/credential.svg', {
//     credential,
//     subjectImgtype,
//     subjectImgbase64,
//     bgImgBase64,
//     bgImgType
//   })

//   if (type === 'svg') {
//     res.set('Content-Type', 'image/svg+xml')
//     res.send(svg)
//   } else if (type=== 'png') {
//     const png = await sharp(Buffer.from(svg)).png().toBuffer();
//     res.set('Content-Type', 'image/png')
//     res.send(png)
//   } else {
//     res.send('Invalid type')
//   }
  
// })

app.get('/img/default.png', async (req, res) => {
  const svg = await hbs.render('src/views/svg/default.svg')
  const png = await sharp(Buffer.from(svg)).png().toBuffer(); 
  res.set('Content-Type', 'image/png')
  res.send(png)
})

app.use(express.static(reactBuildPath));

app.get('*', async (req, res) => {
  const html = await hbs.render(reactBuildPath + '/index.html', { ...meta })
  res.send(html)
})


app.listen({port: process.env.WEB_PORT}, async () => {
  const serviceIdentity = await getIdentityAndUpdateProfile({
    provider: 'did:web',
    alias: process.env.MAIN_ALIAS,
    name: 'idea227',
    nickname: 'i227',
    picture: `${process.env.BASE_URL}logo512.png`
  })
  console.log(`🚀  Server ready at http://localhost:${process.env.WEB_PORT}`)
})
