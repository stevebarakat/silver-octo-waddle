import { Track } from ".";
import Transport from "./Transport";
import { MixerContext, TrackContext } from "../machines";
import Loader from "./Loader";

export const Mixer = () => {
  const state = MixerContext.useSelector((state) => state);
  const ready = state.matches("ready");
  const song = state.context.sourceSong;
  const currentTracks = state.context.currentTracks;

  if (ready) {
    return (
      <div className="mixer">
        <div className="tracks">
          {currentTracks.map((track: TrackSettings, index: number) => (
            <TrackContext.Provider
              key={track.id}
              options={{
                input: {
                  track,
                  trackId: index,
                },
              }}
            >
              <Track />
            </TrackContext.Provider>
          ))}
        </div>
        <div className="track-controls">
          <h2>{`${song.artist}: ${song.title}`}</h2>
          <Transport song={song} />
        </div>
      </div>
    );
  } else {
    return <Loader song={song} />;
  }
};
