import { useEffect, useRef, useState } from "react";

export default function Waveform({
  playlist = [],
  currentIndex = 0,
  onBack,
  onNext,
  onPrev
}) {
  const canvasRef = useRef(null);
  const audioRef = useRef(null);
  const analyserRef = useRef(null);
  const rafRef = useRef(null);
  const hueRef = useRef(180); // 🌈 COLOR ROTATION

  const [isPlaying, setIsPlaying] = useState(false);
  const [time, setTime] = useState("00:00 / 00:00");

  const track = playlist[currentIndex];

  /* ---------------- AUDIO SETUP ---------------- */
  useEffect(() => {
    if (!track?.audio_url) return;

    const audio = new Audio(track.audio_url);
    audio.crossOrigin = "anonymous";
    audioRef.current = audio;

    const AudioCtx = window.AudioContext || window.webkitAudioContext;
    const ctx = new AudioCtx();

    const analyser = ctx.createAnalyser();
    analyser.fftSize = 256;

    const src = ctx.createMediaElementSource(audio);
    src.connect(analyser);
    analyser.connect(ctx.destination);

    analyserRef.current = analyser;
    audio.onended = onNext;

    audio.addEventListener("timeupdate", () => {
      if (!isNaN(audio.duration)) {
        const f = (t) =>
          `${String(Math.floor(t / 60)).padStart(2, "0")}:${String(
            Math.floor(t % 60)
          ).padStart(2, "0")}`;
        setTime(`${f(audio.currentTime)} / ${f(audio.duration)}`);
      }
    });

    return () => {
      cancelAnimationFrame(rafRef.current);
      audio.pause();
      ctx.close();
    };
  }, [track]);

  /* ---------------- DRAW NEON RECT BARS ---------------- */
  const draw = () => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    const analyser = analyserRef.current;
    if (!analyser) return;

    const data = new Uint8Array(analyser.frequencyBinCount);
    analyser.getByteFrequencyData(data);

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    const bars = 140;
    const barWidth = canvas.width / bars;

    hueRef.current += 0.5; // 🌈 AUTO COLOR CHANGE
    const baseHue = hueRef.current;

    for (let i = 0; i < bars; i++) {
      const v = data[i] / 255;
      const h = v * canvas.height * 0.9;

      const x = i * barWidth;
      const y = canvas.height - h;

      const hue = (baseHue + i * 1.5) % 360;
      ctx.fillStyle = `hsl(${hue}, 100%, ${55 + v * 25}%)`;

      ctx.shadowBlur = 30 + v * 40;
      ctx.shadowColor = `hsl(${hue}, 100%, 70%)`;

      ctx.fillRect(x, y, barWidth - 2, h);
    }

    rafRef.current = requestAnimationFrame(draw);
  };

  /* ---------------- CONTROLS ---------------- */
  const togglePlay = async () => {
    const audio = audioRef.current;
    if (!audio) return;

    if (audio.paused) {
      await audio.play();
      setIsPlaying(true);
      draw();
    } else {
      audio.pause();
      setIsPlaying(false);
      cancelAnimationFrame(rafRef.current);
    }
  };

  /* ---------------- UI ---------------- */
  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        background: "radial-gradient(circle at top,#0a2540,#020b13)",
        display: "flex",
        flexDirection: "column",
        zIndex: 999
      }}
    >
      {/* TOP BAR */}
      <div style={{ padding: 16, display: "flex", alignItems: "center" }}>
        <button onClick={onBack} style={btn}>← Back</button>
        <div style={{ marginLeft: 20, color: "#9ffcff", fontWeight: 600 }}>
          {track?.title || "Now Playing"}
        </div>
      </div>

      {/* WAVEFORM */}
      <canvas
        ref={canvasRef}
        width={window.innerWidth}
        height={window.innerHeight * 0.7}
        style={{ flex: 1 }}
      />

      {/* CONTROLS */}
      <div style={{ padding: 20, textAlign: "center" }}>
        <div style={{ display: "flex", justifyContent: "center", gap: 18 }}>
          <button onClick={onPrev} style={btn}>⏮</button>
          <button onClick={togglePlay} style={mainBtn}>
            {isPlaying ? "⏸" : "▶"}
          </button>
          <button onClick={onNext} style={btn}>⏭</button>
        </div>
        <div style={{ marginTop: 8, color: "#b6ecff" }}>{time}</div>
      </div>
    </div>
  );
}

/* ---------------- STYLES ---------------- */
const btn = {
  background: "transparent",
  border: "1px solid #5ffcff",
  color: "#5ffcff",
  padding: "8px 16px",
  borderRadius: 20,
  cursor: "pointer"
};

const mainBtn = {
  ...btn,
  fontSize: 22,
  padding: "12px 26px",
  boxShadow: "0 0 30px #5ffcff"
};