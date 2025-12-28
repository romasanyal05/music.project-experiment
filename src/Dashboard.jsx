function Dashboard({ onMusic, onPodcast, userEmail }) {
  return (
    <div
      style={{
        minHeight: "100vh",
        background: "linear-gradient(135deg,#0f2027,#203a43,#2c5364)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        color: "#fff",
        fontFamily: "Arial, sans-serif",
      }}
    >
      <div
        style={{
          width: "420px",
          padding: "40px 30px",
          borderRadius: "20px",
          background: "rgba(255,255,255,0.08)",
          boxShadow: "0 20px 40px rgba(0,0,0,0.4)",
          textAlign: "center",
          backdropFilter: "blur(12px)",
        }}
      >
        <h1
          style={{
            marginBottom: "8px",
            fontSize: "28px",
            letterSpacing: "1px",
          }}
        >
          🎧 Dashboard
        </h1>

        <p
          style={{
            opacity: 0.85,
            fontSize: "14px",
            marginBottom: "30px",
          }}
        >
          Welcome{userEmail ? `, ${userEmail}` : ""}  
          <br />
          Choose what you want to explore
        </p>

        {/* MUSIC BUTTON */}
        <button
          onClick={onMusic}
          style={{
            width: "100%",
            padding: "16px",
            marginBottom: "18px",
            borderRadius: "14px",
            border: "none",
            fontSize: "18px",
            fontWeight: 600,
            cursor: "pointer",
            color: "#0b1d3a",
            background: "linear-gradient(135deg,#7fffd4,#5fd3ff)",
            boxShadow: "0 8px 20px rgba(0,0,0,0.35)",
            transition: "transform 0.2s",
          }}
          onMouseEnter={(e) =>
            (e.currentTarget.style.transform = "scale(1.03)")
          }
          onMouseLeave={(e) =>
            (e.currentTarget.style.transform = "scale(1)")
          }
        >
          🎵 Music Player
        </button>

        {/* PODCAST BUTTON */}
        <button
          onClick={onPodcast}
          style={{
            width: "100%",
            padding: "16px",
            borderRadius: "14px",
            border: "none",
            fontSize: "18px",
            fontWeight: 600,
            cursor: "pointer",
            color: "#fff",
            background: "linear-gradient(135deg,#ff758c,#ff7eb3)",
            boxShadow: "0 8px 20px rgba(0,0,0,0.35)",
            transition: "transform 0.2s",
          }}
          onMouseEnter={(e) =>
            (e.currentTarget.style.transform = "scale(1.03)")
          }
          onMouseLeave={(e) =>
            (e.currentTarget.style.transform = "scale(1)")
          }
        >
          🎙 Podcast
        </button>

        <div
          style={{
            marginTop: "30px",
            fontSize: "12px",
            opacity: 0.6,
          }}
        >
          Powered by Supabase • Audio Visual Project
        </div>
      </div>
    </div>
  );
}

export default Dashboard;