-- RLS policies alone do not grant table-level access in Postgres.
-- The anon role also needs explicit GRANTs to read/write notes.
grant select, insert, update on public.notes to anon;
