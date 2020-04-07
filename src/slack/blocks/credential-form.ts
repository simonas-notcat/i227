export const blocks = [
  {
    "type": "section",
    "text": {
      "type": "mrkdwn",
      "text": "Show your appretiation by sending a *public* kudos"
    }
  },
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
      }
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
      "type": "static_select",
      "placeholder": {
        "type": "plain_text",
        "emoji": true,
        "text": "Select kudos"
      },
      "action_id": "kudos_selected",
      "options": [
        {
          "text": {
            "type": "plain_text",
            "text": "Team player",
            "emoji": true
          },
          "value": "value-0"
        },
        {
          "text": {
            "type": "plain_text",
            "text": "Hard worker",
            "emoji": true
          },
          "value": "value-1"
        },
        {
          "text": {
            "type": "plain_text",
            "text": "Good guy",
            "emoji": true
          },
          "value": "value-2"
        }
      ]
    },
    "label": {
      "type": "plain_text",
      "text": "Label",
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
]