# Próxima fase do Command Center OS

## Objetivo recomendado

Transformar a fundação atual em um sistema operacional utilizável diariamente por Maurício, começando por um fluxo único e completo:

**Radar de oportunidades → análise → aprovação de Maurício → projeto/proposta → acompanhamento.**

Esse recorte conecta diretamente a próxima fase ao uso real do Grupo Maurício, NextLevel e IDESA, sem tentar construir todos os módulos ao mesmo tempo.

## Ordem de execução

### Fase 1 — estabilização

- confirmar produção, Supabase e acesso;
- corrigir documentação desatualizada;
- formalizar configuração de ambiente;
- transformar SQLs em migrações idempotentes;
- adicionar validação automática mínima;
- registrar backup e rollback.

### Fase 2 — núcleo operacional

- modelo de oportunidades e organizações;
- classificação por radar:
  - IDESA;
  - NextLevel — pequenos negócios do Brás;
  - NextLevel — grandes empresas com entrada ou atuação no Brás;
  - outros projetos estratégicos;
- status e prioridade;
- responsável, origem, prazo e valor potencial;
- tela de aprovações de Maurício;
- histórico de decisões.

### Fase 3 — geração assistida

- geração de apresentação personalizada;
- geração de e-mail de abordagem;
- aprovação humana antes de qualquer envio;
- registro de versão, destinatário e resultado;
- biblioteca de narrativas por organização e porte.

### Fase 4 — automação controlada

- ingestão diária de oportunidades;
- deduplicação;
- enriquecimento e score;
- fila diária de aprovações;
- alertas de follow-up;
- métricas de conversão e receita potencial.

## Critérios para não desperdiçar créditos

- desenvolver uma vertical completa por vez;
- abrir somente os arquivos necessários para a tarefa;
- manter este arquivo e `PROJECT_CHECKPOINT.md` atualizados;
- registrar decisões arquiteturais em arquivos curtos;
- evitar reexplicar todo o Grupo Maurício a cada sessão;
- não gerar documentos longos antes de validar o fluxo operacional;
- terminar cada sessão com um resumo de mudanças e próximo passo.

## Primeiro pacote técnico

O primeiro pacote da nova fase deve entregar:

1. tabela `opportunities`;
2. tabela `approvals`;
3. políticas RLS;
4. Radar Center responsivo;
5. filtros pelos quatro radares;
6. cadastro e edição;
7. aprovação/rejeição por Maurício;
8. histórico básico;
9. testes de autorização;
10. documentação e checkpoint atualizados.

## Fora do primeiro pacote

- envio automático de e-mail;
- scraping amplo;
- automação irrestrita;
- CRM completo;
- apresentações finais em um clique;
- todos os módulos antigos simultaneamente.

Esses itens entram somente depois de o Radar Center e as aprovações estarem estáveis.
