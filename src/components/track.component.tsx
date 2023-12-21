import { useTrack } from "../lib/use-track";
import { clsx } from "clsx";
import { TrackContext } from "../machines";

type TrackProps = {
  actorRef: string;
  index: number;
};

export const Track = ({ actorRef, index }: TrackProps) => {
  const { send } = TrackContext.useActorRef();
  const { muted, volume } = TrackContext.useSelector((s) => s.context);
  return (
    <div className="track">
      <h3 className="track-number">Track {index + 1}</h3>
      <button
        className={clsx({
          ["mute-button"]: true,
          muted: muted,
          unmuted: !muted,
        })}
        onClick={(event) => {
          send({ type: "track.toggleMuted" });
          event.currentTarget.blur();
        }}
      >
        <span aria-hidden="true">M</span>
        <span className="sr-only">Mute track</span>
      </button>
      <div className="volume-number">
        <input
          min={0}
          max={100}
          type="number"
          onChange={(event) => {
            send({
              type: "track.setVolume",
              volume: parseInt(event.target.value),
            });
          }}
          value={volume}
        />
      </div>
      <input
        className="volume-slider"
        defaultValue={volume}
        min="0"
        max="100"
        type="range"
        value={volume}
        onChange={(event) => {
          send({
            type: "track.setVolume",
            volume: parseInt(event.target.value),
          });
        }}
      />
      <button onClick={() => send({ type: "track.deleteTrack" })}>
        <span aria-hidden="true">X</span>
        <span className="sr-only">Delete track</span>
      </button>
    </div>
  );
};
