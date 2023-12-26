import {
  ActorRefFrom,
  assign,
  createMachine,
  fromObservable,
  fromPromise,
} from "xstate";
import { createActorContext } from "@xstate/react";
import { trackMachine } from "./track.machine";
import { interval, animationFrameScheduler } from "rxjs";
import { loaded } from "tone";
import {
  start as initializeAudio,
  getContext as getAudioContext,
  Transport as t,
} from "tone";
import { formatMilliseconds } from "@/utils";

const audio = getAudioContext();

export type MixerMachineEvents =
  | { type: "mixer.addTrack" }
  | { type: "mixer.clearTracks" }
  | { type: "mixer.deleteTrack"; id: string };

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
            actions: assign(() => {
              const currentTime = formatMilliseconds(t.seconds);
              return { currentTime };
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
        },
      },
    },
    types: {} as {
      context: {
        trackActorRefs: ActorRefFrom<typeof trackMachine>[];
      };
      events: MixerMachineEvents;
    },
  },
  {
    actions: {
      initializeMixer: assign({
        trackRefs: ({ context, self, spawn }) =>
          context.currentTracks.map((_, index) =>
            spawn(trackMachine, {
              input: { id: `track${index}`, parent: self },
            })
          ),
      }),
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
    },
    actors: {
      loaderActor: fromPromise(async () => await loaded()),
      tickerActor: fromObservable(() => interval(0, animationFrameScheduler)),
    },
    guards: {},
  }
);

export const MixerContext = createActorContext(mixerMachine);
