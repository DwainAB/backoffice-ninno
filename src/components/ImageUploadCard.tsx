import { useRef, useState } from "react";

export default function ImageUploadCard({
  title,
  description,
  currentUrl,
  onUpload,
}: {
  title: string;
  description: string;
  currentUrl: string;
  onUpload: (file: File) => Promise<void>;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [file, setFile] = useState<File | null>(null);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const selected = e.target.files?.[0];
    if (!selected) return;
    setFile(selected);
    setPreview(URL.createObjectURL(selected));
    setError(null);
  }

  async function handleSave() {
    if (!file) return;
    setSaving(true);
    setError(null);
    try {
      await onUpload(file);
      setFile(null);
      setPreview(null);
      if (inputRef.current) inputRef.current.value = "";
    } catch {
      setError("Échec de l'envoi. Réessayez.");
    } finally {
      setSaving(false);
    }
  }

  const displayUrl = preview ?? currentUrl;

  return (
    <div
      style={{
        background: "var(--surface)",
        border: "1px solid var(--border)",
        borderRadius: 12,
        padding: 20,
        boxShadow: "var(--shadow)",
        display: "flex",
        flexDirection: "column",
        gap: 12,
      }}
    >
      <div>
        <h3>{title}</h3>
        <p style={{ margin: "4px 0 0", color: "var(--text)" }}>{description}</p>
      </div>

      <div
        style={{
          height: 160,
          borderRadius: 8,
          border: "1px solid var(--border)",
          background: displayUrl
            ? `center/cover no-repeat url(${displayUrl})`
            : "var(--bg)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color: "var(--text)",
        }}
      >
        {!displayUrl && "Aucune image"}
      </div>

      <input ref={inputRef} type="file" accept="image/*" onChange={handleFileChange} />

      {error && <p style={{ color: "var(--danger)", margin: 0 }}>{error}</p>}

      <button
        onClick={handleSave}
        disabled={!file || saving}
        style={{
          alignSelf: "flex-start",
          padding: "8px 16px",
          borderRadius: 8,
          border: "none",
          background: "var(--accent)",
          color: "#fff",
          fontWeight: 600,
          opacity: !file || saving ? 0.6 : 1,
        }}
      >
        {saving ? "Envoi..." : "Enregistrer"}
      </button>
    </div>
  );
}
