import { useEffect, useState } from "react";
import { supabase } from "./supabaseClient";

import Auth from "./Auth";
import Dashboard from "./Dashboard";
import MusicPlayer from "./MusicPlayer";
import Podcast from "./Podcast";

function App() {
  const [session, setSession] = useState(null);
  const [screen, setScreen] = useState("dashboard"); 
  // dashboard | music | podcast

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      if (!session) setScreen("dashboard");
    });

    return () => subscription.unsubscribe();
  }, []);

  const logout = async () => {
    await supabase.auth.signOut();
  };

  if (!session) {
    return <Auth />;
  }

  return (
    <div>
      {/* TOP BAR */}
      <div style={{ padding: 10, textAlign: "right" }}>
        <button onClick={logout}>Logout</button>
      </div>

      {/* SCREENS */}
      {screen === "dashboard" && (
        <Dashboard
          userEmail={session.user.email}
          onMusic={() => setScreen("music")}
          onPodcast={() => setScreen("podcast")}
        />
      )}

      {screen === "music" && (
        <>
          <button onClick={() => setScreen("dashboard")}>
            ← Back
          </button>
          <MusicPlayer />
        </>
      )}

      {screen === "podcast" && (
        <>
          <button onClick={() => setScreen("dashboard")}>
            ← Back
          </button>
          <Podcast />
        </>
      )}
    </div>
  );
}

export default App;