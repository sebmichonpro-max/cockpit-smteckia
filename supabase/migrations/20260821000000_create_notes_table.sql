-- Table notes : capture de notes taguées par projet (Cockpit SMTeckIA)
create table if not exists public.notes (
  id uuid primary key default gen_random_uuid(),
  contenu text not null,
  projet_tag text not null check (
    projet_tag in ('autoscan', 'chat-interne', 'cockpit', 'portail-smteckia', 'smapia')
  ),
  created_at timestamptz not null default now(),
  synced boolean not null default false
);

alter table public.notes enable row level security;

-- MVP sans auth : le client (clé anon) doit pouvoir lire/écrire ses notes.
-- A restreindre par utilisateur si une auth est ajoutée en Phase 2+.
create policy "notes_select_anon" on public.notes
  for select to anon using (true);

create policy "notes_insert_anon" on public.notes
  for insert to anon with check (true);

create policy "notes_update_anon" on public.notes
  for update to anon using (true) with check (true);
