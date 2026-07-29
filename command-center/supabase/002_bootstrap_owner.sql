-- Execute após criar o usuário Maurício em Authentication > Users.
-- Substitua o UUID abaixo pelo id real de auth.users.

begin;

insert into public.profiles (id, full_name, email, locale, timezone)
values (
  '00000000-0000-0000-0000-000000000000',
  'Maurício Ramos',
  'agencianextlevelbr@gmail.com',
  'pt-BR',
  'America/Sao_Paulo'
)
on conflict (id) do update set
  full_name = excluded.full_name,
  email = excluded.email,
  locale = excluded.locale,
  timezone = excluded.timezone;

insert into public.organization_members (organization_id, user_id, role, status)
select id, '00000000-0000-0000-0000-000000000000', 'owner', 'active'
from public.organizations
where slug = 'grupo-mauricio'
on conflict (organization_id, user_id) do update set
  role = 'owner',
  status = 'active';

commit;
