"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { projectColor } from "@/lib/projects";

type Note = {
  id: string;
  contenu: string;
  projet_tag: string;
  created_at: string;
};

export function NotesList() {
  const [notes, setNotes] = useState<Note[]>([]);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  useEffect(() => {
    let ignore = false;

    supabase
      .from("notes")
      .select("id, contenu, projet_tag, created_at")
      .order("created_at", { ascending: false })
      .limit(10)
      .then(({ data }) => {
        if (!ignore && data) setNotes(data);
      });

    return () => {
      ignore = true;
    };
  }, []);

  async function copyNote(note: Note) {
    await navigator.clipboard.writeText(note.contenu);
    setCopiedId(note.id);
    setTimeout(() => {
      setCopiedId((current) => (current === note.id ? null : current));
    }, 1500);
  }

  return (
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
              <button
                type="button"
                onClick={() => copyNote(note)}
                className="ml-auto rounded-full border px-2 py-0.5 font-medium transition-colors"
                style={{
                  borderColor: copiedId === note.id ? color : "var(--border)",
                  color: copiedId === note.id ? color : "var(--muted)",
                }}
              >
                {copiedId === note.id ? "Copié !" : "Copier"}
              </button>
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
  );
}
