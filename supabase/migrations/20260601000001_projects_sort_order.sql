alter table public.projects
  add column sort_order integer not null default 0;

create index projects_sort_order_idx on public.projects (sort_order);

with ordered as (
  select id, (row_number() over (order by title) - 1)::integer as rn
  from public.projects
)
update public.projects p
set sort_order = o.rn
from ordered o
where p.id = o.id;
