import { MixerContext } from "@/machines";
import { TransportButton } from "../Buttons";
import { Play as PlayIcon, Pause as PauseIcon } from "lucide-react";

function Play() {
  const { send } = MixerContext.useActorRef();
  const state = MixerContext.useSelector((state) => state);

  function handleClick() {
    if (!state.matches({ ready: "playing" })) {
      send({ type: "play" });
    }
    if (state.matches({ ready: "playing" })) {
      send({ type: "pause" });
    }
  }

  return (
    <TransportButton onClick={handleClick}>
      {!state.matches({ ready: "playing" }) ? <PlayIcon /> : <PauseIcon />}
    </TransportButton>
  );
}

export default Play;
