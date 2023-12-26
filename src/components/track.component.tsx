import { TrackContext } from "../machines";
import { Toggle } from "./Buttons";
import Fader from "./Fader";

export const Track = () => {
  const { send } = TrackContext.useActorRef();
  const context = TrackContext.useSelector((s) => s.context);
  const track = context.track;
  const { soloed, muted } = context;

  return (
    <div className="channel">
      <div className="solo-mute">
        <Toggle
          id={`trackSolo${track.id}`}
          checked={soloed}
          onChange={(e) => {
            send({
              type: "track.toggleSolo",
              checked: e.currentTarget.checked,
            });
          }}
        >
          S
        </Toggle>
        <Toggle
          id={`trackMute${track.id}`}
          checked={muted}
          onChange={(e) => {
            send({
              type: "track.toggleMute",
              checked: e.currentTarget.checked,
            });
          }}
        >
          M
        </Toggle>
      </div>
      <Fader />
      <h3 className="track-label">{track.name}</h3>
    </div>
  );
};
