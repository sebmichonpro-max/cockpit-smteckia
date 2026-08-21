"use client";

import { useEffect, useRef, useState } from "react";
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

export default function Home() {
  const [listening, setListening] = useState(false);
  const [contenu, setContenu] = useState("");
  const [projetTag, setProjetTag] = useState<ProjetTag>("cockpit");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [notes, setNotes] = useState<Note[]>([]);
  const recognitionRef = useRef<SpeechRecognition | null>(null);
  const shouldListenRef = useRef(false);

  useEffect(() => {
    const SpeechRecognitionCtor =
      window.SpeechRecognition || window.webkitSpeechRecognition;

    if (!SpeechRecognitionCtor) {
      return;
    }

    const recognition = new SpeechRecognitionCtor();
    recognition.lang = "fr-FR";
    // continuous=true is known to make Chrome re-finalize the same phrase
    // several times. A single-utterance session restarted on each `onend`
    // (see below) gives the same "keep listening" behavior without the
    // duplicated transcript.
    recognition.continuous = false;
    recognition.interimResults = true;

    recognition.onresult = (event) => {
      let finalTranscript = "";
      for (let i = event.resultIndex; i < event.results.length; i++) {
        if (event.results[i].isFinal) {
          finalTranscript += event.results[i][0].transcript;
        }
      }
      if (finalTranscript) {
        setContenu((prev) =>
          (prev ? `${prev} ${finalTranscript}` : finalTranscript).trim()
        );
      }
    };

    recognition.onerror = (event) => {
      // "no-speech" fires constantly during normal pauses between phrases;
      // it is not a real failure, so it must not stop the listening intent.
      if (event.error === "no-speech" || event.error === "aborted") {
        return;
      }
      shouldListenRef.current = false;
      setListening(false);
      const messages: Record<string, string> = {
        "not-allowed": "Accès au micro refusé. Autorise le micro pour ce site dans les réglages du navigateur.",
        "audio-capture": "Aucun micro détecté.",
        network: "Erreur réseau pendant la reconnaissance vocale.",
      };
      setError(messages[event.error] ?? `Erreur reconnaissance vocale : ${event.error}`);
    };

    recognition.onend = () => {
      // Chrome stops recognition after each silence even with continuous=true,
      // so it must be restarted automatically while the user still wants to listen.
      if (shouldListenRef.current) {
        try {
          recognition.start();
        } catch {
          shouldListenRef.current = false;
          setListening(false);
        }
      } else {
        setListening(false);
      }
    };

    recognitionRef.current = recognition;

    return () => {
      shouldListenRef.current = false;
      recognition.stop();
    };
  }, []);

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

  function toggleListening() {
    const recognition = recognitionRef.current;
    if (!recognition) {
      setError(
        "La dictée vocale n'est pas supportée par ce navigateur. Utilise Chrome ou Edge, ou saisis ta note manuellement."
      );
      return;
    }

    if (listening) {
      shouldListenRef.current = false;
      recognition.stop();
      setListening(false);
    } else {
      setError(null);
      shouldListenRef.current = true;
      recognition.start();
      setListening(true);
    }
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

  return (
    <div className="flex flex-col flex-1 items-center bg-zinc-50 font-sans dark:bg-black">
      <main className="flex flex-1 w-full max-w-2xl flex-col gap-8 py-16 px-6">
        <h1 className="text-2xl font-semibold tracking-tight text-black dark:text-zinc-50">
          Cockpit SMTeckIA
        </h1>

        <section className="flex flex-col gap-4 rounded-xl border border-black/[.08] bg-white p-5 dark:border-white/[.145] dark:bg-[#111]">
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={toggleListening}
              className={`flex h-14 w-14 shrink-0 items-center justify-center rounded-full text-white transition-colors disabled:cursor-not-allowed disabled:opacity-40 ${
                listening
                  ? "bg-red-600 hover:bg-red-700"
                  : "bg-foreground hover:bg-[#383838] dark:hover:bg-[#ccc] dark:text-black"
              }`}
              aria-pressed={listening}
            >
              {listening ? "■" : "●"}
            </button>
            <div className="text-sm text-zinc-600 dark:text-zinc-400">
              {listening
                ? "Écoute en cours… clique pour arrêter."
                : "Clique pour dicter une note."}
            </div>
          </div>

          <textarea
            value={contenu}
            onChange={(e) => setContenu(e.target.value)}
            placeholder="Le texte dicté apparaît ici, modifiable avant sauvegarde…"
            rows={5}
            className="w-full resize-none rounded-lg border border-black/[.08] bg-transparent p-3 text-sm text-black outline-none focus:border-black/30 dark:border-white/[.145] dark:text-zinc-50 dark:focus:border-white/40"
          />

          <div className="flex flex-wrap items-center gap-3">
            <select
              value={projetTag}
              onChange={(e) => setProjetTag(e.target.value as ProjetTag)}
              className="rounded-lg border border-black/[.08] bg-transparent px-3 py-2 text-sm text-black dark:border-white/[.145] dark:text-zinc-50"
            >
              {PROJETS.map((p) => (
                <option key={p} value={p}>
                  {p}
                </option>
              ))}
            </select>

            <button
              type="button"
              onClick={saveNote}
              disabled={saving || !contenu.trim()}
              className="rounded-full bg-foreground px-5 py-2 text-sm font-medium text-background transition-colors hover:bg-[#383838] disabled:cursor-not-allowed disabled:opacity-40 dark:hover:bg-[#ccc]"
            >
              {saving ? "Sauvegarde…" : "Sauvegarder la note"}
            </button>
          </div>

          {error && (
            <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
          )}
        </section>

        <section className="flex flex-col gap-3">
          <h2 className="text-sm font-medium text-zinc-500 dark:text-zinc-400">
            Notes récentes
          </h2>
          <ul className="flex flex-col gap-2">
            {notes.map((note) => (
              <li
                key={note.id}
                className="rounded-lg border border-black/[.08] bg-white p-3 text-sm dark:border-white/[.145] dark:bg-[#111]"
              >
                <div className="mb-1 flex items-center gap-2 text-xs text-zinc-500 dark:text-zinc-400">
                  <span className="rounded-full bg-black/[.06] px-2 py-0.5 dark:bg-white/[.08]">
                    {note.projet_tag}
                  </span>
                  <span>{new Date(note.created_at).toLocaleString("fr-FR")}</span>
                </div>
                <p className="text-black dark:text-zinc-50">{note.contenu}</p>
              </li>
            ))}
            {notes.length === 0 && (
              <li className="text-sm text-zinc-500 dark:text-zinc-400">
                Aucune note pour le moment.
              </li>
            )}
          </ul>
        </section>
      </main>
    </div>
  );
}
