# Command Center OS

Sistema Operacional do Grupo Maurício.

## Primeira fundação

Esta versão estabelece:

- Dashboard Executivo;
- Decision Center;
- Capital Center;
- Project Center;
- People Center;
- Knowledge Center;
- Venture Lab;
- Investor Portal;
- layout responsivo para desktop e celular;
- configuração multi-organização separada em `config/organization.json`.

## Execução

O protótipo é estático e pode ser aberto diretamente pelo arquivo `index.html` ou publicado em uma rota estática `/command-center`.

## Arquitetura

A plataforma é genérica e reutilizável. Os dados e a identidade do Grupo Maurício ficam isolados na camada de configuração, permitindo que no futuro outras organizações utilizem o mesmo núcleo.

## Próximas etapas

1. Transformar a interface estática em componentes React.
2. Criar autenticação e perfis de acesso.
3. Modelar dados no Supabase.
4. Implementar CRUD de empresas, projetos, pessoas e decisões.
5. Conectar IA Executiva aos dados autorizados.
