import { config } from 'dotenv'
import express from 'express'
import exphbs from 'express-handlebars'
import { formatDistanceToNow } from 'date-fns'
import { GraphQLClient } from 'graphql-request'
import * as queries from './queries/queries'
import sharp from 'sharp'
import fetch from 'node-fetch'
import fileType from 'file-type'

config()
const app = express()
const port = 8081

const hbs = exphbs.create({
  partialsDir: [
		"views/partials/",
	],
  helpers: {
    formatDistanceToNow: (date: string) => formatDistanceToNow(Date.parse(date)) + ' ago'
  }
});

app.engine('handlebars', hbs.engine);
app.set('view engine', 'handlebars');
app.set('views', './src/views')

const api = new GraphQLClient(process.env.GRAPHQL_URL, { headers: {} })

const meta = {
  og_title: 'i227',
  og_site_name: 'i227',
  og_url: process.env.BASE_URL,
  og_description: 'Your verifiable reputation',
  og_image: process.env.BASE_URL + 'img/default.png'
}

app.get('/', async (req, res) => {
  const data = await api.request(queries.getLatestKudos, { take: 10, skip: 0})
  res.render('home', { ...meta, ...data })
})

app.get('/identities', async (req, res) => {
  const { identities } = await api.request(queries.getIdentities, { take: 10, skip: 0})
  res.render('identities', { ...meta, identities })
})

app.get('/identity/:did', async (req, res) => {
  const { did } = req.params
  const data = await api.request(queries.getIdentity, { did, take: 10 })
  res.render('identity', {...meta, ...data} )
})

app.get('/c/:id', async (req, res) => {
  const { id } = req.params
  const { credentials } = await api.request(queries.getCredentialsById, { id })
  const credential = credentials[0]
  const og_image = meta.og_url + 'img/c/' + credential.id + '/png'
  const og_url = meta.og_url + 'c/' + credential.id
  const og_title = `${credential.issuer.name} gave ${credential.claims[0].value} kudos to ${credential.subject.name}`

  res.render('credential', { ...meta, og_url, og_image, og_title, credential })
})

app.get('/img/c/:id/:type', async (req, res) => {
  const { id, type } = req.params
  const { credentials } = await api.request(queries.getCredentialsById, { id })
  const credential = credentials[0]

  const issuerImgReq = await fetch(credential.issuer.profileImage)
  const issuerImgBuffer = await issuerImgReq.buffer()
  const issuerImgtype = await fileType.fromBuffer(issuerImgBuffer)
  const issuerImgbase64 = issuerImgBuffer.toString('base64')

  const subjectImgReq = await fetch(credential.subject.profileImage)
  const subjectImgBuffer = await subjectImgReq.buffer()
  const subjectImgtype = await fileType.fromBuffer(subjectImgBuffer)
  const subjectImgbase64 = subjectImgBuffer.toString('base64')

  const svg = await hbs.render('src/views/svg/credential.svg', {
    credential,
    issuerImgtype,
    issuerImgbase64,
    subjectImgtype,
    subjectImgbase64,
  })

  if (type === 'svg') {
    res.set('Content-Type', 'image/svg+xml')
    res.send(svg)
  } else if (type=== 'png') {
    const png = await sharp(Buffer.from(svg)).png().toBuffer();
    res.set('Content-Type', 'image/png')
    res.send(png)
  } else {
    res.send('Invalid type')
  }
  
})

app.get('/img/default.png', async (req, res) => {
  const svg = await hbs.render('src/views/svg/default.svg')
  const png = await sharp(Buffer.from(svg)).png().toBuffer(); 
  res.set('Content-Type', 'image/png')
  res.send(png)
})

app.listen(port, () => console.log(`Server running at http://localhost:${port}`))
