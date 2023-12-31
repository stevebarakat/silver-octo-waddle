import { dbToPercent, log } from "@/utils";
import { createActorContext } from "@xstate/react";
import { animationFrameScheduler, interval } from "rxjs";
import { Channel, Meter, Player } from "tone";
import { assign, createMachine, fromObservable } from "xstate";

export const trackMachine = createMachine(
  {
    id: "track",
    context: ({ input }) => ({
      muted: false,
      soloed: false,
      track: input.track,
      volume: input.track.volume,
      channel: new Channel(),
      meter: new Meter(),
      meterVals: new Float32Array(),
    }),
    initial: "ready",
    invoke: {
      src: "tickerActor",
      id: "start.ticker",
      onSnapshot: {
        actions: assign(({ context }) => {
          return {
            meterVals: context.meter.getValue(),
          };
        }),
      },
    },
    states: {
      ready: {
        entry: {
          type: "initializeTrack",
        },
        on: {
          "track.setMeter": {
            actions: ["setMeter"],
          },
          "track.setVolume": {
            actions: ["setVolume"],
          },
          "track.toggleSolo": {
            actions: ["toggleSolo"],
          },
          "track.toggleMute": {
            actions: ["toggleMute"],
          },
        },
      },
    },
    types: {} as {
      context: {
        muted: boolean;
        soloed: boolean;
        track: TrackSettings;
        volume: number;
        channel: Channel;
        meter: Meter;
        meterVals: Float32Array;
      };
      events:
        | { type: "track.setVolume"; volume: number }
        | { type: "track.setMeter"; meterVals: Float32Array }
        | { type: "track.toggleSolo"; checked: boolean }
        | { type: "track.toggleMute"; checked: boolean };
    },
  },
  {
    actions: {
      initializeTrack: ({ context }) => {
        const player = new Player(context.track.path).sync().start();
        const channel = context.channel.connect(context.meter).toDestination();
        player.connect(channel);
        return { channel };
      },
      setMeter: assign(({ context, event }) => {
        if (event.type !== "track.setMeter") throw new Error();
        return {
          meterVals: context.meterVals,
        };
      }),
      setVolume: assign(({ context, event }) => {
        if (event.type !== "track.setVolume") throw new Error();
        const scaled = dbToPercent(log(event.volume));
        context.channel.volume.value = scaled;
        return {
          volume: event.volume,
        };
      }),
      toggleSolo: assign(({ context, event }) => {
        if (event.type !== "track.toggleSolo") throw new Error();
        context.channel.solo = event.checked;
        return {
          soloed: event.checked,
        };
      }),
      toggleMute: assign(({ context, event }) => {
        if (event.type !== "track.toggleMute") throw new Error();
        context.channel.mute = event.checked;
        return {
          muted: event.checked,
        };
      }),
    },
    actors: {
      tickerActor: fromObservable(() => interval(0, animationFrameScheduler)),
    },
  }
);

export const TrackContext = createActorContext(trackMachine);
