import { TrackContext } from "../machines";
import { Toggle } from "./Buttons";

function Mute() {
  const { send } = TrackContext.useActorRef();
  const context = TrackContext.useSelector((s) => s.context);
  const track = context.track;
  const { muted } = context;

  return (
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
  );
}

export default Mute;
