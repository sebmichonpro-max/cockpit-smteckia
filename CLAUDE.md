\# Cockpit SMTeckIA



\## Stack

\- Next.js (App Router)

\- Supabase (base de données + auth)

\- Vercel (hébergement)

\- Connecteurs disponibles : Airtable, Make, Miro



\## Architecture / routes



\- `/` — tableau de bord : grille de tuiles cliquables vers les modules (`components/TileGrid.tsx`), pensée pour accueillir de nouvelles tuiles sans refonte

\- `/note` — saisie d'une nouvelle note (`components/NoteForm.tsx`)

\- `/notes` — liste des notes récentes, avec copie presse-papier par note (`components/NotesList.tsx`)

\- `components/` — composants réutilisables ; les fichiers `app/\*\*/page.tsx` restent de simples assemblages (layout + import de composants), pas de logique métier dedans

\- `lib/projects.ts` — source unique des projets taguables et de leur couleur d'accent

\- `lib/supabase.ts` — client Supabase



\## Objectif du projet

Outil personnel de gestion de projet / amélioration continue pour Sébastien.

Capture des idées (dictée) taguées à un projet existant, pour nourrir le

suivi et, plus tard, alimenter le développement des modules AgroPilot.



\## Principes de dev

\- MVP strict : dictée + note taguée à un projet + export vers Claude

\- Pas d'agenda ni de to-do dans le MVP (déjà couvert par Claude / autres outils)

\- Un projet Supabase séparé d'agropilot-ia, ne jamais mélanger les deux

\- Toujours `git pull` avant / `git push` après chaque session



\## Projets taguables (v1)

autoscan, chat-interne, cockpit, portail-smteckia, smapia

