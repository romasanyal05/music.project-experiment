import { useState } from "react";
import { supabase } from "./supabaseClient";

function AddSong({ onSongAdded }) {
  const [title, setTitle] = useState("");
  const [artist, setArtist] = useState("");
  const [audioUrl, setAudioUrl] = useState("");
  const [loading, setLoading] = useState(false);

  const handleAddSong = async () => {
    if (!title || !artist || !audioUrl) {
      alert("All fields are required");
      return;
    }

    setLoading(true);

    const { error } = await supabase.from("tracks").insert([
      {
        title,
        artist,
        audio_url: audioUrl,
      },
    ]);

    setLoading(false);

    if (error) {
      alert("Error adding song: " + error.message);
    } else {
      alert("Song added successfully 🎵");
      setTitle("");
      setArtist("");
      setAudioUrl("");
      onSongAdded(); // refresh playlist
    }
  };

  return (
    <div style={{ marginTop: "30px" }}>
      <h3>Add New Song</h3>

      <input
        placeholder="Song Title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      /><br /><br />

      <input
        placeholder="Artist"
        value={artist}
        onChange={(e) => setArtist(e.target.value)}
      /><br /><br />

      <input
        placeholder="Audio URL"
        value={audioUrl}
        onChange={(e) => setAudioUrl(e.target.value)}
      /><br /><br />

      <button onClick={handleAddSong} disabled={loading}>
        {loading ? "Adding..." : "Add Song"}
      </button>
    </div>
  );
}

export default AddSong;