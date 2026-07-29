-- Permissões de escrita para o Capital Center
create or replace function public.current_member_role(target_organization uuid)
returns public.member_role
language sql
stable
security definer
set search_path = public
as $$
  select role
  from public.organization_members
  where organization_id = target_organization
    and profile_id = auth.uid()
    and is_active = true
  limit 1;
$$;

create policy "leaders insert companies" on public.companies
for insert with check (
  public.current_member_role(organization_id) in ('owner','executive','manager')
);

create policy "leaders update companies" on public.companies
for update using (
  public.current_member_role(organization_id) in ('owner','executive','manager')
) with check (
  public.current_member_role(organization_id) in ('owner','executive','manager')
);

create policy "owners delete companies" on public.companies
for delete using (
  public.current_member_role(organization_id) = 'owner'
);
