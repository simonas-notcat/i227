import { View } from '@slack/types'

export const getProfileView = (options: {initial_conversation?: string, initial_user?: string}): View => ( {
  "type": "modal",
  callback_id: 'profileView',
	"title": {
		"type": "plain_text",
		"text": "Kudos profile",
		"emoji": true
	},
	"close": {
		"type": "plain_text",
		"text": "Cancel",
		"emoji": true
	},
	"blocks": [
    {
      "type": "section",
      "block_id": "user_select_block",
			"text": {
				"type": "mrkdwn",
				"text": "Select a user to view their profile"
			},
			"accessory": {
				"type": "users_select",
        "action_id": "user_selected",
				"placeholder": {
					"type": "plain_text",
					"text": "Select a user",
					"emoji": true
				},
			}
		}
	]
}

)