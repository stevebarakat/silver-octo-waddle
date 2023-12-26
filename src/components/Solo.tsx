import { TrackContext } from "../machines";
import { Toggle } from "./Buttons";

function Solo() {
  const { send } = TrackContext.useActorRef();
  const context = TrackContext.useSelector((s) => s.context);
  const track = context.track;
  const { soloed } = context;

  return (
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
  );
}

export default Solo;
