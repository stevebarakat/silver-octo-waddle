import { TrackContext } from "../machines";

export const Track = () => {
  const { send } = TrackContext.useActorRef();
  const { track, volume, meterVals } = TrackContext.useSelector(
    (s) => s.context
  );

  // console.log("meterVals", meterVals);
  return (
    <div className="track">
      <h3 className="track-label">{track.name}</h3>
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

      <div className="volume-number">{(volume + 100).toFixed(0)}</div>
      <input
        className="volume-slider"
        min={-100}
        max={0}
        step={0.1}
        type="range"
        value={volume ?? -32}
        onChange={(e) => {
          const volume = parseFloat(e.currentTarget.value);
          send({
            type: "track.setVolume",
            volume,
          });
        }}
      />
    </div>
  );
};
