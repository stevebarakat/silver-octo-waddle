import { Track } from ".";
import { useMixer } from "../lib";
import { MixerContext } from "../machines";

export const Mixer = () => {
  const { trackActorRefs, currentTracks } = MixerContext.useSelector(
    (s) => s.context
  );
  const { trackCount, send } = useMixer();
  return (
    <div className="mixer">
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
      <pre
        style={{
          marginTop: "4rem",
          textAlign: "left",
          background: "black",
          overflowY: "scroll",
          color: "hotpink",
        }}
      >
        {JSON.stringify(currentTracks, null, 4)}
      </pre>
    </div>
  );
};
