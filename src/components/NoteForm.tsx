import { useState } from "react";
import type { Note, NoteInput } from "../api/client";

const inputStyle: React.CSSProperties = {
  padding: "8px 10px",
  borderRadius: 8,
  border: "1px solid var(--border)",
  background: "var(--bg)",
  color: "var(--text-h)",
  width: "100%",
};

type ImageFieldKey = "image" | "happyImage" | "sadImage" | "happyAnim" | "sadAnim";

const IMAGE_FIELDS: { key: ImageFieldKey; urlKey: keyof Note; label: string; accept: string }[] = [
  { key: "image", urlKey: "imageUrl", label: "Image normale", accept: "image/*" },
  { key: "happyImage", urlKey: "happyImageUrl", label: "Image contente", accept: "image/*" },
  { key: "sadImage", urlKey: "sadImageUrl", label: "Image triste", accept: "image/*" },
  { key: "happyAnim", urlKey: "happyAnimUrl", label: "Animation contente (optionnel)", accept: "image/webp" },
  { key: "sadAnim", urlKey: "sadAnimUrl", label: "Animation triste (optionnel)", accept: "image/webp" },
];

function NoteImageField({
  label,
  accept,
  currentUrl,
  onChange,
}: {
  label: string;
  accept: string;
  currentUrl: string | null;
  onChange: (file: File | null) => void;
}) {
  const [preview, setPreview] = useState<string | null>(null);
  const displayUrl = preview ?? currentUrl;

  return (
    <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
      <div
        style={{
          width: 48,
          height: 48,
          flexShrink: 0,
          borderRadius: 8,
          border: "1px solid var(--border)",
          background: displayUrl ? `center/cover no-repeat url(${displayUrl})` : "var(--bg)",
        }}
      />
      <div style={{ flex: 1, textAlign: "left" }}>
        <label style={{ display: "block", fontSize: 12, color: "var(--text)", marginBottom: 2 }}>{label}</label>
        <input
          type="file"
          accept={accept}
          onChange={(e) => {
            const file = e.target.files?.[0] ?? null;
            onChange(file);
            setPreview(file ? URL.createObjectURL(file) : null);
          }}
        />
      </div>
    </div>
  );
}

export default function NoteForm({
  type,
  initial,
  onSubmit,
  onCancel,
}: {
  type: "top" | "heart" | "base";
  initial?: Note;
  onSubmit: (input: NoteInput) => Promise<void>;
  onCancel?: () => void;
}) {
  const [name, setName] = useState(initial?.name ?? "");
  const [images, setImages] = useState<Record<ImageFieldKey, File | null>>({
    image: null,
    happyImage: null,
    sadImage: null,
    happyAnim: null,
    sadAnim: null,
  });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError(null);
    try {
      await onSubmit({ name, type, ...images });
      if (!initial) {
        setName("");
        setImages({ image: null, happyImage: null, sadImage: null, happyAnim: null, sadAnim: null });
      }
    } catch {
      setError("Échec de l'enregistrement.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      style={{
        display: "flex",
        flexDirection: "column",
        gap: 10,
        background: "var(--surface)",
        border: "1px solid var(--border)",
        borderRadius: 12,
        padding: 16,
      }}
    >
      <input style={inputStyle} placeholder="Nom" value={name} onChange={(e) => setName(e.target.value)} required />

      {IMAGE_FIELDS.map((field) => (
        <NoteImageField
          key={field.key}
          label={field.label}
          accept={field.accept}
          currentUrl={(initial?.[field.urlKey] as string | null) ?? null}
          onChange={(file) => setImages((prev) => ({ ...prev, [field.key]: file }))}
        />
      ))}

      {error && <p style={{ color: "var(--danger)", margin: 0 }}>{error}</p>}

      <div style={{ display: "flex", gap: 8 }}>
        <button
          type="submit"
          disabled={saving || !name}
          style={{
            padding: "8px 16px",
            borderRadius: 8,
            border: "none",
            background: "var(--accent)",
            color: "#fff",
            fontWeight: 600,
            opacity: saving || !name ? 0.6 : 1,
          }}
        >
          {saving ? "Enregistrement..." : initial ? "Mettre à jour" : "Ajouter"}
        </button>
        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            style={{
              padding: "8px 16px",
              borderRadius: 8,
              border: "1px solid var(--border)",
              background: "transparent",
              color: "var(--text)",
            }}
          >
            Annuler
          </button>
        )}
      </div>
    </form>
  );
}
