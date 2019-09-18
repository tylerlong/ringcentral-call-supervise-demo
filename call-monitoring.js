import RingCentral from 'ringcentral-js-concise'
import PubNub from 'ringcentral-js-concise/dist/pubnub'
import fs from 'fs'

const deviceId = fs.readFileSync('temp.txt', 'utf-8')

const rc = new RingCentral(
  process.env.RINGCENTRAL_CLIENT_ID,
  process.env.RINGCENTRAL_CLIENT_SECRET,
  process.env.RINGCENTRAL_SERVER_URL
)

;(async () => {
  await rc.authorize({
    username: process.env.RINGCENTRAL_USERNAME,
    extension: process.env.RINGCENTRAL_EXTENSION,
    password: process.env.RINGCENTRAL_PASSWORD
  })

  // 590490017 is for ext 116
  const pubnub = new PubNub(rc, ['/restapi/v1.0/account/~/extension/590490017/telephony/sessions'], async message => {
    // console.log(JSON.stringify(message, null, 2))
    if (message.body.parties.some(p => p.status.code === 'Answered' && p.direction === 'Inbound')) {
      const r = await rc.post(`/restapi/v1.0/account/~/telephony/sessions/${message.body.telephonySessionId}/supervise`, {
        mode: 'Listen',
        supervisorDeviceId: deviceId,
        agentExtensionNumber: '116'
      })
      console.log(r.data)
    }
  })
  await pubnub.subscribe()
})()
