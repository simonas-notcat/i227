import express from 'express'
import handlebars from 'express-handlebars'
import { Claim, Identity, Credential } from 'daf-core'
import { agent } from './agent'
import { formatDistanceToNow } from 'date-fns'

const app = express()
const port = 8081
app.engine('handlebars', handlebars())
app.set('view engine', 'handlebars')
app.set('views', './src/views');

async function profile(identity: Identity) {
  return {
    did: identity.did,
    name: await identity.getLatestClaimValue(agent.dbConnection, {type: 'realName'}),
    image: await identity.getLatestClaimValue(agent.dbConnection, {type: 'profileImage'}),
  }
}

async function kudosItem(claim: Claim) {
  return {
    hash: claim.credential.hash,
    
    value: claim.value,
    issuer: await profile(claim.issuer),
    subject: await profile(claim.subject),
    date: formatDistanceToNow(new Date(claim.issuanceDate))
  }
}

app.get('/', async (req, res) => {
  const connection = await agent.dbConnection
  const claims = await connection.getRepository(Claim).find({
    where: { type: 'kudos' },
    order: { issuanceDate: 'DESC' },
    relations: ['credential'],
    take: 15,
  })
  const items = []
  for (const claim of claims) {
    const item = await kudosItem(claim)
    items.push(item)
  }

  res.render('home', { items })
})

app.get('/credential/:hash', async (req, res) => {
  console.log(req.params)
  const connection = await agent.dbConnection
  const claim = await connection.getRepository(Claim).findOne({
    where: {credential: req.params.hash},
    relations: ['credential']
  })
  
  const item = await kudosItem(claim)
  res.render('credential', { item })
})

app.listen(port, () => console.log(`Server running at http://localhost:${port}`))
