# Autenticação

Esta pasta contém a camada de autenticação do Command Center OS.

- `config.example.js`: modelo público de configuração.
- `config.js`: configuração local/ambiente, ignorada pelo Git.
- `session.js`: login, logout, persistência e proteção de sessão.

A chave `anon` pode ser utilizada no navegador quando as políticas RLS estão corretamente configuradas. Nunca utilize a chave `service_role` no frontend.
