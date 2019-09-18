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

  const r = await rc.get('/restapi/v1.0/account/~/extension')
  const agentExt = r.data.records.filter(ext => ext.extensionNumber === process.env.RINGCENTRAL_AGENT_EXT)[0]
  console.log(agentExt)

  const pubnub = new PubNub(rc, [`/restapi/v1.0/account/~/extension/${agentExt.id}/telephony/sessions`], async message => {
    // console.log(JSON.stringify(message, null, 2))
    if (message.body.parties.some(p => p.status.code === 'Answered' && p.direction === 'Inbound')) {
      const r = await rc.post(`/restapi/v1.0/account/~/telephony/sessions/${message.body.telephonySessionId}/supervise`, {
        mode: 'Listen',
        supervisorDeviceId: deviceId,
        agentExtensionNumber: agentExt.extensionNumber
      })
      console.log(r.data)
    }
  })
  await pubnub.subscribe()
})()
