-- Command Center OS — modelo inicial multi-organização
create extension if not exists "pgcrypto";

create type public.member_role as enum ('owner','executive','manager','member','partner','investor');
create type public.item_status as enum ('draft','active','paused','completed','archived');
create type public.decision_priority as enum ('low','medium','high','critical');

create table public.organizations (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text not null unique,
  legal_name text,
  logo_url text,
  settings jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text not null,
  avatar_url text,
  phone text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.organization_members (
  organization_id uuid not null references public.organizations(id) on delete cascade,
  profile_id uuid not null references public.profiles(id) on delete cascade,
  role public.member_role not null default 'member',
  is_active boolean not null default true,
  joined_at timestamptz not null default now(),
  primary key (organization_id, profile_id)
);

create table public.companies (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  name text not null,
  slug text not null,
  legal_name text,
  document_number text,
  description text,
  segments text[] not null default '{}',
  status public.item_status not null default 'active',
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (organization_id, slug)
);

create table public.projects (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  name text not null,
  slug text not null,
  objective text,
  status public.item_status not null default 'draft',
  owner_id uuid references public.profiles(id),
  start_date date,
  due_date date,
  progress smallint not null default 0 check (progress between 0 and 100),
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (organization_id, slug)
);

create table public.project_companies (
  project_id uuid not null references public.projects(id) on delete cascade,
  company_id uuid not null references public.companies(id) on delete cascade,
  execution_role text,
  primary key (project_id, company_id)
);

create table public.tasks (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  project_id uuid references public.projects(id) on delete cascade,
  company_id uuid references public.companies(id) on delete set null,
  title text not null,
  description text,
  status public.item_status not null default 'active',
  priority public.decision_priority not null default 'medium',
  assignee_id uuid references public.profiles(id),
  due_at timestamptz,
  completed_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.decisions (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  project_id uuid references public.projects(id) on delete set null,
  company_id uuid references public.companies(id) on delete set null,
  title text not null,
  context text,
  recommendation text,
  priority public.decision_priority not null default 'medium',
  status public.item_status not null default 'active',
  requested_by uuid references public.profiles(id),
  decided_by uuid references public.profiles(id),
  decided_at timestamptz,
  decision text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.knowledge_items (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  title text not null,
  category text,
  content text,
  source_url text,
  tags text[] not null default '{}',
  status public.item_status not null default 'active',
  created_by uuid references public.profiles(id),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index companies_organization_idx on public.companies(organization_id);
create index projects_organization_idx on public.projects(organization_id);
create index tasks_organization_idx on public.tasks(organization_id);
create index decisions_organization_idx on public.decisions(organization_id);
create index decisions_priority_status_idx on public.decisions(priority, status);

alter table public.organizations enable row level security;
alter table public.profiles enable row level security;
alter table public.organization_members enable row level security;
alter table public.companies enable row level security;
alter table public.projects enable row level security;
alter table public.project_companies enable row level security;
alter table public.tasks enable row level security;
alter table public.decisions enable row level security;
alter table public.knowledge_items enable row level security;

create or replace function public.is_organization_member(target_organization uuid)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1 from public.organization_members
    where organization_id = target_organization
      and profile_id = auth.uid()
      and is_active = true
  );
$$;

create policy "members read organizations" on public.organizations
for select using (public.is_organization_member(id));

create policy "users read own profile" on public.profiles
for select using (id = auth.uid());

create policy "members read memberships" on public.organization_members
for select using (public.is_organization_member(organization_id));

create policy "members read companies" on public.companies
for select using (public.is_organization_member(organization_id));

create policy "members read projects" on public.projects
for select using (public.is_organization_member(organization_id));

create policy "members read tasks" on public.tasks
for select using (public.is_organization_member(organization_id));

create policy "members read decisions" on public.decisions
for select using (public.is_organization_member(organization_id));

create policy "members read knowledge" on public.knowledge_items
for select using (public.is_organization_member(organization_id));
