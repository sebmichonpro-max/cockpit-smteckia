\# ROADMAP — Cockpit SMTeckIA



\## Phase 1 — MVP

\- \[x] Setup projet Next.js + Supabase + déploiement Vercel

\- \[x] Schéma DB : table notes (contenu, projet\_tag, date, statut)

\- \[x] Capture par dictée native Windows (Win+H) dans un champ texte standard (Web Speech API abandonnée, peu fiable)

\- \[x] Tag de chaque note à un projet existant

\- \[x] Refonte visuelle : thème sombre façon tech/gaming, couleur distincte par projet (badge + accent du sélecteur)

\- \[x] Export d'une note vers Claude (copier/partager)

\- \[x] Architecture en routes dédiées (`/`, `/note`, `/notes`) + composants réutilisables (`components/`), tableau de bord à tuiles extensible

\- \[x] Module Brainstorming (`/brainstorming`) : sujets + idées liées groupées par sujet, tables `brainstorm\_sujets` / `brainstorm\_idees` (RLS activé comme `notes`)

\- \[x] Boutons "Valider" et "Push vers..." (Claude / Perplexity / Notion / Airtable) sur `/notes` : routes API + variables d'env webhook prêtes, URLs à renseigner dans Make (voir Phase 2)

\- \[ ] Stockage offline + sync au retour réseau



\## Phase 2 — En attente

\- \[ ] Intégration Airtable (stockage/vue alternative des notes)

\- \[ ] Automatisation Make (dictée → Airtable → notification) — brancher les scénarios sur `NOTES\_WEBHOOK\_URL` et `PUSH\_CLAUDE/PERPLEXITY/NOTION/AIRTABLE\_WEBHOOK\_URL`

\- \[ ] Cartographie Miro par projet



\## Repoussé (hors scope volontairement)

\- Agenda intégré

\- To-do list dédiée

\- Veille API temps réel (Supabase/Vercel/Anthropic/OVH/Resend)

