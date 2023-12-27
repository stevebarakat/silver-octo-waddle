import Fader from "./Fader";

export default function MainChannel() {
  return (
    <div className="channel">
      <Fader />
      <span className="track-label">Main</span>
    </div>
  );
}
