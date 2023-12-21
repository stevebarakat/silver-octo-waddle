import "./styles/app.css";
import { Mixer } from "./components";
import { MixerContext } from "./machines";
import { defaultTrackData, roxanne } from "./assets/songs";

const sourceSong = roxanne;

const currentTracks = sourceSong.tracks.map((track) => ({
  ...track,
  ...defaultTrackData,
  songSongSlug: sourceSong.slug,
}));

const initialContext = { sourceSong, currentTracks };

function App() {
  return (
    <>
      <div>
        <h1>Audio mixer with XState v5</h1>
        <MixerContext.Provider
          options={{
            input: currentTracks,
          }}
        >
          <Mixer />
        </MixerContext.Provider>
      </div>
    </>
  );
}

export default App;
