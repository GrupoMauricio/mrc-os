# Ativação do acesso

## 1. Criar o projeto Supabase

Crie um projeto e copie apenas:

- Project URL
- anon public key

Nunca publique a service_role key no frontend.

## 2. Aplicar o banco

No SQL Editor, execute na ordem:

1. `supabase/schema.sql`
2. `supabase/seed.sql`
3. `supabase/002_bootstrap_owner.sql` somente após criar o usuário

## 3. Criar o usuário proprietário

Em Authentication > Users, crie o usuário:

- Nome: Maurício Ramos
- E-mail: agencianextlevelbr@gmail.com

Copie o UUID gerado e substitua as duas ocorrências de `00000000-0000-0000-0000-000000000000` em `002_bootstrap_owner.sql`.

## 4. Configurar o frontend

Copie `auth/config.example.js` para `auth/config.js` e preencha:

```js
window.COMMAND_CENTER_CONFIG = {
  supabaseUrl: "https://seu-projeto.supabase.co",
  supabaseAnonKey: "sua-chave-anon-publica",
  organizationSlug: "grupo-mauricio",
  locale: "pt-BR",
  timezone: "America/Sao_Paulo"
};
```

O arquivo real `auth/config.js` não deve ser commitado quando contiver credenciais de ambiente.

## 5. Acesso

Abra `/command-center/login.html` e entre com o usuário criado.

## Segurança

- Senhas são geridas pelo Supabase Auth.
- O frontend usa somente a anon public key.
- O isolamento entre organizações depende das políticas RLS.
- A service_role key deve permanecer exclusivamente em ambiente de servidor.
