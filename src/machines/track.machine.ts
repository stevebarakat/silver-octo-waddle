import { createActorContext } from "@xstate/react";
import { Channel, Player } from "tone";
import { assign, createMachine } from "xstate";

export const trackMachine = createMachine(
  {
    id: "track",
    context: ({ input }) => ({
      id: input.id,
      muted: false,
      soloed: false,
      track: input,
      volume: input.volume,
      channel: new Channel(),
    }),
    initial: "ready",
    states: {
      ready: {
        entry: {
          type: "initializeTrack",
        },
        on: {
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
        id: string;
        muted: boolean;
        soloed: boolean;
        track: TrackSettings;
        volume: number;
        channel: Channel;
      };
      events:
        | { type: "track.setVolume"; volume: number }
        | { type: "track.toggleSolo"; checked: boolean }
        | { type: "track.toggleMute"; checked: boolean };
      input: {
        id: string;
      };
    },
  },
  {
    actions: {
      initializeTrack: ({ context }) => {
        const player = new Player(context.track.track.path).sync().start();
        const channel = context.channel.toDestination();
        player.connect(channel);
        return { channel };
      },
      setVolume: assign(({ event }) => {
        if (event.type !== "track.setVolume") throw new Error();
        console.log("event.volume", event.volume);
        return {
          volume: event.volume,
        };
      }),
      toggleSolo: assign(({ context, event }) => {
        if (event.type !== "track.toggleSolo") throw new Error();
        return {
          soloed: !context.soloed,
        };
      }),
      toggleMute: assign(({ context, event }) => {
        if (event.type !== "track.toggleMute") throw new Error();
        return {
          muted: !context.muted,
        };
      }),
    },
  }
);

export const TrackContext = createActorContext(trackMachine);
