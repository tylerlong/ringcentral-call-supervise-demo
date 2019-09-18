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


## Check the saved audio

We got audio data in real time. We could have done something more meaningful with the data.
But for this demo we simply append the data to an audio file `audio.raw`.

You can play the saved audio by:

```
play -b 16 -e signed -c 1 -r 8000 audio.raw
```

The audio content should be same as the incoming call to `RINGCENTRAL_AGENT_EXT` we made.
