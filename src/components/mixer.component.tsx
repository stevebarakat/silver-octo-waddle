import { Track } from ".";
import { useMixer } from "../lib";
import { MixerContext } from "../machines";

export const Mixer = () => {
  const { trackActorRefs, sourceSong } = MixerContext.useSelector(
    (s) => s.context
  );
  const { trackCount, send } = useMixer();
  return (
    <div className="mixer">
      <pre style={{ textAlign: "left" }}>
        {JSON.stringify(sourceSong, null, 4)}
      </pre>
      <div className="track-controls">
        <span className="track-count">
          {trackCount === 1 ? "1 track" : `${trackCount} tracks`}
        </span>
        <button onClick={() => send({ type: "mixer.addTrack" })}>
          Add a track
        </button>
        <button onClick={() => send({ type: "mixer.clearTracks" })}>
          Clear tracks
        </button>
      </div>
      <div className="tracks">
        {trackActorRefs.map((trackActorRef, index) => (
          <Track
            actorRef={trackActorRef.id}
            index={index}
            key={trackActorRef.id}
          />
        ))}
      </div>
    </div>
  );
};
