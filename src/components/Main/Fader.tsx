import VuMeter from "../VuMeter";
import { MixerContext } from "@/machines";

function Fader() {
  const { send } = MixerContext.useActorRef();
  const { volume, meterVals } = MixerContext.useSelector(
    (state) => state.context.currentMain
  );

  return (
    <div className="fader-wrap">
      <div className="window">{`${(volume + 100).toFixed(0)} dB`}</div>
      <div className="levels-wrap">
        <VuMeter meterValue={meterVals} height={150} width={12} />
      </div>
      <div className="vol-wrap">
        <input
          type="range"
          id={"mainVol"}
          className="range-y volume"
          min={-100}
          max={0}
          step={0.1}
          value={volume}
          onChange={(e) => {
            const volume = parseFloat(e.currentTarget.value);
            send({
              type: "setVolume",
              volume,
            });
          }}
        />
      </div>
    </div>
  );
}

export default Fader;
