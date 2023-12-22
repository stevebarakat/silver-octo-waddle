import { MixerContext } from "@/machines";
import { TransportButton } from "../Buttons";
import { Square } from "lucide-react";

function Reset() {
  const { send } = MixerContext.useActorRef();

  return (
    <TransportButton
      onClick={() => {
        send({ type: "reset" });
      }}
    >
      <Square />
    </TransportButton>
  );
}

export default Reset;
