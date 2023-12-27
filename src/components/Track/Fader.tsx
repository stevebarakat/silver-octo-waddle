import VuMeter from "../VuMeter";
import { TrackContext } from "@/machines";

function Fader() {
  const { send } = TrackContext.useActorRef();
  const { volume, track, meterVals } = TrackContext.useSelector(
    (state) => state.context
  );

  return (
    <div className="fader-wrap">
      <div className="window">{`${volume?.toFixed(0) ?? -32} dB`}</div>
      <div className="levels-wrap">
        <VuMeter meterValue={meterVals} height={150} width={12} />
      </div>
      <div className="vol-wrap">
        <input
          type="range"
          id={`trackVol${track.id}`}
          className="range-y volume"
          min={-100}
          max={12}
          step={0.1}
          value={volume}
          onChange={(e) => {
            const volume = parseFloat(e.currentTarget.value);
            send({
              type: "track.setVolume",
              volume,
            });
          }}
        />
      </div>
    </div>
  );
}

export default Fader;
