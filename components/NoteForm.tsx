"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabase";
import { PROJETS, PROJECT_COLORS, type ProjetTag } from "@/lib/projects";

export function NoteForm() {
  const [contenu, setContenu] = useState("");
  const [projetTag, setProjetTag] = useState<ProjetTag>("cockpit");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [savedAt, setSavedAt] = useState<number | null>(null);

  const accent = PROJECT_COLORS[projetTag];

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
    setSavedAt(Date.now());
  }

  return (
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

        {savedAt && !saving && (
          <span className="text-sm" style={{ color: "var(--muted)" }}>
            Note enregistrée.
          </span>
        )}
      </div>

      {error && <p className="text-sm text-red-400">{error}</p>}
    </section>
  );
}
