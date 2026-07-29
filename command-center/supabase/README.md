# Supabase

Ordem recomendada de execução:

1. `schema.sql`
2. `seed.sql`
3. criar o usuário em Authentication
4. substituir o UUID em `002_bootstrap_owner.sql`
5. executar `002_bootstrap_owner.sql`

O usuário inicial será associado ao Grupo Maurício com o papel `owner`.
