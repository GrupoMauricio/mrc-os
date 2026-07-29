-- Vincula Maurício Ramos como proprietário do Grupo Maurício.
-- Execute após criar o usuário em Authentication > Users.

begin;

insert into public.profiles (
  id,
  full_name
)
values (
  'deed643c-29cb-4d60-bd10-053dd53a14f7',
  'Maurício Ramos'
)
on conflict (id) do update set
  full_name = excluded.full_name,
  updated_at = now();

insert into public.organization_members (
  organization_id,
  profile_id,
  role,
  is_active
)
select
  id,
  'deed643c-29cb-4d60-bd10-053dd53a14f7',
  'owner',
  true
from public.organizations
where slug = 'grupo-mauricio'
on conflict (organization_id, profile_id) do update set
  role = 'owner',
  is_active = true;

commit;

select
  p.full_name,
  om.role,
  om.is_active,
  o.name as organization
from public.organization_members om
join public.profiles p on p.id = om.profile_id
join public.organizations o on o.id = om.organization_id
where p.id = 'deed643c-29cb-4d60-bd10-053dd53a14f7';
