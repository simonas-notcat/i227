import { config } from 'dotenv'
import express from 'express'
import handlebars from 'express-handlebars'
import { Claim, Identity, Credential } from 'daf-core'
import { agent } from './agent'
import { formatDistanceToNow } from 'date-fns'
import { GraphQLClient } from 'graphql-request'
import * as queries from './queries/queries'

config()
const app = express()
const port = 8081
app.engine('handlebars', handlebars())
app.set('view engine', 'handlebars')
app.set('views', './src/views')

const api = new GraphQLClient(process.env.GRAPHQL_URL, { headers: {} })

app.get('/', async (req, res) => {
  const { claims } = await api.request(queries.getLatestKudos, { take: 10, skip: 0})
  res.render('home', { claims })
})

app.get('/identities', async (req, res) => {
  const { identities } = await api.request(queries.getIdentities, { take: 10, skip: 0})
  res.render('identities', { identities })
})

app.get('/identity/:did', async (req, res) => {
  const { did } = req.params
  const { identity } = await api.request(queries.getIdentity, { did })
  res.render('identity', { identity })
})

app.get('/credential/:hash', async (req, res) => {
  const { hash } = req.params
  const { credential } = await api.request(queries.getCredential, { hash })
  res.render('credential', { credential })
})


app.listen(port, () => console.log(`Server running at http://localhost:${port}`))
