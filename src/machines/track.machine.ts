import { createActorContext } from "@xstate/react";
import { ActorRefFrom, assign, createMachine } from "xstate";

const INITIAL_TRACK_VOLUME = 20;
export const trackMachine = createMachine(
  {
    id: "track",
    context: ({ input }) => ({
      id: input.id,
      muted: false,
      track: input,
      parent: input.parent,
      volume: INITIAL_TRACK_VOLUME,
    }),
    initial: "idle",
    states: {
      idle: {
        on: {
          "track.deleteTrack": {
            actions: ["deleteTrack"],
          },
          "track.setVolume": {
            actions: ["setVolume"],
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
        track: any;
        parent: any; // TODO: What is the correct type here?
        volume: number;
      };
      events:
        | { type: "track.deleteTrack" }
        | { type: "track.setVolume"; volume: number }
        | { type: "track.toggleMuted" };
      input: {
        id: string;
        parent: ActorRefFrom<any>; // TODO: What is the correct type here?
      };
    },
  },
  {
    actions: {
      deleteTrack: ({ context }) =>
        context.parent.send({ type: "mixer.deleteTrack", id: context.id }),
      setVolume: assign(({ event }) => {
        if (event.type !== "track.setVolume") throw new Error();
        console.log("event.volume", event.volume);
        return {
          volume: event.volume,
        };
      }),
      toggleMuted: assign(({ context, event }) => {
        console.log("event.checked", event.checked);
        if (event.type !== "track.toggleMuted") throw new Error();
        return {
          muted: !context.muted,
        };
      }),
    },
  }
);

export const TrackContext = createActorContext(trackMachine);
