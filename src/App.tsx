import { useState } from "react";
import { clearToken, getToken } from "./api/client";
import LoginPage from "./pages/LoginPage";
import AppearancePage from "./pages/AppearancePage";
import NotesPage from "./pages/NotesPage";

type View = "appearance" | "notes";

export default function App() {
  const [authenticated, setAuthenticated] = useState(!!getToken());
  const [view, setView] = useState<View>("appearance");

  if (!authenticated) {
    return <LoginPage onLogin={() => setAuthenticated(true)} />;
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", flex: 1 }}>
      <header
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "16px 24px",
          borderBottom: "1px solid var(--border)",
          background: "var(--surface)",
        }}
      >
        <h1 style={{ fontSize: 18 }}>Ninno — Back office</h1>
        <nav style={{ display: "flex", gap: 8 }}>
          <button
            onClick={() => setView("appearance")}
            style={navButtonStyle(view === "appearance")}
          >
            Apparence
          </button>
          <button onClick={() => setView("notes")} style={navButtonStyle(view === "notes")}>
            Notes
          </button>
          <button
            onClick={() => {
              clearToken();
              setAuthenticated(false);
            }}
            style={{
              padding: "8px 16px",
              borderRadius: 8,
              border: "1px solid var(--border)",
              background: "transparent",
              color: "var(--text)",
            }}
          >
            Déconnexion
          </button>
        </nav>
      </header>

      <main style={{ flex: 1, padding: 24, maxWidth: 1000, width: "100%", margin: "0 auto" }}>
        {view === "appearance" ? <AppearancePage /> : <NotesPage />}
      </main>
    </div>
  );
}

function navButtonStyle(active: boolean): React.CSSProperties {
  return {
    padding: "8px 16px",
    borderRadius: 8,
    border: "1px solid var(--border)",
    background: active ? "var(--accent-bg)" : "transparent",
    color: active ? "var(--accent)" : "var(--text)",
    fontWeight: 600,
  };
}
