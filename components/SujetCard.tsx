"use client";

import { useState } from "react";
import { projectColor } from "@/lib/projects";

export type Sujet = {
  id: string;
  titre: string;
  projet_tag: string;
  created_at: string;
};

export type Idee = {
  id: string;
  sujet_id: string;
  contenu: string;
  created_at: string;
};

export function SujetCard({
  sujet,
  idees,
  onAddIdee,
}: {
  sujet: Sujet;
  idees: Idee[];
  onAddIdee: (sujetId: string, contenu: string) => Promise<boolean>;
}) {
  const color = projectColor(sujet.projet_tag);
  const [contenu, setContenu] = useState("");
  const [adding, setAdding] = useState(false);

  async function submit() {
    if (!contenu.trim()) return;
    setAdding(true);
    const ok = await onAddIdee(sujet.id, contenu.trim());
    setAdding(false);
    if (ok) setContenu("");
  }

  return (
    <div
      className="flex flex-col gap-3 rounded-lg border-l-4 border-y border-r p-4"
      style={{
        borderLeftColor: color,
        borderTopColor: "var(--border)",
        borderRightColor: "var(--border)",
        borderBottomColor: "var(--border)",
        backgroundColor: "var(--surface)",
      }}
    >
      <div className="flex items-center gap-2 text-xs">
        <span
          className="rounded-full px-2 py-0.5 font-medium"
          style={{ backgroundColor: `${color}26`, color }}
        >
          {sujet.projet_tag}
        </span>
        <span style={{ color: "var(--muted)" }}>
          {new Date(sujet.created_at).toLocaleString("fr-FR")}
        </span>
      </div>

      <h3 className="text-base font-semibold" style={{ color: "var(--foreground)" }}>
        {sujet.titre}
      </h3>

      {idees.length > 0 && (
        <ul className="flex flex-col gap-1.5 text-sm">
          {idees.map((idee) => (
            <li key={idee.id} className="flex gap-2" style={{ color: "var(--foreground)" }}>
              <span style={{ color }}>•</span>
              <span>{idee.contenu}</span>
            </li>
          ))}
        </ul>
      )}

      <div className="flex items-center gap-2">
        <input
          value={contenu}
          onChange={(e) => setContenu(e.target.value)}
          placeholder="Ajouter une idée…"
          className="flex-1 rounded-lg border bg-transparent px-3 py-1.5 text-sm outline-none transition-colors"
          style={{ borderColor: "var(--border)", color: "var(--foreground)" }}
          onFocus={(e) => (e.currentTarget.style.borderColor = color)}
          onBlur={(e) => (e.currentTarget.style.borderColor = "var(--border)")}
          onKeyDown={(e) => {
            if (e.key === "Enter") submit();
          }}
        />
        <button
          type="button"
          onClick={submit}
          disabled={adding || !contenu.trim()}
          aria-label="Ajouter l'idée"
          className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-sm font-semibold text-black transition-all disabled:cursor-not-allowed disabled:opacity-40"
          style={{ backgroundColor: color }}
        >
          +
        </button>
      </div>
    </div>
  );
}
