import { config } from 'dotenv'
import { Credential } from 'daf-core'
import { ActionSignW3cVc, ActionTypes } from 'daf-w3c'
import { App, LogLevel } from '@slack/bolt'
import * as CredentialForm from './blocks/credential-form'
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

app.action('kudos_selected', async ({ ack, body, context }) => {
  await ack();

})

app.action('user_selected', async ({ ack, body, context }) => {
  await ack();
})

app.view('credentialForm', async(args) => {
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

app.command('/dev', async ({ command, ack, say, payload, context, body }) => {
  // Acknowledge command request
  await ack();

  try {
    const result = await app.client.views.open({
      token: context.botToken,
      // Pass a valid trigger_id within 3 seconds of receiving it
      trigger_id: body.trigger_id,
      // View payload
      view: {
        type: 'modal',
        // View identifier
        callback_id: 'credentialForm',
        title: {
          type: 'plain_text',
          text: 'Modal title'
        },
        blocks: CredentialForm.blocks,
        submit: {
          type: 'plain_text',
          text: 'Sign'
        }
      }
    });
  }
  catch (error) {
    console.error(error);
  }

});


(async () => {
  await initDB()
  await app.start(process.env.BOLT_PORT);
  console.log('⚡️ Bolt app is running!');
})()