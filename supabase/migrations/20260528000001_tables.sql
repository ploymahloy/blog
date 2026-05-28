-- Projects and blog posts content tables

create table public.projects (
  id text primary key,
  title text not null,
  summary text not null,
  stack text[] not null default '{}',
  repo_url text not null,
  live_url text,
  featured_reason text not null,
  updated_at timestamptz not null default now()
);

create table public.blog_posts (
  id text primary key,
  title text not null,
  summary text not null,
  published_at date not null,
  read_time text not null,
  tags text[] not null default '{}',
  content jsonb not null default '[]'::jsonb,
  updated_at timestamptz not null default now()
);

-- Admin allowlist: insert your auth.users id after creating the admin user
create table public.site_admins (
  user_id uuid primary key references auth.users (id) on delete cascade,
  created_at timestamptz not null default now()
);

create index blog_posts_published_at_idx on public.blog_posts (published_at desc);
