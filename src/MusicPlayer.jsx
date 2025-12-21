import { useRef } from "react";

function MusicPlayer() {
  const audioRef = useRef(null);

  const playMusic = () => {
    audioRef.current.play();
  };

  const pauseMusic = () => {
    audioRef.current.pause();
  };

  return (
    <div className="bg-gray-800 p-6 rounded-lg text-center">
      <h2 className="text-xl font-bold mb-4">🎵 Simple Music Player</h2>

      <audio ref={audioRef} src="/music/track.mp3" />

      <div className="space-x-4">
        <button
          onClick={playMusic}
          className="px-4 py-2 bg-green-500 text-black rounded"
        >
          ▶ Play
        </button>

        <button
          onClick={pauseMusic}
          className="px-4 py-2 bg-red-500 text-black rounded"
        >
          ⏸ Pause
        </button>
      </div>
    </div>
  );
}

export default MusicPlayer;