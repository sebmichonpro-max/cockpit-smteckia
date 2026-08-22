import Link from "next/link";
import { NoteForm } from "@/components/NoteForm";

export default function NotePage() {
  return (
    <div className="flex flex-col flex-1 items-center font-sans">
      <main className="flex flex-1 w-full max-w-2xl flex-col gap-8 py-16 px-6">
        <div className="flex flex-col gap-2">
          <Link
            href="/"
            className="text-xs font-medium uppercase tracking-wider transition-colors hover:text-cyan-300"
            style={{ color: "var(--muted)" }}
          >
            ← Accueil
          </Link>
          <h1 className="text-2xl font-semibold tracking-tight" style={{ color: "var(--foreground)" }}>
            Nouvelle note
          </h1>
        </div>

        <NoteForm />
      </main>
    </div>
  );
}
