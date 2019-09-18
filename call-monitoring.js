import RingCentral from '@ringcentral/sdk'
import { Subscriptions } from '@ringcentral/subscriptions'
import fs from 'fs'

const deviceId = fs.readFileSync('temp.txt', 'utf-8')

const rc = new RingCentral({
  server: process.env.RINGCENTRAL_SERVER_URL,
  clientId: process.env.RINGCENTRAL_CLIENT_ID,
  clientSecret: process.env.RINGCENTRAL_CLIENT_SECRET
})

;(async () => {
  await rc.login({
    username: process.env.RINGCENTRAL_USERNAME,
    extension: process.env.RINGCENTRAL_EXTENSION,
    password: process.env.RINGCENTRAL_PASSWORD
  })

  const r = await rc.get('/restapi/v1.0/account/~/extension')
  const json = await r.json()
  const agentExt = json.records.filter(ext => ext.extensionNumber === process.env.RINGCENTRAL_AGENT_EXT)[0]
  console.log(agentExt)

  const subscriptions = new Subscriptions({
    sdk: rc
  })
  const subscription = subscriptions.createSubscription({
    pollInterval: 10 * 1000,
    renewHandicapMs: 2 * 60 * 1000
  })
  subscription.setEventFilters([`/restapi/v1.0/account/~/extension/${agentExt.id}/telephony/sessions`])
  subscription.on(subscription.events.notification, async function (message) {
    if (message.body.parties.some(p => p.status.code === 'Answered' && p.direction === 'Inbound')) {
      const r = await rc.post(`/restapi/v1.0/account/~/telephony/sessions/${message.body.telephonySessionId}/supervise`, {
        mode: 'Listen',
        supervisorDeviceId: deviceId,
        agentExtensionNumber: agentExt.extensionNumber
      })
      console.log(r.data)
    }
  })
  await subscription.register()
})()
