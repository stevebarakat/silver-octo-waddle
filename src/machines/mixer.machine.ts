import { ActorRefFrom, assign, createMachine } from "xstate";
import { createActorContext } from "@xstate/react";
import { trackMachine } from "./track.machine";
import { roxanne } from "../assets/songs";

export const mixerMachine = createMachine(
  {
    id: "mixer",
    context: ({ input: currentTracks }) => ({
      currentTracks: currentTracks,
      trackActorRefs: [],
    }),
    initial: "initializing",
    states: {
      initializing: {
        entry: ["createInitialTracks"],
        always: "idle",
      },
      idle: {
        on: {
          ["mixer.addTrack"]: {
            actions: ["addTrack"],
            guard: "maximumTracksNotReached",
          },
          ["mixer.clearTracks"]: {
            actions: ["clearTracks"],
          },
          ["mixer.deleteTrack"]: {
            actions: ["deleteTrack"],
          },
        },
      },
    },
    types: {} as {
      context: {
        trackActorRefs: ActorRefFrom<typeof trackMachine>[];
      };
      events:
        | { type: "mixer.addTrack" }
        | { type: "mixer.clearTracks" }
        | { type: "mixer.deleteTrack"; id: string };
      guards: {
        type: "maximumTracksNotReached";
      };
    },
  },
  {
    actions: {
      createInitialTracks: assign({
        trackActorRefs: ({ self, spawn }) =>
          roxanne.tracks.map((track, index) =>
            spawn(trackMachine, {
              input: { id: `track${index}`, track, parent: self },
            })
          ),
      }),
    },
    guards: {},
  }
);

export const MixerContext = createActorContext(mixerMachine);
