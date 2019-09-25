# RingCentral call supervise demo

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
