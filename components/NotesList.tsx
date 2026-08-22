"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { NoteCard, type Note } from "@/components/NoteCard";

export function NotesList() {
  const [notes, setNotes] = useState<Note[]>([]);

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

  return (
    <ul className="flex flex-col gap-2">
      {notes.map((note) => (
        <NoteCard key={note.id} note={note} />
      ))}
      {notes.length === 0 && (
        <li className="text-sm" style={{ color: "var(--muted)" }}>
          Aucune note pour le moment.
        </li>
      )}
    </ul>
  );
}
