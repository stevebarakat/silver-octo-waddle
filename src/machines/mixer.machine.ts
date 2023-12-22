import { ActorRefFrom, assign, createMachine, fromPromise } from "xstate";
import { createActorContext } from "@xstate/react";
import { trackMachine } from "./track.machine";
import { roxanne } from "../assets/songs";
import { loaded } from "tone";
import {
  start as initializeAudio,
  getContext as getAudioContext,
  Transport as t,
} from "tone";

const audio = getAudioContext();

export const mixerMachine = createMachine(
  {
    /** @xstate-layout N4IgpgJg5mDOIC5QFsCWAPMAnAdKiANmAMQQD2AdmHhQG5kDW1MALi6hVDlmAIYQBPANoAGALqJQABzKxU7SpJDpEAWgAsARgCsOAJwB2AEwA2bSaPaANCAFrNZnEZGnzlkR49GAvt5tpMXHwiYmwsMlwpAl4WADMI5BxWdk5uPkFRCSQQGTkFCiUVBFUHPRwRA3UjTQAOA2tbezr9Iz1quu1PL19-DGw0-gFiWN5YFgAxAHcITKVc+VRFbKKAZj1NHFqV7T0V+ps7Ytqyqrba+q6XHpAA-p5B4h5JjhnxOdkFpdAihxEcAzMFgahxKNROrXaFy6Pj8Nz6uHughwYzIUikkGIUV4wje2Xm+UK9j0NScriBB0QtRMm3MBnO6j0jMZNWutwR6QEyJYqPREEecDALFmeI+BOWanUKz+dTBInJjQQkvKJhMdQZTKZLNhbIGSKxAg4UH5sEFwukosWBXFxW2Bhw6mMgMsFIQRjBm0s6lV9VZ8N1nP1hsxvAAriazTkLV9lJScNptDUdntgYg3WVNJ7vdpfLCKGQIHAlGz3nlLYTitpTDgZXo5c6FRoKjTtAYahns9q-cEwCXPlbvhLanHNHptCt2y7VOOymYW23LL7Av7e2KB8UHSSa3WU+v1PaVuP3Jcrp2l4jOSi0ZAV2XrVPDP8qucd1SaSY6WqNcTF3cOThA5wN7RqsugiIYTovhYOCAh+lRflqvhAA */
    id: "mixer",
    context: ({ input: currentTracks }) => ({
      currentTracks: currentTracks,
      trackActorRefs: [],
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
    },
  },
  {
    actions: {
      initializeMixer: assign({
        trackActorRefs: ({ context, self, spawn }) =>
          context.currentTracks.map((track, index) =>
            spawn(trackMachine, {
              input: { id: `track${index}`, track, parent: self },
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
    },
    guards: {},
  }
);

export const MixerContext = createActorContext(mixerMachine);
