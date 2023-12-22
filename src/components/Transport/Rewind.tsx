import { MixerContext } from "@/machines";
import { TransportButton } from "../Buttons";
import { Rewind as RewindIcon } from "lucide-react";

function Rewind() {
  const { send } = MixerContext.useActorRef();

  return (
    <TransportButton
      onClick={() => {
        send({ type: "rewind" });
      }}
    >
      <RewindIcon />
    </TransportButton>
  );
}

export default Rewind;
