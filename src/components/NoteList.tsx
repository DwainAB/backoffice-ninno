import { useState } from "react";
import type { Note, NoteInput } from "../api/client";
import NoteForm from "./NoteForm";

export default function NoteList({
  notes,
  onUpdate,
  onDelete,
}: {
  notes: Note[];
  onUpdate: (id: number, input: NoteInput) => Promise<void>;
  onDelete: (id: number) => Promise<void>;
}) {
  const [editingId, setEditingId] = useState<number | null>(null);

  if (notes.length === 0) {
    return <p style={{ color: "var(--text)" }}>Aucune note pour l'instant.</p>;
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
      {notes.map((note) =>
        editingId === note.id ? (
          <NoteForm
            key={note.id}
            type={note.type}
            initial={note}
            onCancel={() => setEditingId(null)}
            onSubmit={async (input) => {
              await onUpdate(note.id, input);
              setEditingId(null);
            }}
          />
        ) : (
          <div
            key={note.id}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 12,
              background: "var(--surface)",
              border: "1px solid var(--border)",
              borderRadius: 10,
              padding: 12,
            }}
          >
            <div style={{ display: "flex", gap: 4, flexShrink: 0 }}>
              {[note.imageUrl, note.happyImageUrl, note.sadImageUrl].map((url, i) => (
                <div
                  key={i}
                  style={{
                    width: 40,
                    height: 40,
                    borderRadius: 6,
                    background: url ? `center/cover no-repeat url(${url})` : "var(--bg)",
                    border: "1px solid var(--border)",
                  }}
                />
              ))}
            </div>
            <div style={{ flex: 1, textAlign: "left" }}>
              <strong style={{ color: "var(--text-h)" }}>{note.name}</strong>
            </div>
            <button
              onClick={() => setEditingId(note.id)}
              style={{
                padding: "6px 12px",
                borderRadius: 8,
                border: "1px solid var(--border)",
                background: "transparent",
                color: "var(--text)",
              }}
            >
              Modifier
            </button>
            <button
              onClick={() => onDelete(note.id)}
              style={{
                padding: "6px 12px",
                borderRadius: 8,
                border: "none",
                background: "var(--danger-bg)",
                color: "var(--danger)",
                fontWeight: 600,
              }}
            >
              Supprimer
            </button>
          </div>
        )
      )}
    </div>
  );
}
