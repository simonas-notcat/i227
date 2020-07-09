import { View, Block } from '@slack/types'
import { App } from '@slack/bolt'
import { formatDistanceToNow } from 'date-fns'
import { getSlackUserIdentity } from '../helpers/users'
import { getLatestClaimValue } from '../../helpers/users'
import { agent } from '../../agent/agent'
import { VerifiableCredential } from 'daf-core'

export const getProfileView = async (options: { initial_user?: string }, app: App, token: string): Promise<View> => { 

  let blocks = [{
    "type": "section",
    "block_id": "user_select_block",
    "text": {
      "type": "mrkdwn",
      "text": "Select a user to view their profile"
    },
    "accessory": {
      "type": "users_select",
      "action_id": "profileView_user_selected",
      "placeholder": {
        "type": "plain_text",
        "text": "Select a user",
        "emoji": true
      },
    }
  }]

  if (options.initial_user) {
    blocks[0]['accessory']['initial_user'] = options.initial_user
    const profileBlocks = await getProfileBlocks(options.initial_user, app, token)
    //@ts-ignore
    blocks = [...blocks, ...profileBlocks]
  }

  const view: View = {
    "type": "modal",
    callback_id: 'profileView',
    "title": {
      "type": "plain_text",
      "text": "User profile",
      "emoji": true
    },
    "close": {
      "type": "plain_text",
      "text": "Cancel",
      "emoji": true
    },
    blocks
  }

  return view
}

export const getProfileBlocks = async(slackUserId: string, app: App, token: string) => {
  const blocks = []
  const subject = await getSlackUserIdentity(slackUserId, app, token)
    const name = await getLatestClaimValue({ type: 'name', credentialType: 'VerifiableCredential,Profile', did: subject.did })
    const picture = await getLatestClaimValue({ type: 'picture', credentialType: 'VerifiableCredential,Profile', did: subject.did })
    blocks.push({
      "type": "section",
      "text": {
        "type": "mrkdwn",
        "text": `:trophy: Kudos awards \n*${name}*`
      },
      "accessory": {
        "type": "image",
        //@ts-ignore
        "image_url": picture,
        "alt_text": "plants"
      }
    },
    {
      "type": "divider"
    })

    const posts = await agent.dataStoreORMGetVerifiableCredentials({
      where: [
        { column: 'type', value: ['VerifiableCredential,Post'] }
      ],
      order: [
        { column: 'issuanceDate', direction: 'DESC' }
      ]
    })
    
    for (const post of posts) {
      const item = await listItem(post)
      //@ts-ignore
      blocks = [...blocks, ...item]
    }
  return blocks
}

const listItem = async (post: VerifiableCredential) => {
  const name = await getLatestClaimValue({ type: 'name', credentialType: 'VerifiableCredential,Profile', did: post.issuer.id })
  const picture = await getLatestClaimValue({ type: 'picture', credentialType: 'VerifiableCredential,Profile', did: post.issuer.id })

  return [
    {
      "type": "section",
      "text": {
        "type": "mrkdwn",
        "text": JSON.stringify(post.credentialSubject)
      }
    },
    {
      "type": "context",
      "elements": [
        {
          "type": "image",
          "image_url": picture,
          "alt_text": "plants"
        },
        {
          "type": "mrkdwn",
          "text": `*${name}* | ` + formatDistanceToNow(new Date(post.issuanceDate))
        }
      ]
    },
    {
      "type": "divider"
    }    
  ]
}