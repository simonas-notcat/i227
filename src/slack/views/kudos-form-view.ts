import { View } from '@slack/types'

export const getKudosFormView = (options: {initial_conversation?: string, initial_user?: string}): View => {

  const view: View = {
    type: 'modal',
    callback_id: 'kudosForm',
    title: {
      type: 'plain_text',
      text: 'Give public kudos',
      emoji: true
    },
    blocks: [
      {
        "type": "input",
        "block_id": "user_select_block",
        "element": {
          "type": "users_select",
          "action_id": "user_selected",
          "placeholder": {
            "type": "plain_text",
            "emoji": true,
            "text": "Select a user"
          },
        },
        "label": {
          "type": "plain_text",
          "text": "User",
          "emoji": true
        }
      },
      {
        "type": "input",
        "block_id": "kudos_select_block",
        "element": {
          //@ts-ignore
          "type": "radio_buttons",
          "action_id": "kudos_selected",
          "options": [
            {
              "text": {
                "type": "plain_text",
                "text": "Thank you",
                "emoji": true
              },
              "value": "value-0"
            },
            {
              "text": {
                "type": "plain_text",
                "text": "Going Above and Beyond",
                "emoji": true
              },
              "value": "value-1"
            },
            {
              "text": {
                "type": "plain_text",
                "text": "Inspirational Leader",
                "emoji": true
              },
              "value": "value-2"
            },
            {
              "text": {
                "type": "plain_text",
                "text": "Team Player",
                "emoji": true
              },
              "value": "value-3"
            },
            {
              "text": {
                "type": "plain_text",
                "text": "Great Job",
                "emoji": true
              },
              "value": "value-4"
            },
            {
              "text": {
                "type": "plain_text",
                "text": "Making Work Fun",
                "emoji": true
              },
              "value": "value-5"
            },
            {
              "text": {
                "type": "plain_text",
                "text": "Amazing Mentor",
                "emoji": true
              },
              "value": "value-6"
            },
            {
              "text": {
                "type": "plain_text",
                "text": "Outside the Box Thinker",
                "emoji": true
              },
              "value": "value-7"
            },
            {
              "text": {
                "type": "plain_text",
                "text": "Great Presentation",
                "emoji": true
              },
              "value": "value-8"
            },
            {
              "text": {
                "type": "plain_text",
                "text": "Making an Impact",
                "emoji": true
              },
              "value": "value-9"
            },
          ]
        },
        "label": {
          "type": "plain_text",
          "text": "Select kudos award 🏆",
          "emoji": true
        }
      },
      {
        "block_id": "result_channel_block",
        "type": "input",
        "optional": true,
        "label": {
          "type": "plain_text",
          "text": "Select a channel to post the result on",
        },
        "element": {
          "action_id": "result_channel_id",
          "type": "conversations_select",
          "response_url_enabled": true,
        },
      },
    ],
    submit: {
      type: 'plain_text',
      text: 'Give'
    }
  }
  if (options.initial_user) {
    view.blocks[0]['element']['initial_user'] = options.initial_user
  }

  if (options.initial_conversation) {
    view.blocks[view.blocks.length - 1]['element']['initial_conversation'] = options.initial_conversation
  }
  return view
}
  