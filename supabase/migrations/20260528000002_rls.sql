-- Row Level Security

alter table public.projects enable row level security;
alter table public.blog_posts enable row level security;
alter table public.site_admins enable row level security;

-- Helper must exist before policies that reference it
create or replace function public.is_site_admin_with_mfa()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1
    from public.site_admins
    where user_id = auth.uid()
  )
  and coalesce(auth.jwt() ->> 'aal', 'aal1') = 'aal2';
$$;

grant execute on function public.is_site_admin_with_mfa() to authenticated;

-- Public read access for portfolio and blog
create policy "projects_select_public"
  on public.projects
  for select
  to anon, authenticated
  using (true);

create policy "blog_posts_select_public"
  on public.blog_posts
  for select
  to anon, authenticated
  using (true);

-- Admin writes require site_admins membership and MFA (AAL2)
create policy "projects_insert_admin"
  on public.projects
  for insert
  to authenticated
  with check (public.is_site_admin_with_mfa());

create policy "projects_update_admin"
  on public.projects
  for update
  to authenticated
  using (public.is_site_admin_with_mfa())
  with check (public.is_site_admin_with_mfa());

create policy "projects_delete_admin"
  on public.projects
  for delete
  to authenticated
  using (public.is_site_admin_with_mfa());

create policy "blog_posts_insert_admin"
  on public.blog_posts
  for insert
  to authenticated
  with check (public.is_site_admin_with_mfa());

create policy "blog_posts_update_admin"
  on public.blog_posts
  for update
  to authenticated
  using (public.is_site_admin_with_mfa())
  with check (public.is_site_admin_with_mfa());

create policy "blog_posts_delete_admin"
  on public.blog_posts
  for delete
  to authenticated
  using (public.is_site_admin_with_mfa());

-- site_admins: no client policies (manage via dashboard SQL or service role)
