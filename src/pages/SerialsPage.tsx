import { useEffect, useState } from "react";
import { createSerialBatch, getSerials, type SerialNumber } from "../api/client";

export default function SerialsPage() {
  const [serials, setSerials] = useState<SerialNumber[]>([]);
  const [loading, setLoading] = useState(true);
  const [count, setCount] = useState(100);
  const [coffretName, setCoffretName] = useState("Odyssée");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function reload() {
    return getSerials().then(setSerials);
  }

  useEffect(() => {
    reload()
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, []);

  async function handleGenerate(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    setError(null);
    try {
      const { filename, csv } = await createSerialBatch(count, coffretName);
      const url = URL.createObjectURL(csv);
      const a = document.createElement("a");
      a.href = url;
      a.download = filename;
      a.click();
      URL.revokeObjectURL(url);
      await reload();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erreur");
    } finally {
      setBusy(false);
    }
  }

  if (loading) return <p>Chargement...</p>;

  const used = serials.filter((s) => s.activatedAt).length;

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
      <form
        onSubmit={handleGenerate}
        style={{ display: "flex", gap: 12, alignItems: "flex-end", flexWrap: "wrap" }}
      >
        <label style={labelStyle}>
          Nombre de numéros
          <input
            type="number"
            min={1}
            max={10000}
            value={count}
            onChange={(e) => setCount(Number(e.target.value))}
            style={inputStyle}
          />
        </label>
        <label style={labelStyle}>
          Coffret
          <input value={coffretName} onChange={(e) => setCoffretName(e.target.value)} style={inputStyle} />
        </label>
        <button type="submit" disabled={busy} style={buttonStyle}>
          {busy ? "Génération..." : "Générer un lot (CSV)"}
        </button>
      </form>

      {error && <p style={{ color: "crimson" }}>{error}</p>}

      <p>
        {serials.length} numéros, dont {used} utilisés.
      </p>

      <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 14 }}>
        <thead>
          <tr style={{ textAlign: "left" }}>
            <th style={cellStyle}>Numéro</th>
            <th style={cellStyle}>Lot</th>
            <th style={cellStyle}>Coffret</th>
            <th style={cellStyle}>Activé le</th>
            <th style={cellStyle}>Parent</th>
            <th style={cellStyle}>Enfant</th>
          </tr>
        </thead>
        <tbody>
          {serials.map((s) => (
            <tr key={s.code}>
              <td style={{ ...cellStyle, fontFamily: "monospace" }}>{s.code}</td>
              <td style={cellStyle}>{s.batch}</td>
              <td style={cellStyle}>{s.coffretName ?? "—"}</td>
              <td style={cellStyle}>{s.activatedAt ? new Date(s.activatedAt).toLocaleString("fr-FR") : "—"}</td>
              <td style={cellStyle}>{s.parentEmail ?? "—"}</td>
              <td style={cellStyle}>{s.childFirstName ?? "—"}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

const labelStyle: React.CSSProperties = { display: "flex", flexDirection: "column", gap: 4, fontSize: 14 };
const inputStyle: React.CSSProperties = {
  padding: "8px 12px",
  borderRadius: 8,
  border: "1px solid var(--border)",
  background: "var(--surface)",
  color: "var(--text)",
};
const buttonStyle: React.CSSProperties = {
  padding: "8px 16px",
  borderRadius: 8,
  border: "1px solid var(--border)",
  background: "var(--accent-bg)",
  color: "var(--accent)",
  fontWeight: 600,
};
const cellStyle: React.CSSProperties = { padding: "6px 8px", borderBottom: "1px solid var(--border)" };
