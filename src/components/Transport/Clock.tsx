import { useEffect, useRef, useCallback, useState } from "react";
import * as Tone from "tone";
import { formatMilliseconds } from "@/utils";
import "./style.css";

type Props = {
  song: SourceSong;
};

const t = Tone.Transport;
function Clock({ song }: Props) {
  const animation = useRef<number | null>(null);
  const [clock, setClock] = useState(formatMilliseconds(0));

  // TODO - make this a guard in XState
  // make sure song starts at begining and stops at end
  if (t.seconds < song?.start) {
    t.seconds = song?.start;
  }
  if (t.seconds > song?.end) {
    t.stop();
    t.seconds = song?.end;
  }

  const animateClock = useCallback(() => {
    setClock(formatMilliseconds(t.seconds));
    animation.current = requestAnimationFrame(animateClock);
  }, []);

  useEffect(() => {
    animateClock();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="clock">
      <div className="ghost">88:88:88</div>
      {clock}
    </div>
  );
}

export default Clock;
