import { assign, createMachine, fromObservable, fromPromise } from "xstate";
import type { InitialContext } from "@/App";
import { createActorContext } from "@xstate/react";
import { trackMachine } from "./track.machine";
import { interval, animationFrameScheduler } from "rxjs";
import { Destination, loaded } from "tone";
import {
  start as initializeAudio,
  getContext as getAudioContext,
  Transport as t,
} from "tone";
import { dbToPercent, formatMilliseconds, log } from "@/utils";

const audio = getAudioContext();

export type MixerMachineEvents =
  | { type: "setVolume"; volume: number }
  | { type: "setMeter" };

export const mixerMachine = createMachine(
  {
    id: "mixer",
    context: ({ input: initialContext }) => ({
      ...initialContext,
    }),
    initial: "idle",
    states: {
      idle: {
        invoke: {
          src: "loaderActor",
          id: "getting.ready",
          onDone: "ready",
          onError: [
            {
              target: "idle",
              actions: { type: "initializeMixer" },
            },
          ],
        },
      },
      ready: {
        invoke: {
          src: "tickerActor",
          id: "start.ticker",
          onSnapshot: {
            actions: assign(({ context, event }) => {
              const currentTime = formatMilliseconds(t.seconds);
              Destination.connect(context.currentMain.meter);
              const meterVals = context.currentMain.meter.getValue();
              console.log("meterVals", meterVals);
              context.currentMain.meterVals = meterVals;
              return {
                meterVals,
                currentTime,
              };
            }),
          },
        },
        initial: "stopped",
        states: {
          stopped: {
            on: {
              play: {
                target: "playing",
              },
              reset: {
                target: "stopped",
                actions: {
                  type: "reset",
                },
              },
            },
          },
          playing: {
            entry: {
              type: "play",
            },
            on: {
              reset: {
                target: "stopped",
                actions: {
                  type: "reset",
                },
              },
              pause: {
                target: "stopped",
                actions: {
                  type: "pause",
                },
              },
            },
          },
        },
        on: {
          fastFwd: {
            actions: {
              type: "fastFwd",
            },
          },

          rewind: {
            actions: {
              type: "rewind",
            },
          },

          setVolume: {
            actions: {
              type: "setVolume",
            },
          },
        },
      },
    },
    types: {} as {
      context: InitialContext;
      events: MixerMachineEvents;
    },
  },
  {
    actions: {
      play: () => {
        if (audio.state === "suspended") {
          initializeAudio();
          return t.start();
        } else {
          return t.start();
        }
      },
      pause: () => t.pause(),
      reset: () => {
        t.stop();
        t.seconds = 0;
      },
      fastFwd: () => {
        t.seconds = t.seconds + 10;
      },
      rewind: () => {
        t.seconds = t.seconds - 10;
      },
      setMeter: assign(({ context, event }) => {
        console.log("message");
        if (event.type !== "setMeter") throw new Error();
        return {
          meterVals: context.currentMain.meterVals,
        };
      }),
      setVolume: assign(({ context, event }) => {
        if (event.type !== "setVolume") throw new Error();
        const scaled = dbToPercent(log(event.volume));
        Destination.volume.value = scaled;
        const currentMain = context.currentMain;
        currentMain.volume = event.volume;
        return { currentMain };
      }),
    },
    actors: {
      loaderActor: fromPromise(async () => await loaded()),
      tickerActor: fromObservable(() => interval(0, animationFrameScheduler)),
    },
    guards: {},
  }
);

export const MixerContext = createActorContext(mixerMachine);
