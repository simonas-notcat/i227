import { App } from '@slack/bolt'
import { getIdentityAndUpdateProfile} from '../../helpers/users'

export const getSlackUserIdentity = async (slackUserId: string, app: App, token: string) => {
  const result: any = await app.client.users.info({ token, user: slackUserId })
  return getIdentityAndUpdateProfile({
      alias: 'slack' + slackUserId,
      nickname: result.user?.name,
      picture: result.user?.profile?.image_512,
      name: result.user?.profile?.real_name
  })

}