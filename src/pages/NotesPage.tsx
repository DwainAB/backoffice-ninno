import { useEffect, useState } from "react";
import {
  getNotes,
  createNote,
  updateNote,
  deleteNote,
  type Note,
  type NoteInput,
} from "../api/client";
import NoteForm from "../components/NoteForm";
import NoteList from "../components/NoteList";

const TABS: { key: Note["type"]; label: string }[] = [
  { key: "top", label: "Notes de tête" },
  { key: "heart", label: "Notes de cœur" },
  { key: "base", label: "Notes de fond" },
];

export default function NotesPage() {
  const [notes, setNotes] = useState<Note[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<Note["type"]>("top");

  function reload() {
    return getNotes().then(setNotes);
  }

  useEffect(() => {
    reload().finally(() => setLoading(false));
  }, []);

  async function handleCreate(input: NoteInput) {
    await createNote(input);
    await reload();
  }

  async function handleUpdate(id: number, input: NoteInput) {
    await updateNote(id, input);
    await reload();
  }

  async function handleDelete(id: number) {
    if (!confirm("Supprimer cette note ?")) return;
    await deleteNote(id);
    await reload();
  }

  if (loading) return <p>Chargement...</p>;

  const filtered = notes.filter((n) => n.type === activeTab);

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
      <div style={{ display: "flex", gap: 8 }}>
        {TABS.map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            style={{
              padding: "8px 16px",
              borderRadius: 20,
              border: "1px solid var(--border)",
              background: activeTab === tab.key ? "var(--accent)" : "transparent",
              color: activeTab === tab.key ? "#fff" : "var(--text)",
              fontWeight: 600,
            }}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "320px 1fr", gap: 24, alignItems: "start" }}>
        <div>
          <h3 style={{ marginBottom: 10 }}>Ajouter une note</h3>
          <NoteForm type={activeTab} onSubmit={handleCreate} />
        </div>
        <div>
          <h3 style={{ marginBottom: 10 }}>{TABS.find((t) => t.key === activeTab)?.label}</h3>
          <NoteList notes={filtered} onUpdate={handleUpdate} onDelete={handleDelete} />
        </div>
      </div>
    </div>
  );
}
