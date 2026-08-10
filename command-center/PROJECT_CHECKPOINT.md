# Command Center OS — checkpoint de continuidade

**Data do checkpoint:** 10/08/2026  
**Repositório:** `GrupoMauricio/mrc-os`  
**Diretório:** `/command-center`  
**Versão registrada:** `0.1.0`  
**Base auditada:** `main@7b213b891d0d5f1146db1f7b387733a44c9b1b46`

## Objetivo

Este arquivo é o ponto oficial de retomada do projeto. Em uma nova sessão de desenvolvimento, leia primeiro este documento e somente depois abra os arquivos específicos da área que será alterada. Isso evita reconstruir o histórico completo do projeto.

## Estado confirmado no GitHub

A fundação do Command Center OS está integrada à branch `main`. O código inclui:

- Executive Home responsiva;
- autenticação Supabase no navegador;
- Capital Center com cadastro, edição, busca e remoção de empresas;
- configuração multi-organização;
- esquema inicial do banco Supabase;
- políticas RLS iniciais;
- estrutura conceitual para Decision, Project, People, Knowledge, Venture e Investor Centers;
- documentação de ativação;
- configuração estática para publicação.

O desenvolvimento original permanece rastreável na branch `agent/command-center-foundation`. A integração em `main` foi consolidada em um único commit.

## Arquivos essenciais

| Área | Arquivos |
|---|---|
| Interface principal | `index.html`, `design-system.css`, `executive-home.js` |
| Capital Center | `capital-center.html`, `capital-center.js` |
| Autenticação | `login.html`, `auth/session.js`, `auth/config.example.js` |
| Configuração organizacional | `config/organization.json`, `config/modules.json`, `config/permissions.json` |
| Banco | `supabase/schema.sql`, `supabase/seed.sql`, `supabase/002_bootstrap_owner.sql`, `supabase/003_company_crud_policies.sql` |
| Ativação | `AUTH_SETUP.md`, `CAPITAL_CENTER_SETUP.md`, `supabase/README.md` |

## Arquitetura atual

- Aplicação estática em HTML, CSS e JavaScript.
- Supabase JS v2 carregado por CDN.
- Autenticação com Supabase Auth.
- Dados persistentes planejados/implementados no Supabase.
- Isolamento multi-organização por `organization_id` e políticas RLS.
- Sem pipeline de build ou testes automatizados registrado.
- Sem migrações versionadas por ferramenta de CLI; os SQLs são aplicados manualmente.

## O que está implementado de verdade

- Login por e-mail e senha.
- Proteção de sessão no frontend.
- Leitura da organização pelo slug.
- Leitura de empresas.
- CRUD de empresas conforme papel e RLS.
- Dashboard com dados híbridos: parte estática e parte Supabase.

## O que ainda é fundação ou placeholder

- Decision Center funcional.
- Project Center funcional.
- People Center funcional.
- Knowledge Center funcional.
- Venture Lab funcional.
- Investor Portal funcional.
- Business Graph e busca global.
- IA Executiva conectada a dados autorizados.
- React/componentização.
- testes automatizados, CI e observabilidade.

## Divergências documentais encontradas

O `README.md` original lista autenticação, Supabase e CRUD como “próximas etapas”, mas parte dessas funções já existe. Antes da próxima entrega, atualizar o README para refletir o estado real.

## Regra de retomada econômica

Use este prompt curto em uma nova sessão:

> Trabalhe no Command Center OS do repositório GrupoMauricio/mrc-os. Leia primeiro command-center/PROJECT_CHECKPOINT.md e command-center/NEXT_PHASE.md. Depois carregue apenas os arquivos da frente que será implementada. Não reconstrua o histórico antigo.

## Definição de “tudo salvo”

O GitHub preserva código, SQL, documentação e modelos de configuração. Ele não substitui:

- banco e dados vivos do Supabase;
- usuários e senhas;
- variáveis configuradas na hospedagem;
- domínio e DNS;
- histórico operacional gerado depois do deploy;
- backups da infraestrutura externa.

Esses itens devem ser inventariados e exportados por seus respectivos provedores, sem publicar segredos no repositório.
