import { config } from 'dotenv'
config()

import exphbs from 'express-handlebars'
import express from 'express'
import cors from 'cors'
import { getIdentityAndUpdateProfile } from './helpers/users'
import { agentRouter } from './agent/webAgent'

const hbs = exphbs.create();
const app = express();
app.use(cors({ origin: '*' }))
app.use(express.json())
app.engine('handlebars', hbs.engine);
app.set('view engine', 'handlebars');
app.use(express.static(process.env.WEB_BUILD_PATH));
app.use('/agent', agentRouter)

app.get('*', async (req, res) => {
  const html = await hbs.render(process.env.WEB_BUILD_PATH + '/index.html', {  })
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
