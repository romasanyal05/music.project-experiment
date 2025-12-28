import { useState } from "react";
import { supabase } from "./supabaseClient";

export default function Authorize() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  // 🔹 LOGIN
  const handleLogin = async () => {
    setLoading(true);
    setMessage("");

    console.log("LOGIN CLICKED");
    console.log("EMAIL 👉", email);

    const { data, error } = await supabase.auth.signInWithPassword({
      email: email,
      password: password,
    });

    console.log("LOGIN RESPONSE 👉", data);
    console.log("LOGIN ERROR 👉", error);

    if (error) {
      setMessage(error.message);
    } else {
      setMessage("Login successful ✅");
    }

    setLoading(false);
  };

  // 🔹 SIGNUP
  const handleSignup = async () => {
    setLoading(true);
    setMessage("");

    console.log("SIGNUP CLICKED");
    console.log("EMAIL 👉", email);

    const { data, error } = await supabase.auth.signUp({
      email: email,
      password: password,
    });

    console.log("SIGNUP RESPONSE 👉", data);
    console.log("SIGNUP ERROR 👉", error);

    if (error) {
      setMessage(error.message);
    } else {
      setMessage("Signup successful ✅ (check email if confirmation enabled)");
    }

    setLoading(false);
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        background: "#0f172a",
        color: "#fff",
      }}
    >
      <div style={{ width: "300px" }}>
        <h2 style={{ textAlign: "center" }}>Login / Signup</h2>

        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          style={{ width: "100%", padding: "8px", marginBottom: "10px" }}
        />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          style={{ width: "100%", padding: "8px", marginBottom: "10px" }}
        />

        <button
          onClick={handleLogin}
          disabled={loading}
          style={{ width: "100%", padding: "8px", marginBottom: "8px" }}
        >
          Login
        </button>

        <button
          onClick={handleSignup}
          disabled={loading}
          style={{ width: "100%", padding: "8px" }}
        >
          Signup
        </button>

        {message && (
          <p style={{ marginTop: "10px", color: "salmon" }}>{message}</p>
        )}
      </div>
    </div>
  );
}