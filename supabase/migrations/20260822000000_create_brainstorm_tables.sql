-- Module Brainstorming : sujets et idées liées, taggés par projet (Cockpit SMTeckIA)
create table if not exists public.brainstorm_sujets (
  id uuid primary key default gen_random_uuid(),
  titre text not null,
  projet_tag text not null check (
    projet_tag in ('autoscan', 'chat-interne', 'cockpit', 'portail-smteckia', 'smapia')
  ),
  created_at timestamptz not null default now()
);

create table if not exists public.brainstorm_idees (
  id uuid primary key default gen_random_uuid(),
  sujet_id uuid not null references public.brainstorm_sujets(id) on delete cascade,
  contenu text not null,
  created_at timestamptz not null default now()
);

create index if not exists brainstorm_idees_sujet_id_idx on public.brainstorm_idees(sujet_id);

alter table public.brainstorm_sujets enable row level security;
alter table public.brainstorm_idees enable row level security;

-- MVP sans auth : le client (clé anon) doit pouvoir lire/écrire, comme pour notes.
-- A restreindre par utilisateur si une auth est ajoutée en Phase 2+.
create policy "brainstorm_sujets_select_anon" on public.brainstorm_sujets
  for select to anon using (true);

create policy "brainstorm_sujets_insert_anon" on public.brainstorm_sujets
  for insert to anon with check (true);

create policy "brainstorm_sujets_update_anon" on public.brainstorm_sujets
  for update to anon using (true) with check (true);

create policy "brainstorm_idees_select_anon" on public.brainstorm_idees
  for select to anon using (true);

create policy "brainstorm_idees_insert_anon" on public.brainstorm_idees
  for insert to anon with check (true);

create policy "brainstorm_idees_update_anon" on public.brainstorm_idees
  for update to anon using (true) with check (true);
