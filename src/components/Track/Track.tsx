import { TrackContext } from "../../machines";
import Fader from "./Fader";
import SoloMute from "./SoloMute";

export const Track = () => {
  const context = TrackContext.useSelector((s) => s.context);
  const track = context.track;

  return (
    <div className="channel">
      <SoloMute />
      <Fader />
      <span className="track-label">{track.name}</span>
    </div>
  );
};
