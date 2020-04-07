import { config } from 'dotenv'
import { Credential } from 'daf-core'
import { ActionSignW3cVc, ActionTypes } from 'daf-w3c'
import { App, LogLevel } from '@slack/bolt'
import { getKudosFormView } from './views/kudos-form-view'
import { getProfileView } from './views/profile-view'
import { getSlackUserDid } from './helpers/users'
import { initDB } from '../database'
import { agent } from '../agent'

config()

// Initializes your app with your bot token and signing secret
const app = new App({
  token: process.env.SLACK_BOT_TOKEN,
  signingSecret: process.env.SLACK_SIGNING_SECRET,
  logLevel: LogLevel.DEBUG
});





app.command('/kudos', async ({ command, ack, say, payload, context, body }) => {
  await ack();

  const found = body.text.match(/@\w+/g)
  const subjectUserId = found && found[0] && found[0].substring(1)
  console.log({subjectUserId})

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

  const channel = args.body.view.state.values?.result_channel_block?.result_channel_id?.selected_conversation || args.body.user.id
  const kudos = args.body.view.state.values?.kudos_select_block?.kudos_selected?.selected_option
  const subjectSlackId = args.body.view.state.values?.user_select_block?.user_selected?.selected_user
  const issuerSlackId = args.body.user.id

  const issuerDid = await getSlackUserDid(issuerSlackId, app, args.context.botToken)
  const subjectDid = await getSlackUserDid(subjectSlackId, app, args.context.botToken)

  const credential: Credential = await agent.handleAction({
    type: ActionTypes.signCredentialJwt,
    save: true,
    data: {
      '@context': ['https://www.w3.org/2018/credentials/v1'],
      type: ['VerifiableCredential', 'Kudos'],
      issuer: issuerDid,
      credentialSubject: {
        id: subjectDid,
        kudos: kudos.text.text
      }
    }
  } as ActionSignW3cVc)

  try {
    await app.client.chat.postMessage({
      token: args.context.botToken,
      channel,
      text: `<@${issuerSlackId}> sent *${kudos.text.text}* <${process.env.BASE_URL}credential/${credential.hash}|kudos> to <@${subjectSlackId}>`
    });
  }
  catch (error) {
    console.error(error);
  }
  
})



app.command('/profile', async ({ command, ack, say, payload, context, body }) => {
  await ack();
  console.dir(body, {depth: 10})
  console.dir(context, {depth: 10})
  console.dir(payload, {depth: 10})


  try {
    const result = await app.client.views.open({
      token: context.botToken,
      trigger_id: body.trigger_id,
      view: getProfileView({})
    });
  }
  catch (error) {
    console.error(error);
  }
});

app.view('profileView', async(args) => {
  await args.ack()
  console.log(args.body)
  console.log(args.body.view.state.values)
});


app.action('user_selected', async ({ ack, body, context, payload }) => {
  await ack();
  console.dir(body, {depth: 10})
  console.dir(context, {depth: 10})
  console.dir(payload, {depth: 10})

});

app.event('app_home_opened', async ({ payload, context }) => {
  await app.client.views.publish({
    token: context.botToken,
    user_id: payload.user,
    view: {
      type: "home",
      "blocks": [
        {
          "type": "section",
          "text": {
            "type": "mrkdwn",
            "text": "Give kudos"
          },
          "accessory": {
            "type": "button",
            action_id: "home_give_kudos_pressed",
            "text": {
              "type": "plain_text",
              "text": "Give",
              "emoji": true
            },
            "value": "click_me_123"
          }
        },
        {
          "type": "section",
          "text": {
            "type": "mrkdwn",
            "text": "Check profile"
          },
          "accessory": {
            "type": "button",
            action_id: "home_check_profile_pressed",
            "text": {
              "type": "plain_text",
              "text": "Profile",
              "emoji": true
            },
            "value": "click_me_123"
          }
        },        
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
      view: getProfileView({})
    });
  }
  catch (error) {
    console.error(error);
  }
});


const main = async () => {
  await initDB()
  await app.start(process.env.BOLT_PORT);
  console.log('⚡️ Bolt app is running!');
}

main().catch(console.error)