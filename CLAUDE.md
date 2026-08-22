\# Cockpit SMTeckIA



\## Stack

\- Next.js (App Router)

\- Supabase (base de données + auth)

\- Vercel (hébergement)

\- Connecteurs disponibles : Airtable, Make, Miro



\## Architecture / routes



\- `/` — tableau de bord : grille de tuiles cliquables vers les modules (`components/TileGrid.tsx`), pensée pour accueillir de nouvelles tuiles sans refonte

\- `/note` — saisie d'une nouvelle note (`components/NoteForm.tsx`)

\- `/notes` — liste des notes récentes (`components/NotesList.tsx` + `components/NoteCard.tsx`) : copie presse-papier, bouton "Valider" et sélecteur "Push vers..." par note (voir Webhooks ci-dessous)

\- `/brainstorming` — sujets + idées groupées par sujet (`components/BrainstormBoard.tsx` + `components/SujetCard.tsx`)

\- `/api/notes/validate`, `/api/notes/push` — routes serveur qui relaient une note vers un webhook Make (voir Webhooks)

\- `components/` — composants réutilisables ; les fichiers `app/\*\*/page.tsx` restent de simples assemblages (layout + import de composants), pas de logique métier dedans

\- `lib/projects.ts` — source unique des projets taguables et de leur couleur d'accent

\- `lib/supabase.ts` — client Supabase



\## Webhooks (module Notes)



\- Bouton "Valider" sur une note → POST vers `NOTES\_WEBHOOK\_URL` (contenu + projet\_tag), relayé par `/api/notes/validate`

\- Sélecteur "Push vers..." (Claude / Perplexity / Notion / Airtable) → POST vers `PUSH\_CLAUDE\_WEBHOOK\_URL` / `PUSH\_PERPLEXITY\_WEBHOOK\_URL` / `PUSH\_NOTION\_WEBHOOK\_URL` / `PUSH\_AIRTABLE\_WEBHOOK\_URL` selon la cible, relayé par `/api/notes/push`

\- Ces 5 variables d'env sont vides pour l'instant (aucun scénario Make créé) ; tant qu'une variable est vide, le bouton correspondant affiche "Non configuré" au lieu d'échouer silencieusement

\- Variables côté serveur uniquement (pas de préfixe `NEXT\_PUBLIC\_`), à définir dans `.env.local` en local et dans les variables d'environnement Vercel en prod quand les scénarios Make existeront



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

