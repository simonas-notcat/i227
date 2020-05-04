import { config } from 'dotenv'
import { Credential } from 'daf-core'
import { ActionSignW3cVc, ActionTypes } from 'daf-w3c'
import { App, LogLevel } from '@slack/bolt'
import shortId from 'shortid'
import { getKudosFormView } from './views/kudos-form-view'
import { getProfileView, getProfileBlocks } from './views/profile-view'
import { getSlackUserIdentity } from './helpers/users'
import { GraphQLClient } from 'graphql-request'
import * as queries from '../queries/queries'

config()

import { agent } from '../agent'


const api = new GraphQLClient(process.env.GRAPHQL_URL, { headers: {} })

// Initializes your app with your bot token and signing secret
const app = new App({
  token: process.env.SLACK_BOT_TOKEN,
  signingSecret: process.env.SLACK_SIGNING_SECRET,
  logLevel: LogLevel.INFO
});


app.command('/kudos', async ({ command, ack, say, payload, context, body }) => {
  await ack();

  const found = body.text.match(/@\w+/g)
  const subjectUserId = found && found[0] && found[0].substring(1)

  try {
    const result = await app.client.views.open({
      token: context.botToken,
      trigger_id: body.trigger_id,
      view: getKudosFormView({
        initial_conversation: body.channel_id,
        initial_user: subjectUserId
      })
    });
  }
  catch (error) {
    console.error(error);
  }
});


app.view('kudosForm', async(args) => {
  await args.ack()

  const kudos = args.body.view.state.values?.kudos_select_block?.kudos_selected?.selected_option
  const subjectSlackId = args.body.view.state.values?.user_select_block?.user_selected?.selected_user
  const issuerSlackId = args.body.user.id

  const issuer = await getSlackUserIdentity(issuerSlackId, app, args.context.botToken)
  const subject = await getSlackUserIdentity(subjectSlackId, app, args.context.botToken)

  const credential: Credential = await agent.handleAction({
    type: ActionTypes.signCredentialJwt,
    save: true,
    data: {
      id: shortId.generate(),
      '@context': ['https://www.w3.org/2018/credentials/v1'],
      type: ['VerifiableCredential', 'Kudos'],
      issuer: issuer.did,
      credentialSubject: {
        id: subject.did,
        kudos: kudos.text.text
      }
    }
  } as ActionSignW3cVc)

  if (args.body.view.state.values?.result_channel_block?.result_channel_id?.selected_conversation) {
    try {
      const issuerName = await credential.issuer.getLatestClaimValue(agent.dbConnection, {type: 'name'})
      const subjectName = await credential.subject.getLatestClaimValue(agent.dbConnection, {type: 'name'})
      const image_url = `${process.env.BASE_URL}img/c/${credential.id}/png`
      const text = `<${process.env.BASE_URL}identity/${credential.issuer.did}|${issuerName}> gave  <${process.env.BASE_URL}c/${credential.id}|${kudos.text.text}> kudos to <${process.env.BASE_URL}identity/${credential.subject.did}|${subjectName}>`
      await app.client.chat.postMessage({
        token: args.context.botToken,
        channel: args.body.view.state.values?.result_channel_block?.result_channel_id?.selected_conversation,
        unfurl_links: false,
        blocks: [
          {
            "type": "section",
            "text": {
              "type": "mrkdwn",
              text
            },
            "accessory": {
              "type": "button",
              "action_id": "message_give_pressed",
              "text": {
                "type": "plain_text",
                "text": "Give",
                "emoji": true
              },
              "value": `${credential.id}`
            }
          },
          
          {
            "type": "image",
            "title": {
              "type": "plain_text",
              "text": "Kudos",
              "emoji": true
            },
            image_url,
            "alt_text": "Kudos"
          }
        ],
        text
      });
    }
    catch (error) {
      console.error(error);
    }
  }
  
})



app.command('/profile', async ({ command, ack, say, payload, context, body }) => {
  await ack();

  const found = body.text.match(/@\w+/g)
  const subjectUserId = found && found[0] && found[0].substring(1)

  try {
    const result = await app.client.views.open({
      token: context.botToken,
      trigger_id: body.trigger_id,
      view: await getProfileView({initial_user: subjectUserId}, app, context.botToken)
    });
  }
  catch (error) {
    console.error(error);
  }
});



app.action('profileView_user_selected', async ({ ack, body, context, payload }) => {
  await ack();
  console.dir(body, {depth: 10})
  console.dir(context, {depth: 10})
  console.dir(payload, {depth: 10})
  //@ts-ignore
  const initial_user = payload.selected_user

  try {
    const result = await app.client.views.update({
      token: context.botToken,
      //@ts-ignore
      view_id: body.view.id,
      view: await getProfileView({initial_user}, app, context.botToken)
    });
  }
  catch (error) {
    console.error(error);
  }
});


app.event('link_shared', async ({ payload, context }) => {
  const unfurls = {}
  for(const link of payload.links) {
    const found = link.url.match(/https\:\/\/i227\.dev\/c\/(.*)/)
    if (found && found[1]) {
      const id = found[1]
      const { credentials } = await api.request(queries.getCredentialsById, { id })
      const credential = credentials[0]
    
      const image_url = `${process.env.BASE_URL}img/c/${credential.id}/png`
      const text = `<${process.env.BASE_URL}identity/${credential.issuer.did}|${credential.issuer.name}> gave <${process.env.BASE_URL}c/${credential.id}|${credential.claims[0].value}> kudos to <${process.env.BASE_URL}identity/${credential.subject.did}|${credential.subject.name}>`

      unfurls[link.url] = {
        blocks: [
          { "type": "section", "text": { "type": "mrkdwn", text }},
          { "type": "image", "title": { "type": "plain_text", "text": "Kudos", "emoji": true }, image_url, "alt_text": "Kudos"}
        ]
      }
    }
  }
      
  try {
    const data = {
      channel: payload.channel,
      token: context.botToken,
      ts: payload.message_ts,
      unfurls
    }

    await app.client.chat.unfurl(data)
  } catch (e) {
    console.error(e)
  }
})

app.event('app_home_opened', async ({ payload, context }) => {
  const profileBlocks = await getProfileBlocks(payload.user, app, context.botToken)
  await app.client.views.publish({
    token: context.botToken,
    user_id: payload.user,
    view: {
      type: "home",
      "blocks": [
        {
          "type": "actions",
          "elements": [
            {
              "type": "button",
              action_id: "home_give_kudos_pressed",
              "text": {
                "type": "plain_text",
                "text": "Give kudos",
                "emoji": true,
              },
              "style": "primary",
              "value": "click_me_123"
            },
            {
              "type": "button",
              action_id: "home_check_profile_pressed",
              "text": {
                "type": "plain_text",
                "text": "View other profile",
                "emoji": true
              },
              "value": "click_me_123"
            },
          ]
        },
        {
          type: "divider"
        },
        ...profileBlocks       
      ]
    }
  })

})

app.action('home_give_kudos_pressed', async ({ ack, say, payload, context, body }) => {
  await ack();

  try {
    await app.client.views.open({
      token: context.botToken,
      //@ts-ignore
      trigger_id: body.trigger_id,
      view: getKudosFormView({})
    });
  }
  catch (error) {
    console.error(error);
  }
});


app.action('home_check_profile_pressed', async ({ ack, say, payload, context, body }) => {
  await ack();

  try {
    await app.client.views.open({
      token: context.botToken,
      //@ts-ignore
      trigger_id: body.trigger_id,
      view: await getProfileView({}, app, context.botToken)
    });
  }
  catch (error) {
    console.error(error);
  }
});


app.action('message_give_pressed', async ({ ack, say, payload, context, body }) => {
  await ack();
  console.log({payload, context, body})
  try {
    const data = {
      token: context.botToken,
      channel: body.channel.id,
      //@ts-ignore
      ts: body.message.ts,
      //@ts-ignore
      text: body.message.text,
      //@ts-ignore
      blocks: [{
        "type": "context",
        "elements": [
          {
            "type": "image",
            "image_url": "https://secure.gravatar.com/avatar/82f63bb5062699f9e9fce88fa9659b3b.jpg?s=512&d=https%3A%2F%2Fa.slack-edge.com%2Fdf10d%2Fimg%2Favatars%2Fava_0004-512.png",
            "alt_text": "palm tree"
          },

          {
            "type": "image",
            "image_url": "https://avatars.slack-edge.com/2020-04-10/1046418716583_3ac8789fa1a089bf8a31_512.jpg",
            "alt_text": "palm tree"
          },
          {
            "type": "image",
            "image_url": "https://avatars.slack-edge.com/2019-07-03/683888599765_ede58ff4caa79406242e_512.jpg",
            "alt_text": "palm tree"
          },

          {
            "type": "image",
            "image_url": "https://avatars.slack-edge.com/2020-04-18/1071540051714_37f94326b84e67ed0de0_512.png",
            "alt_text": "palm tree"
          },
          {
            "type": "mrkdwn",
            "text": "From: <https://i227.dev/identity/did:ethr:rinkeby:0xc4aa56b0b5f4b3eca39ef12fcdd67639ac84dbb5|Simonas Karuzas> and 32+"
          }
        ]
      }],
    }
    console.log(data)
    await app.client.chat.update(data)
  } catch (e) {
    console.error(e)
  }

});


const main = async () => {
  await app.start(process.env.BOLT_PORT);
  console.log('⚡️ Bolt app is running!');
}

main().catch(console.error)