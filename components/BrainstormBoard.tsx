"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { PROJETS, PROJECT_COLORS, type ProjetTag } from "@/lib/projects";
import { SujetCard, type Idee, type Sujet } from "@/components/SujetCard";

export function BrainstormBoard() {
  const [sujets, setSujets] = useState<Sujet[]>([]);
  const [ideesBySujet, setIdeesBySujet] = useState<Record<string, Idee[]>>({});
  const [titre, setTitre] = useState("");
  const [projetTag, setProjetTag] = useState<ProjetTag>("cockpit");
  const [creating, setCreating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let ignore = false;

    Promise.all([
      supabase
        .from("brainstorm_sujets")
        .select("id, titre, projet_tag, created_at")
        .order("created_at", { ascending: false }),
      supabase
        .from("brainstorm_idees")
        .select("id, sujet_id, contenu, created_at")
        .order("created_at", { ascending: true }),
    ]).then(([{ data: sujetsData }, { data: ideesData }]) => {
      if (ignore) return;

      if (sujetsData) setSujets(sujetsData);
      if (ideesData) {
        const grouped: Record<string, Idee[]> = {};
        for (const idee of ideesData) {
          (grouped[idee.sujet_id] ??= []).push(idee);
        }
        setIdeesBySujet(grouped);
      }
    });

    return () => {
      ignore = true;
    };
  }, []);

  async function createSujet() {
    if (!titre.trim()) return;
    setCreating(true);
    setError(null);

    const { data, error: insertError } = await supabase
      .from("brainstorm_sujets")
      .insert({ titre: titre.trim(), projet_tag: projetTag })
      .select("id, titre, projet_tag, created_at")
      .single();

    setCreating(false);

    if (insertError) {
      setError(insertError.message);
      return;
    }

    if (data) {
      setSujets((prev) => [data, ...prev]);
      setTitre("");
    }
  }

  async function addIdee(sujetId: string, contenu: string) {
    const { data, error: insertError } = await supabase
      .from("brainstorm_idees")
      .insert({ sujet_id: sujetId, contenu })
      .select("id, sujet_id, contenu, created_at")
      .single();

    if (insertError || !data) return false;

    setIdeesBySujet((prev) => ({
      ...prev,
      [sujetId]: [...(prev[sujetId] ?? []), data],
    }));
    return true;
  }

  const accent = PROJECT_COLORS[projetTag];

  return (
    <div className="flex flex-col gap-8">
      <section
        className="flex flex-col gap-4 rounded-2xl border p-5 shadow-[0_0_40px_-20px_rgba(0,0,0,0.8)] transition-colors"
        style={{ backgroundColor: "var(--surface)", borderColor: "var(--border)" }}
      >
        <div className="flex flex-col gap-2">
          <label
            htmlFor="sujet-titre"
            className="text-xs font-medium uppercase tracking-wider"
            style={{ color: "var(--muted)" }}
          >
            Nouveau sujet
          </label>
          <input
            id="sujet-titre"
            value={titre}
            onChange={(e) => setTitre(e.target.value)}
            placeholder="Titre court du sujet…"
            className="w-full rounded-lg border bg-transparent p-3 text-sm outline-none transition-colors"
            style={{ borderColor: "var(--border)", color: "var(--foreground)" }}
            onFocus={(e) => (e.currentTarget.style.borderColor = accent)}
            onBlur={(e) => (e.currentTarget.style.borderColor = "var(--border)")}
            onKeyDown={(e) => {
              if (e.key === "Enter") createSujet();
            }}
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
            onClick={createSujet}
            disabled={creating || !titre.trim()}
            className="rounded-full px-5 py-2 text-sm font-semibold text-black transition-all disabled:cursor-not-allowed disabled:opacity-40"
            style={{
              backgroundColor: accent,
              boxShadow: creating || !titre.trim() ? "none" : `0 0 20px -4px ${accent}`,
            }}
          >
            {creating ? "Création…" : "Créer le sujet"}
          </button>
        </div>

        {error && <p className="text-sm text-red-400">{error}</p>}
      </section>

      <div className="flex flex-col gap-4">
        {sujets.map((sujet) => (
          <SujetCard
            key={sujet.id}
            sujet={sujet}
            idees={ideesBySujet[sujet.id] ?? []}
            onAddIdee={addIdee}
          />
        ))}
        {sujets.length === 0 && (
          <p className="text-sm" style={{ color: "var(--muted)" }}>
            Aucun sujet pour le moment.
          </p>
        )}
      </div>
    </div>
  );
}
