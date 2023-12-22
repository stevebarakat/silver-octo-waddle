import { TrackContext } from "../machines";

type TrackProps = {
  actorRef: string;
  index: number;
};

export const Track = ({ index }: TrackProps) => {
  const { send } = TrackContext.useActorRef();
  const { track, volume } = TrackContext.useSelector((s) => s.context);

  // const volume = 30;
  return (
    <div className="track">
      <h3 className="track-number">{track.track.name}</h3>
      <div className="toggle">
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
          onChange={(e) => {
            send({
              type: "track.setVolume",
              volume: parseInt(e.target.value),
            });
          }}
          value={volume}
        />
      </div>
      <input
        className="volume-slider"
        min="0"
        max="100"
        type="range"
        value={volume}
        onChange={(e) => {
          send({
            type: "track.setVolume",
            volume: parseInt(e.target.value),
          });
        }}
      />
    </div>
  );
};
