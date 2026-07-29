# Ativação do Capital Center

## Banco de dados

Execute no SQL Editor do Supabase, nesta ordem:

1. `supabase/schema.sql`
2. `supabase/seed.sql`
3. crie Maurício em Authentication > Users
4. substitua o UUID em `supabase/002_bootstrap_owner.sql` e execute
5. execute `supabase/003_company_crud_policies.sql`

## Frontend

Crie `auth/config.js` a partir de `auth/config.example.js` e informe a Project URL e a anon public key.

## Fluxo

1. abra `login.html`;
2. entre com o usuário proprietário;
3. abra `capital-center.html`;
4. cadastre, edite, pesquise ou remova empresas.

## Permissões

- owner: visualizar, cadastrar, editar e remover;
- executive e manager: visualizar, cadastrar e editar;
- member, partner e investor: somente visualizar.

## Segurança

A tela nunca usa a chave `service_role`. Todas as escritas passam por autenticação e Row Level Security do Supabase.
