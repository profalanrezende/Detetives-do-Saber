-- Detetives do Saber — Sala online (rode uma vez no SQL Editor do Supabase)
create table if not exists da_users (id text primary key, room text not null, name text not null, animal text, cls text, pin text, created bigint);
create table if not exists da_mail  (id text primary key, room text not null, to_id text not null, from_id text, from_name text, from_animal text, subj text, body text, ts bigint);
create table if not exists da_prog  (id text primary key, room text not null, user_id text, user_name text, cls text, mid text, data jsonb, ts bigint);
create table if not exists da_books (id text primary key, room text not null, data jsonb, ts bigint);
create index if not exists da_mail_idx on da_mail (room, to_id, ts);
create index if not exists da_prog_idx on da_prog (room);

do $$
declare t text;
begin
  foreach t in array array['da_users','da_mail','da_prog','da_books'] loop
    execute format('alter table %I enable row level security', t);
    execute format('drop policy if exists %I on %I', t||'_sel', t);
    execute format('drop policy if exists %I on %I', t||'_ins', t);
    execute format('drop policy if exists %I on %I', t||'_upd', t);
    execute format('create policy %I on %I for select to anon using (true)', t||'_sel', t);
    execute format('create policy %I on %I for insert to anon with check (true)', t||'_ins', t);
    execute format('create policy %I on %I for update to anon using (true) with check (true)', t||'_upd', t);
  end loop;
end $$;
