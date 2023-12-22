import { useTrack } from "../lib/use-track";
import { clsx } from "clsx";
import { TrackContext } from "../machines";
import { Toggle } from "./Buttons";

type TrackProps = {
  actorRef: string;
  index: number;
};

export const Track = ({ actorRef, index }: TrackProps) => {
  const { send } = TrackContext.useActorRef();
  const { track, volume } = TrackContext.useSelector((s) => s.context);
  console.log("track", track.track.name);

  // const volume = 30;
  return (
    <div className="track">
      <h3 className="track-number">{track.track.name}</h3>
      <div className="toggle">
        {" "}
        <input
          type="checkbox"
          onClick={(e) => {
            send({
              type: "track.toggleSoloed",
              checked: e.currentTarget.checked,
            });
          }}
        />
        <label htmlFor="">S</label>
      </div>
      <div className="toggle">
        <input
          type="checkbox"
          onClick={(e) => {
            send({
              type: "track.toggleMuted",
              checked: e.currentTarget.checked,
            });
          }}
        />
        <label>M</label>
      </div>

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
        // defaultValue={volume}
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
    </div>
  );
};
