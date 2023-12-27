import "./styles/app.css";
import { Mixer } from "./components";
import { MixerContext } from "./machines";
import { defaultTrackData, roxanne } from "./assets/songs";
import { Meter } from "tone";

const sourceSong = roxanne;

const currentMain = {
  volume: -32,
  meter: new Meter(),
  meterVals: new Float32Array(),
};

const currentTracks = sourceSong.tracks.map((track) => ({
  ...track,
  ...defaultTrackData,
  sourceSongSlug: sourceSong.slug,
}));

const initialContext = { sourceSong, currentMain, currentTracks };
export type InitialContext = typeof initialContext;

function App() {
  return (
    <>
      <div>
        <h1>Audio mixer with XState v5</h1>
        <MixerContext.Provider
          options={{
            input: initialContext,
          }}
        >
          <Mixer />
        </MixerContext.Provider>
      </div>
    </>
  );
}

export default App;
