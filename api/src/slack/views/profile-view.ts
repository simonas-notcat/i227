import { View, Block } from '@slack/types'
import { App } from '@slack/bolt'
import { Claim } from 'daf-core'
import { formatDistanceToNow } from 'date-fns'
import { getSlackUserIdentity } from '../helpers/users'
import { agent } from '../../agent/agent'

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
    const name = await subject.getLatestClaimValue(agent.dbConnection, {type: 'name'})
    const picture = await subject.getLatestClaimValue(agent.dbConnection, {type: 'picture'})
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

    const claims = await Claim.find({
      where: {
        subject: subject,
        type: 'kudos'
      }
    })
    for (const claim of claims) {
      const item = await kudosListItem(claim)
      //@ts-ignore
      blocks = [...blocks, ...item]
    }
  return blocks
}

const kudosListItem = async (claim: Claim) => {
  const image_url = await claim.issuer.getLatestClaimValue(agent.dbConnection, {type: 'picture'})
  const name = await claim.issuer.getLatestClaimValue(agent.dbConnection, {type: 'name'})
  return [
    {
      "type": "section",
      "text": {
        "type": "mrkdwn",
        "text": claim.value
      }
    },
    {
      "type": "context",
      "elements": [
        {
          "type": "image",
          image_url,
          "alt_text": "plants"
        },
        {
          "type": "mrkdwn",
          "text": `*${name}* | ` + formatDistanceToNow(claim.issuanceDate)
        }
      ]
    },
    {
      "type": "divider"
    }    
  ]
}