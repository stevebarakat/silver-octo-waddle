import { Transport as t } from "tone";
import "./style.css";
import { MixerContext } from "@/machines";

type Props = {
  song: SourceSong;
};

function Clock({ song }: Props) {
  const { currentTime } = MixerContext.useSelector((s) => s.context);

  // prevent skipping past start time
  if (t.seconds < song.start) {
    t.seconds = song.start;
  }

  // prevent skipping past end time
  if (t.seconds > song.end) {
    t.stop();
    t.seconds = song.end;
  }

  return (
    <div className="clock">
      <div className="ghost">88:88:88</div>
      {currentTime}
    </div>
  );
}

export default Clock;
