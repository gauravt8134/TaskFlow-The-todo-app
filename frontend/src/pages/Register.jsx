import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { useAuth } from "../context/AuthContext";

export default function Register() {
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true); setError("");
    try {
      const { data } = await axios.post("/api/auth/register", form);
      login(data);
      navigate("/dashboard");
    } catch (err) {
      setError(err.response?.data?.message || "Registration failed");
    } finally { setLoading(false); }
  };

  return (
    <div style={styles.wrapper}>
      <div style={styles.glow} />
      <div style={styles.card} className="fade-in">
        <div style={styles.logo}>⚡ TaskFlow</div>
        <h2 style={styles.title}>Create account</h2>
        <p style={styles.sub}>Start managing your tasks today</p>

        {error && <div style={styles.error}>{error}</div>}

        <form onSubmit={handleSubmit} style={styles.form}>
          <div style={styles.group}>
            <label style={styles.label}>Full Name</label>
            <input className="input-field" placeholder="Gaurav Sharma"
              value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} required />
          </div>
          <div style={styles.group}>
            <label style={styles.label}>Email</label>
            <input className="input-field" type="email" placeholder="you@example.com"
              value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} required />
          </div>
          <div style={styles.group}>
            <label style={styles.label}>Password</label>
            <input className="input-field" type="password" placeholder="Min 6 characters"
              value={form.password} onChange={e => setForm({ ...form, password: e.target.value })} required minLength={6} />
          </div>
          <button className="btn-primary" type="submit" style={{ width: "100%", padding: "12px", marginTop: 8 }} disabled={loading}>
            {loading ? "Creating..." : "Create Account →"}
          </button>
        </form>

        <p style={styles.footer}>
          Already have an account? <Link to="/login" style={styles.link}>Sign in</Link>
        </p>
      </div>
    </div>
  );
}

const styles = {
  wrapper: { minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", position: "relative", overflow: "hidden" },
  glow: { position: "absolute", width: 400, height: 400, borderRadius: "50%", background: "radial-gradient(circle, rgba(108,99,255,0.12) 0%, transparent 70%)", top: "20%", left: "30%", pointerEvents: "none" },
  card: { background: "#111118", border: "1px solid #2a2a38", borderRadius: 16, padding: "40px 36px", width: "100%", maxWidth: 400, position: "relative", zIndex: 1 },
  logo: { fontFamily: "Syne", fontSize: 20, fontWeight: 800, color: "#6c63ff", marginBottom: 24 },
  title: { fontSize: 26, fontWeight: 700, marginBottom: 6 },
  sub: { color: "#7070a0", fontSize: 14, marginBottom: 28 },
  form: { display: "flex", flexDirection: "column", gap: 16 },
  group: { display: "flex", flexDirection: "column", gap: 6 },
  label: { fontSize: 13, color: "#9090b8", fontWeight: 500 },
  error: { background: "rgba(248,113,113,0.1)", border: "1px solid rgba(248,113,113,0.3)", color: "#f87171", borderRadius: 8, padding: "10px 14px", fontSize: 13, marginBottom: 8 },
  footer: { textAlign: "center", marginTop: 24, fontSize: 14, color: "#7070a0" },
  link: { color: "#6c63ff", fontWeight: 500 },
};
