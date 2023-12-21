import { Track } from ".";
import { useMixer } from "../lib";
import { MixerContext, TrackContext } from "../machines";

export const Mixer = () => {
  const { trackActorRefs, currentTracks } = MixerContext.useSelector(
    (s) => s.context
  );
  const song = currentTracks.sourceSong;
  const { trackCount, send } = useMixer();
  return (
    <div className="mixer">
      <div className="track-controls">
        <h2>{`${song.artist}: ${song.title}`}</h2>
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
