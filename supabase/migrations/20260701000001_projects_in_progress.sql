alter table public.projects
  add column if not exists in_progress boolean not null default false;
