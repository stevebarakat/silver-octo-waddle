import { Track } from ".";
import Transport from "./Transport";
import { MixerContext, TrackContext } from "../machines";

export const Mixer = () => {
  const { initialContext } = MixerContext.useSelector((s) => s.context);
  const song = initialContext.sourceSong;
  return (
    <div className="mixer">
      <div className="tracks">
        {initialContext.currentTracks.map(
          (track: TrackSettings, index: number) => (
            <TrackContext.Provider
              key={track.id}
              options={{
                input: {
                  track,
                  trackId: index,
                },
              }}
            >
              <Track track={track} trackId={index} />
            </TrackContext.Provider>
          )
        )}
      </div>
      <div className="track-controls">
        <h2>{`${song.artist}: ${song.title}`}</h2>
        <Transport song={song} />
      </div>
    </div>
  );
};
