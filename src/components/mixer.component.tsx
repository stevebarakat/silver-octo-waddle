import { Track } from ".";
import { useMixer } from "../lib";
import { MixerContext, TrackContext } from "../machines";

export const Mixer = () => {
  const { trackActorRefs, currentTracks } = MixerContext.useSelector(
    (s) => s.context
  );
  console.log("currentTracks", currentTracks);
  const song = currentTracks.sourceSong;
  console.log("song", song);
  const { trackCount, send } = useMixer();
  return (
    <div className="mixer">
      <div className="track-controls">
        <span className="track-count">
          {trackCount === 1 ? "1 track" : `${trackCount} tracks`}
        </span>
      </div>
      <div className="tracks">
        {currentTracks.currentTracks.map((track, index) => (
          <TrackContext.Provider
            key={track.id}
            options={{
              input: {
                track,
                trackId: index,
              },
            }}
          >
            <Track actorRef={track.id} index={index} />
          </TrackContext.Provider>
        ))}
      </div>
      <pre
        style={{
          marginTop: "4rem",
          textAlign: "left",
        }}
      >
        {JSON.stringify(currentTracks, null, 4)}
      </pre>
    </div>
  );
};
