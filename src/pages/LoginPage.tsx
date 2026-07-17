import { useState } from "react";
import { setToken, verifyToken } from "../api/client";

export default function LoginPage({ onLogin }: { onLogin: () => void }) {
  const [value, setValue] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const ok = await verifyToken(value);
      if (!ok) {
        setError("Jeton invalide.");
        return;
      }
      setToken(value);
      onLogin();
    } catch {
      setError("Impossible de contacter le serveur.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div style={{ display: "flex", flex: 1, alignItems: "center", justifyContent: "center" }}>
      <form
        onSubmit={handleSubmit}
        style={{
          background: "var(--surface)",
          border: "1px solid var(--border)",
          borderRadius: 12,
          padding: 32,
          width: 360,
          boxShadow: "var(--shadow)",
          display: "flex",
          flexDirection: "column",
          gap: 16,
        }}
      >
        <h1 style={{ fontSize: 22 }}>Ninno — Back office</h1>
        <p style={{ margin: 0, color: "var(--text)" }}>Entrez le jeton administrateur pour continuer.</p>
        <input
          type="password"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          placeholder="Jeton admin"
          autoFocus
          style={{
            padding: "10px 12px",
            borderRadius: 8,
            border: "1px solid var(--border)",
            background: "var(--bg)",
            color: "var(--text-h)",
          }}
        />
        {error && <p style={{ color: "var(--danger)", margin: 0 }}>{error}</p>}
        <button
          type="submit"
          disabled={loading || !value}
          style={{
            padding: "10px 12px",
            borderRadius: 8,
            border: "none",
            background: "var(--accent)",
            color: "#fff",
            fontWeight: 600,
            opacity: loading || !value ? 0.6 : 1,
          }}
        >
          {loading ? "Connexion..." : "Se connecter"}
        </button>
      </form>
    </div>
  );
}
