import { TileGrid, type Tile } from "@/components/TileGrid";

const TILES: Tile[] = [
  {
    href: "/note",
    label: "Nouvelle note",
    description: "Capturer une idée taguée à un projet.",
    accent: "#22d3ee",
    icon: "＋",
  },
  {
    href: "/notes",
    label: "Notes récentes",
    description: "Consulter et copier les dernières notes.",
    accent: "#a78bfa",
    icon: "☰",
  },
  {
    href: "/brainstorming",
    label: "Brainstorming",
    description: "Sujets et idées en vrac, groupés par thème.",
    accent: "#fbbf24",
    icon: "✦",
  },
];

export default function Home() {
  return (
    <div className="flex flex-col flex-1 items-center font-sans">
      <main className="flex flex-1 w-full max-w-2xl flex-col gap-8 py-16 px-6">
        <h1 className="text-2xl font-semibold tracking-tight bg-gradient-to-r from-cyan-300 via-violet-300 to-pink-300 bg-clip-text text-transparent">
          Cockpit SMTeckIA
        </h1>

        <TileGrid tiles={TILES} />
      </main>
    </div>
  );
}
