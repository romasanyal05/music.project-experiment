import { useEffect, useRef, useState } from "react";
import { supabase }from "./supabaseClient";

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
  const posterTimerRef = useRef(null);

  const [isPlaying, setIsPlaying] = useState(false);
  const [time, setTime] = useState("00:00 / 00:00");
  const [posters, setPosters] = useState([]);
  const [posterIndex, setPosterIndex] = useState(0);
  const [posterUrl, setPosterUrl] = useState("");

  const track = playlist[currentIndex];

  /* ---------------- FETCH POSTERS ---------------- */
  useEffect(() => {
    async function loadPosters() {
      console.log("POSTER FETCH STARTED");
      const { data, error } = await supabase
        .from("posters")
        .select("image_url")
        .order("id");

      if (!error && Array.isArray(data)) {
        setPosters(data.slice(0, 16)); // max 16 posters
      }
    }
    loadPosters();
  }, []);

  /* ---------------- POSTER ROTATION (10s) ---------------- */
  useEffect(() => {
  if (!posters || posters.length === 0) return;

  // set first poster safely
  setPosterUrl(posters[0].image_url);

  posterTimerRef.current = setInterval(() => {
    setPosterIndex((prev) => {
      const next = (prev + 1) % posters.length;
      setPosterUrl(posters[next].image_url);
      return next;
    });
  }, 10000); // 10 seconds

  return () => {
    if (posterTimerRef.current) {
      clearInterval(posterTimerRef.current);
    }
  };
}, [posters]);

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

  /* ---------------- WAVEFORM DRAW ---------------- */
  const draw = () => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    const analyser = analyserRef.current;
    if (!analyser) return;

    const data = new Uint8Array(analyser.frequencyBinCount);
    analyser.getByteFrequencyData(data);

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    const bars = 120;
    const barWidth = canvas.width / bars;

    for (let i = 0; i < bars; i++) {
      const v = data[i] / 255;
      const h = v * canvas.height * 0.85;

      ctx.fillStyle = "#5ffcff";
      ctx.shadowBlur = 20;
      ctx.shadowColor = "#5ffcff";
      ctx.fillRect(i * barWidth, canvas.height - h, barWidth - 2, h);
    }

    rafRef.current = requestAnimationFrame(draw);
  };

  /* ---------------- PLAY / PAUSE ---------------- */
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
    <div style={{ position: "fixed", inset: 0, color: "#fff" }}>
      {/* BACKGROUND POSTER */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          backgroundImage: posterUrl ? `url(${posterUrl})` : "none",
          backgroundSize: "cover",
          backgroundPosition: "center",
          zIndex: -1
        }}
      />

      {/* TOP BAR */}
      <div style={{ padding: 16, display: "flex", alignItems: "center" }}>
        <button onClick={onBack} style={btn}>← Back</button>
        <div style={{ marginLeft: 20, fontWeight: 700, fontSize: 18 }}>
          {track?.title || "Now Playing"}
        </div>
      </div>

      {/* WAVEFORM */}
      <canvas
        ref={canvasRef}
        width={window.innerWidth}
        height={window.innerHeight * 0.6}
      />

      {/* CONTROLS */}
      <div style={{ textAlign: "center", paddingBottom: 20 }}>
        <div style={{ display: "flex", justifyContent: "center", gap: 16 }}>
          <button onClick={onPrev} style={btn}>⏮</button>
          <button onClick={togglePlay} style={mainBtn}>
            {isPlaying ? "⏸" : "▶"}
          </button>
          <button onClick={onNext} style={btn}>⏭</button>
        </div>
        <div style={{ marginTop: 6 }}>{time}</div>
      </div>
    </div>
  );
}

/* ---------------- STYLES ---------------- */
const btn = {
  background: "rgba(0,0,0,0.5)",
  border: "1px solid #5ffcff",
  color: "#5ffcff",
  padding: "8px 16px",
  borderRadius: 20,
  cursor: "pointer"
};

const mainBtn = {
  ...btn,
  fontSize: 22,
  padding: "12px 28px"
};