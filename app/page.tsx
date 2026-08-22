"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

const PROJETS = [
  "autoscan",
  "chat-interne",
  "cockpit",
  "portail-smteckia",
  "smapia",
] as const;

type ProjetTag = (typeof PROJETS)[number];

type Note = {
  id: string;
  contenu: string;
  projet_tag: string;
  created_at: string;
};

// Une couleur distincte par projet — utilisée pour le badge dans la liste
// de notes et pour l'accent visuel du sélecteur.
const PROJECT_COLORS: Record<ProjetTag, string> = {
  autoscan: "#22d3ee", // cyan
  "chat-interne": "#a78bfa", // violet
  cockpit: "#fbbf24", // amber
  "portail-smteckia": "#f472b6", // pink
  smapia: "#34d399", // emerald
};
const DEFAULT_COLOR = "#8b8b9e";

function projectColor(tag: string): string {
  return PROJECT_COLORS[tag as ProjetTag] ?? DEFAULT_COLOR;
}

export default function Home() {
  const [contenu, setContenu] = useState("");
  const [projetTag, setProjetTag] = useState<ProjetTag>("cockpit");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [notes, setNotes] = useState<Note[]>([]);

  useEffect(() => {
    loadNotes();
  }, []);

  async function loadNotes() {
    const { data } = await supabase
      .from("notes")
      .select("id, contenu, projet_tag, created_at")
      .order("created_at", { ascending: false })
      .limit(10);
    if (data) setNotes(data);
  }

  async function saveNote() {
    if (!contenu.trim()) return;
    setSaving(true);
    setError(null);

    const { error: insertError } = await supabase.from("notes").insert({
      contenu: contenu.trim(),
      projet_tag: projetTag,
      synced: true,
    });

    setSaving(false);

    if (insertError) {
      setError(insertError.message);
      return;
    }

    setContenu("");
    loadNotes();
  }

  const accent = PROJECT_COLORS[projetTag];

  return (
    <div className="flex flex-col flex-1 items-center font-sans">
      <main className="flex flex-1 w-full max-w-2xl flex-col gap-8 py-16 px-6">
        <h1 className="text-2xl font-semibold tracking-tight bg-gradient-to-r from-cyan-300 via-violet-300 to-pink-300 bg-clip-text text-transparent">
          Cockpit SMTeckIA
        </h1>

        <section
          className="flex flex-col gap-4 rounded-2xl border p-5 shadow-[0_0_40px_-20px_rgba(0,0,0,0.8)] transition-colors"
          style={{
            backgroundColor: "var(--surface)",
            borderColor: "var(--border)",
          }}
        >
          <div className="flex flex-col gap-2">
            <label
              htmlFor="note-contenu"
              className="text-xs font-medium uppercase tracking-wider"
              style={{ color: "var(--muted)" }}
            >
              Note
            </label>
            <textarea
              id="note-contenu"
              value={contenu}
              onChange={(e) => setContenu(e.target.value)}
              placeholder="Écris ou dicte ta note ici (Win+H pour la dictée native Windows)…"
              rows={6}
              autoFocus
              className="w-full resize-none rounded-lg border bg-transparent p-3 text-sm outline-none transition-colors"
              style={{
                borderColor: "var(--border)",
                color: "var(--foreground)",
              }}
              onFocus={(e) => (e.currentTarget.style.borderColor = accent)}
              onBlur={(e) => (e.currentTarget.style.borderColor = "var(--border)")}
            />
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <div className="relative">
              <span
                className="pointer-events-none absolute left-3 top-1/2 h-2 w-2 -translate-y-1/2 rounded-full"
                style={{ backgroundColor: accent, boxShadow: `0 0 8px 1px ${accent}` }}
              />
              <select
                value={projetTag}
                onChange={(e) => setProjetTag(e.target.value as ProjetTag)}
                className="appearance-none rounded-lg border bg-transparent py-2 pl-7 pr-8 text-sm font-medium outline-none transition-colors"
                style={{
                  borderColor: accent,
                  color: "var(--foreground)",
                  backgroundColor: "var(--surface-alt)",
                }}
              >
                {PROJETS.map((p) => (
                  <option key={p} value={p} style={{ color: "#111" }}>
                    {p}
                  </option>
                ))}
              </select>
            </div>

            <button
              type="button"
              onClick={saveNote}
              disabled={saving || !contenu.trim()}
              className="rounded-full px-5 py-2 text-sm font-semibold text-black transition-all disabled:cursor-not-allowed disabled:opacity-40"
              style={{
                backgroundColor: accent,
                boxShadow: saving || !contenu.trim() ? "none" : `0 0 20px -4px ${accent}`,
              }}
            >
              {saving ? "Sauvegarde…" : "Sauvegarder la note"}
            </button>
          </div>

          {error && (
            <p className="text-sm text-red-400">{error}</p>
          )}
        </section>

        <section className="flex flex-col gap-3">
          <h2
            className="text-xs font-medium uppercase tracking-wider"
            style={{ color: "var(--muted)" }}
          >
            Notes récentes
          </h2>
          <ul className="flex flex-col gap-2">
            {notes.map((note) => {
              const color = projectColor(note.projet_tag);
              return (
                <li
                  key={note.id}
                  className="rounded-lg border-l-4 border-y border-r p-3 text-sm"
                  style={{
                    borderLeftColor: color,
                    borderTopColor: "var(--border)",
                    borderRightColor: "var(--border)",
                    borderBottomColor: "var(--border)",
                    backgroundColor: "var(--surface)",
                  }}
                >
                  <div className="mb-1 flex items-center gap-2 text-xs">
                    <span
                      className="rounded-full px-2 py-0.5 font-medium"
                      style={{
                        backgroundColor: `${color}26`,
                        color,
                      }}
                    >
                      {note.projet_tag}
                    </span>
                    <span style={{ color: "var(--muted)" }}>
                      {new Date(note.created_at).toLocaleString("fr-FR")}
                    </span>
                  </div>
                  <p style={{ color: "var(--foreground)" }}>{note.contenu}</p>
                </li>
              );
            })}
            {notes.length === 0 && (
              <li className="text-sm" style={{ color: "var(--muted)" }}>
                Aucune note pour le moment.
              </li>
            )}
          </ul>
        </section>
      </main>
    </div>
  );
}
