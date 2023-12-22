import { ActorRefFrom, assign, createMachine, fromPromise } from "xstate";
import { createActorContext } from "@xstate/react";
import { trackMachine } from "./track.machine";
import { roxanne } from "../assets/songs";
import { loaded } from "tone";

export const mixerMachine = createMachine(
  {
    /** @xstate-layout N4IgpgJg5mDOIC5QFsCWAPMAnAdKiANmAMQQD2AdmHhQG5kDW1MALi6hVDlmAIYQBPANoAGALqJQABzKxU7SpJDpEAWgCMANgCcOAOwAWTSO0BmPQFYANCAGIjInNpEAmABzqXFgL7ebaTFx8ImJsLDJcKQJeFgAzCOQcVnZObj5BUQkkEBk5BQolFQRVM30PLxs7BEd1PRdTA3MDbRbW4xdffwxsNP4BYljeWBYAMQB3CEylXPlURWyio1MnWu1NN0tKxBc9TRwLN00DEU0vTpAAnp4+4h4xjknxadlZ+dAi01MXfRE9EVNPNZbNtdvtDsdTj4-BdurhroJiLAwCwACpYXgAYwYADUyAQAK7IMBTbIzfKFNSaCw4UwWdQWSFbBA7PYHI4nM7Qy5w9L9JGo9FYgDKeLIAFl8SxiU9SS9yQtEKZdNp1BCKsCELU3PsDHoGk1Wi03Odub0Efy0ZiGAAFXgUEnSOVzAoKzUMnBGDZAqossHsyEm2FmgQ4YZkKRSSDEKK8YQyx15Z0U5luZaWPTlb2ICx-fYdLlB+EhsMRqM8fkOnJOt7KezuJwWAHqqoWf44NzaKFdQLBnAxgQcKC3ODIytkpOu7TawwudRepmaJU0zxrL2BntFvvRAecaO8fFIsfVl3vbYWb4WMybDWL3RN1eWXzQihkCBwJTc56JmtFVSzvT6A4V5ZsUGw0iyDKct2PTBGAX6vCetbMo0OC-P8gJMtqU4mAahpTvm0E8n08HyqeCC6qh9KMhqBieDgVLuIC65XLyoYsOGkYQCRE5kZ2lGQSBrY1OembMURghbrGg7cT+9jqGmjbONRVSnLozQuFSAZPkAA */
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
          onDone: "ready.stopped",
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
            guard: "canFF",
            actions: {
              type: "fastFwd",
            },
          },

          rewind: {
            guard: "canRew",
            actions: {
              type: "rewind",
            },
          },

          setTrackVolume: {
            actions: {
              type: "setTrackVolume",
            },
          },

          setTrackSoloMute: {
            actions: {
              type: "setTrackSoloMute",
            },
          },

          setTrackPan: {
            actions: {
              type: "setTrackPan",
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
        trackActorRefs: ({ self, spawn }) =>
          roxanne.tracks.map((track, index) =>
            spawn(trackMachine, {
              input: { id: `track${index}`, track, parent: self },
            })
          ),
      }),
    },
    actors: {
      loaderActor: fromPromise(async () => await loaded()),
    },
    guards: {},
  }
);

export const MixerContext = createActorContext(mixerMachine);
