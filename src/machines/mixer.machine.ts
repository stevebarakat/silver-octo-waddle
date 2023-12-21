import { ActorRefFrom, assign, createMachine } from "xstate";
import { createActorContext } from "@xstate/react";
import { trackMachine } from "./track.machine";
import { roxanne } from "../assets/songs";

const INITIAL_NUMBER_OF_TRACKS = 8;
const MAXIMUM_NUMBER_OF_TRACKS = 16;

export const mixerMachine = createMachine(
  {
    /** @xstate-layout N4IgpgJg5mDOIC5QFsCWAPMAnAdKgdqgC6oCGANqgF4FQDEA2gAwC6ioADgPazGpf52IdIgBMADiY5xARlEBWJgBYl4pTICcTAOzyANCACeiAMwA2cThlMNq8QpOb5ogL4uDaTLlQRyYOp7YOKQQEAAqWKQAxgDWzGxIINy8JAJCIggm2ho48tqyoko6EmoyBsYIotomOEVmJkpmTGbaNhqu7iCB3r7+3ThRfqRYEdExsPFCyXxpiRlZMjhmdaLmMvby8mVGiDLa2rXyJqJMDTLySqIaMmZuHhhBPn4BD7gQYH5EYKOxk4nTqUEc1MrRwWjMhTUSg02hup3KiFkuSYKKa2nqumuSjcnXwXHe8ES3SmPBmQNAGQAtGYEQhqXcuq88IQSBRqLQSSl+OThIhLrSGjUmhojkxVtVrvIGf0nmBOWT0nzRKJchcLDITOZ5Ms1ALtEocCZ5LZxOJYWazNdtDiXEA */
    id: "mixer",
    context: ({ input }) => ({
      currentTracks: input,
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
      addTrack: assign({
        trackActorRefs: ({ context, self, spawn }) =>
          context.trackActorRefs.concat(
            spawn(trackMachine, {
              input: {
                id: `track${Date.now()}`, // TODO: This machine uses the current timestamp as a unique ID so it can be deleted later. Is there a better way?
                parent: self,
                track: context.track,
              },
            })
          ),
      }),
      clearTracks: assign({
        trackActorRefs: [], // TODO: Do the spawned machines also need to be stopped as part of the clean up?
      }),
      createInitialTracks: assign({
        trackActorRefs: ({ self, spawn }) =>
          roxanne.tracks.map((track, index) =>
            spawn(trackMachine, {
              input: { id: `track${index}`, track, parent: self },
            })
          ),
      }),
      deleteTrack: assign(({ context, event }) => {
        if (event.type !== "mixer.deleteTrack") throw new Error();
        // TODO: How are spawned machines stopped?
        // TODO: Is there a better way of removing machines rather than use their ID?
        return {
          trackActorRefs: context.trackActorRefs.filter(
            (trackActorRef) =>
              trackActorRef.getSnapshot().context.id !== event.id
          ),
        };
      }),
    },
    guards: {
      maximumTracksNotReached: ({ context }) => {
        // TODO: Type error: maximumTracksNotReached is never used in the machine definition
        return context.trackActorRefs.length < MAXIMUM_NUMBER_OF_TRACKS;
      },
    },
  }
);

export const MixerContext = createActorContext(mixerMachine);
