"use client";

import Link from "next/link";

export type Tile = {
  href: string;
  label: string;
  description: string;
  accent: string;
  icon: string;
};

export function TileGrid({ tiles }: { tiles: Tile[] }) {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
      {tiles.map((tile) => (
        <Link
          key={tile.href}
          href={tile.href}
          className="group flex flex-col gap-3 rounded-2xl border p-5 transition-all hover:-translate-y-0.5"
          style={{
            backgroundColor: "var(--surface)",
            borderColor: "var(--border)",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.borderColor = tile.accent;
            e.currentTarget.style.boxShadow = `0 0 24px -8px ${tile.accent}`;
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.borderColor = "var(--border)";
            e.currentTarget.style.boxShadow = "none";
          }}
        >
          <span
            className="flex h-10 w-10 items-center justify-center rounded-xl text-lg font-semibold"
            style={{ backgroundColor: `${tile.accent}26`, color: tile.accent }}
          >
            {tile.icon}
          </span>
          <div className="flex flex-col gap-1">
            <span className="text-base font-semibold" style={{ color: "var(--foreground)" }}>
              {tile.label}
            </span>
            <span className="text-sm" style={{ color: "var(--muted)" }}>
              {tile.description}
            </span>
          </div>
        </Link>
      ))}
    </div>
  );
}
