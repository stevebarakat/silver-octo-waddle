import { TrackContext } from "../machines";

export const Track = () => {
  const { send } = TrackContext.useActorRef();
  const { track, volume, channel } = TrackContext.useSelector((s) => s.context);

  return (
    <div className="track">
      <h3 className="track-label">{track.track.name}</h3>
      <div className="toggle">
        <input
          type="checkbox"
          onClick={(e) => {
            send({
              type: "track.toggleSolo",
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
              type: "track.toggleMute",
              checked: e.currentTarget.checked,
            });
          }}
        />
        <label>M</label>
      </div>

      <div className="volume-number">
        <input
          min={-100}
          max={0}
          type="number"
          onChange={(e) => {
            send({
              type: "track.setVolume",
              volume: parseInt(e.target.value),
            });
          }}
          value={volume ?? -32}
        />
      </div>
      <input
        className="volume-slider"
        min={-100}
        max={12}
        step={0.1}
        type="range"
        value={volume ?? -32}
        onChange={(e) => {
          const volume = parseFloat(e.currentTarget.value);
          // console.log("channel", channel);
          // channel.volume.value = volume;
          send({
            type: "track.setVolume",
            channel,
            volume,
          });
        }}
      />
    </div>
  );
};
