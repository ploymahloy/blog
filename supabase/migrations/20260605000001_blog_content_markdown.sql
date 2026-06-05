alter table public.blog_posts
  alter column content type text
  using coalesce(content #>> '{}', '');

alter table public.blog_posts
  alter column content set default '';
