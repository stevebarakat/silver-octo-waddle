import { Track } from ".";
import Transport from "./Transport";
import { MixerContext, TrackContext } from "../machines";

export const Mixer = () => {
  const { currentTracks } = MixerContext.useSelector((s) => s.context);
  const song = currentTracks.sourceSong;
  return (
    <div className="mixer">
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
      <div className="track-controls">
        <h2>{`${song.artist}: ${song.title}`}</h2>
        <Transport song={song} />
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
