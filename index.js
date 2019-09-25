import RingCentral from '@ringcentral/sdk'
import Subscriptions from '@ringcentral/subscriptions'
import fs from 'fs'
import { nonstandard } from 'wrtc'
import Softphone from 'ringcentral-softphone'

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
  const softphone = new Softphone(rc)
  await softphone.register()

  let audioSink
  let audioStream
  const audioPath = 'audio.raw'
  if (fs.existsSync(audioPath)) {
    fs.unlinkSync(audioPath)
  }
  softphone.on('INVITE', sipMessage => {
    softphone.answer(sipMessage)
    softphone.on('track', e => {
      audioSink = new nonstandard.RTCAudioSink(e.track)
      audioStream = fs.createWriteStream(audioPath, { flags: 'a' })
      audioSink.ondata = data => {
        console.log(`live audio data received, sample rate is ${data.sampleRate}`)
        audioStream.write(Buffer.from(data.samples.buffer))
      }
      softphone.on('BYE', () => {
        audioSink.stop()
        audioStream.end()
      })
    })
  })

  const r = await rc.get('/restapi/v1.0/account/~/extension')
  const json = await r.json()
  const agentExt = json.records.filter(ext => ext.extensionNumber === process.env.RINGCENTRAL_AGENT_EXT)[0]
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
      await rc.post(`/restapi/v1.0/account/~/telephony/sessions/${message.body.telephonySessionId}/supervise`, {
        mode: 'Listen',
        supervisorDeviceId: softphone.device.id,
        agentExtensionNumber: agentExt.extensionNumber
      })
    }
  })
  await subscription.register()
})()
