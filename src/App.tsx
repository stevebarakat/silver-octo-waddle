import "./styles/app.css";
import { Mixer } from "./components";
import { MixerContext } from "./machines";
import { roxanne } from "./assets/songs";

const sourceSong = roxanne;

function App() {
  return (
    <>
      <div>
        <h1>Audio mixer with XState v5</h1>
        <MixerContext.Provider
          options={{
            input: sourceSong,
          }}
        >
          <Mixer />
        </MixerContext.Provider>
      </div>
    </>
  );
}

export default App;
