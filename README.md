# RingCentral call supervise demo


## Setup

```
yarn install
```


## Run

```
yarn supervisor
```

Command above create a softphone, which will be used as the supervisor's RingCentral device.


```
yarn monitor
```

Command above will setup a monitor, whenever there is phone call ongoing, supervise API will be invoked to setup the supervision.



## Test



## Play the saved audio

```
play -b 16 -e signed -c 1 -r 8000 audio.raw
```
