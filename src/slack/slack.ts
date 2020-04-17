import { config } from 'dotenv'
import { Credential } from 'daf-core'
import { ActionSignW3cVc, ActionTypes } from 'daf-w3c'
import { App, LogLevel } from '@slack/bolt'
import shortId from 'shortid'
import { getKudosFormView } from './views/kudos-form-view'
import { getProfileView, getProfileBlocks } from './views/profile-view'
import { getSlackUserIdentity } from './helpers/users'
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
      const image_url = `${process.env.BASE_URL}img/c/${credential.id}/png`
      console.log({image_url})
      await app.client.chat.postMessage({
        token: args.context.botToken,
        channel: args.body.view.state.values?.result_channel_block?.result_channel_id?.selected_conversation,
        blocks: [
          {
            "type": "section",
            "text": {
              "type": "mrkdwn",
              "text": `<@${issuerSlackId}> sent *${kudos.text.text}* <${process.env.BASE_URL}c/${credential.id}|kudos> to <@${subjectSlackId}>`
            }
          },
          // {
          //   "type": "image",
          //   "title": {
          //     "type": "plain_text",
          //     "text": "image1",
          //     "emoji": true
          //   },
          //   image_url,
          //   "alt_text": "image1"
          // }
        ],
        text: `<@${issuerSlackId}> sent *${kudos.text.text}* <${process.env.BASE_URL}c/${credential.id}|kudos> to <@${subjectSlackId}>`
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


const main = async () => {
  await app.start(process.env.BOLT_PORT);
  console.log('⚡️ Bolt app is running!');
}

main().catch(console.error)