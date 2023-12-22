import { createActorContext } from "@xstate/react";
import { ActorRefFrom, assign, createMachine } from "xstate";

const INITIAL_TRACK_VOLUME = 20;
export const trackMachine = createMachine(
  {
    id: "track",
    context: ({ input }) => ({
      id: input.id,
      muted: false,
      soloed: false,
      track: input,
      parent: input.parent,
      volume: INITIAL_TRACK_VOLUME,
    }),
    initial: "idle",
    states: {
      idle: {
        on: {
          "track.setVolume": {
            actions: ["setVolume"],
          },
          "track.toggleSoloed": {
            actions: ["deleteTrack"],
          },
          "track.toggleMuted": {
            actions: ["toggleMuted"],
          },
        },
      },
    },
    types: {} as {
      context: {
        id: string;
        muted: boolean;
        soloed: boolean;
        track: any;
        parent: any; // TODO: What is the correct type here?
        volume: number;
      };
      events:
        | { type: "track.setVolume"; volume: number }
        | { type: "track.toggleSoloed" }
        | { type: "track.toggleMuted" };
      input: {
        id: string;
        parent: ActorRefFrom<any>; // TODO: What is the correct type here?
      };
    },
  },
  {
    actions: {
      setVolume: assign(({ event }) => {
        if (event.type !== "track.setVolume") throw new Error();
        console.log("event.volume", event.volume);
        return {
          volume: event.volume,
        };
      }),
      toggleSoloed: assign(({ context, event }) => {
        if (event.type !== "track.toggleSoloed") throw new Error();
        return {
          soloed: !context.soloed,
        };
      }),
      toggleMuted: assign(({ context, event }) => {
        if (event.type !== "track.toggleMuted") throw new Error();
        return {
          muted: !context.muted,
        };
      }),
    },
  }
);

export const TrackContext = createActorContext(trackMachine);
