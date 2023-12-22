import { createActorContext } from "@xstate/react";
import { ActorRefFrom, assign, createMachine } from "xstate";

// const INITIAL_TRACK_VOLUME = 20;
export const trackMachine = createMachine(
  {
    id: "track",
    context: ({ input }) => ({
      id: input.id,
      muted: false,
      soloed: false,
      track: input,
      volume: input.volume,
    }),
    initial: "idle",
    states: {
      idle: {
        on: {
          "track.setVolume": {
            actions: ["setVolume"],
          },
          "track.toggleSoloed": {
            actions: ["toggleSoloed"],
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
        track: TrackSettings;
        volume: number;
      };
      events:
        | { type: "track.setVolume"; volume: number }
        | { type: "track.toggleSoloed"; checked: boolean }
        | { type: "track.toggleMuted"; checked: boolean };
      input: {
        id: string;
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
