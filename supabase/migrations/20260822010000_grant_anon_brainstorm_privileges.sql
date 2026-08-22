-- RLS policies alone do not grant table-level access in Postgres.
-- The anon role also needs explicit GRANTs to read/write brainstorm data.
grant select, insert, update on public.brainstorm_sujets to anon;
grant select, insert, update on public.brainstorm_idees to anon;
