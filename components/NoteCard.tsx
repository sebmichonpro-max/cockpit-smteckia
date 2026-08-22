"use client";

import { useState } from "react";
import { projectColor } from "@/lib/projects";

export type Note = {
  id: string;
  contenu: string;
  projet_tag: string;
  created_at: string;
};

type ActionState = "idle" | "sending" | "sent" | "not-configured" | "error";

const PUSH_TARGETS = [
  { value: "claude", label: "Claude" },
  { value: "perplexity", label: "Perplexity" },
  { value: "notion", label: "Notion" },
  { value: "airtable", label: "Airtable" },
] as const;

async function postJson(url: string, payload: unknown): Promise<ActionState> {
  try {
    const res = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    const data = await res.json().catch(() => null);
    if (data?.ok) return "sent";
    if (data?.reason === "not-configured") return "not-configured";
    return "error";
  } catch {
    return "error";
  }
}

export function NoteCard({ note }: { note: Note }) {
  const color = projectColor(note.projet_tag);
  const [copied, setCopied] = useState(false);
  const [validateState, setValidateState] = useState<ActionState>("idle");
  const [pushState, setPushState] = useState<ActionState>("idle");

  async function copyNote() {
    await navigator.clipboard.writeText(note.contenu);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  }

  async function validateNote() {
    setValidateState("sending");
    const result = await postJson("/api/notes/validate", {
      contenu: note.contenu,
      projet_tag: note.projet_tag,
    });
    setValidateState(result);
    setTimeout(() => setValidateState("idle"), 2000);
  }

  async function pushNote(target: string) {
    if (!target) return;
    setPushState("sending");
    const result = await postJson("/api/notes/push", {
      contenu: note.contenu,
      projet_tag: note.projet_tag,
      target,
    });
    setPushState(result);
    setTimeout(() => setPushState("idle"), 2000);
  }

  const validateLabel: Record<ActionState, string> = {
    idle: "Valider",
    sending: "Envoi…",
    sent: "Validé !",
    "not-configured": "Non configuré",
    error: "Erreur",
  };

  const pushStatusLabel: Record<ActionState, string> = {
    idle: "",
    sending: "Envoi…",
    sent: "Envoyé !",
    "not-configured": "Webhook non configuré",
    error: "Erreur",
  };

  return (
    <li
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
          style={{ backgroundColor: `${color}26`, color }}
        >
          {note.projet_tag}
        </span>
        <span style={{ color: "var(--muted)" }}>
          {new Date(note.created_at).toLocaleString("fr-FR")}
        </span>
      </div>

      <p style={{ color: "var(--foreground)" }}>{note.contenu}</p>

      <div className="mt-2 flex flex-wrap items-center gap-2 text-xs">
        <button
          type="button"
          onClick={copyNote}
          className="rounded-full border px-2 py-0.5 font-medium transition-colors"
          style={{
            borderColor: copied ? color : "var(--border)",
            color: copied ? color : "var(--muted)",
          }}
        >
          {copied ? "Copié !" : "Copier"}
        </button>

        <button
          type="button"
          onClick={validateNote}
          disabled={validateState !== "idle"}
          className="rounded-full border px-2 py-0.5 font-medium transition-colors disabled:cursor-not-allowed"
          style={{
            borderColor: validateState === "sent" ? color : "var(--border)",
            color: validateState === "sent" ? color : "var(--muted)",
          }}
        >
          {validateLabel[validateState]}
        </button>

        <select
          value=""
          disabled={pushState !== "idle"}
          onChange={(e) => pushNote(e.target.value)}
          className="rounded-full border bg-transparent px-2 py-0.5 font-medium outline-none transition-colors disabled:cursor-not-allowed"
          style={{ borderColor: "var(--border)", color: "var(--muted)" }}
        >
          <option value="" disabled>
            Push vers…
          </option>
          {PUSH_TARGETS.map((t) => (
            <option key={t.value} value={t.value} style={{ color: "#111" }}>
              {t.label}
            </option>
          ))}
        </select>

        {pushState !== "idle" && (
          <span style={{ color: "var(--muted)" }}>{pushStatusLabel[pushState]}</span>
        )}
      </div>
    </li>
  );
}
