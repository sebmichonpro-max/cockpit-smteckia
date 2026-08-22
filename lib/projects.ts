export const PROJETS = [
  "autoscan",
  "chat-interne",
  "cockpit",
  "portail-smteckia",
  "smapia",
] as const;

export type ProjetTag = (typeof PROJETS)[number];

// Une couleur distincte par projet — utilisée pour le badge dans la liste
// de notes et pour l'accent visuel du sélecteur.
export const PROJECT_COLORS: Record<ProjetTag, string> = {
  autoscan: "#22d3ee", // cyan
  "chat-interne": "#a78bfa", // violet
  cockpit: "#fbbf24", // amber
  "portail-smteckia": "#f472b6", // pink
  smapia: "#34d399", // emerald
};

const DEFAULT_COLOR = "#8b8b9e";

export function projectColor(tag: string): string {
  return PROJECT_COLORS[tag as ProjetTag] ?? DEFAULT_COLOR;
}
