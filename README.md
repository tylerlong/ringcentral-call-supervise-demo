# RingCentral call supervise demo

Article: [Automatically superevise your call agents](https://medium.com/ringcentral-developers/automatically-supervise-your-call-agents-78c0cd7caf7f)


## Setup

```
yarn install
cp .env.sample .env
```

Edit `.env` to specify credentials.

 - `RINGCENTRAL_USERNAME` is the supervisor
 - `RINGCENTRAL_AGENT_EXT` is the extension number to be supervised, such as `116`


## Run

```
yarn server
```


## Test

Make a incoming call to `RINGCENTRAL_AGENT_EXT`, answer it, talk via the phone call.

Watch the console output, you should see something like `live audio data received, sample rate is 8000`.

The audio will also be played by your speaker.

An audio file will be saved to `call.raw`, you can play it by `play -e signed -b 16 -c 1 -r 8000 call.raw`.
