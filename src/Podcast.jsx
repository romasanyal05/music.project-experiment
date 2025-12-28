import { useEffect, useState } from "react";
import { supabase } from "./supabaseClient";
import Waveform from "./waveform";

function Podcast() {
  const [episodes, setEpisodes] = useState([]);
  const [index, setIndex] = useState(null);

  useEffect(() => {
    supabase
      .from("episodes")
      .select("*")
      .then(({ data }) => setEpisodes(data || []));
  }, []);

  return (
    <div style={{ padding: 20 }}>
      <h2>🎙 Podcast Episodes</h2>

      {episodes.map((e, i) => (
        <div
          key={e.id}
          onClick={() => setIndex(i)}
          style={{
            cursor: "pointer",
            padding: 6,
            color: index === i ? "#00ffe1" : "#fff",
          }}
        >
          ▶ Episode {i + 1}
        </div>
      ))}

      {index !== null && (
        <Waveform
          playlist={episodes}
          currentIndex={index}
          onNext={() =>
            setIndex((i) => (i + 1) % episodes.length)
          }
          onPrev={() =>
            setIndex((i) =>
              i === 0 ? episodes.length - 1 : i - 1
            )
          }
          onBack={() => setIndex(null)} //
          BACK
        />
      )}
    </div>
  );
}

export default Podcast;