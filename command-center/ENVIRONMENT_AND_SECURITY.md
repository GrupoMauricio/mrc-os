# Ambientes, segurança e preservação

## Classificação do que pode ser versionado

### Público no GitHub

- URL do projeto Supabase;
- chave `anon`/publishable usada pelo navegador;
- esquema SQL e políticas RLS;
- modelos `.env.example` e `config.example.js`;
- documentação sem credenciais privadas.

A chave `anon` não concede privilégios administrativos por si só. A segurança depende de RLS correta e ativa.

### Nunca publicar

- senha de usuário;
- `service_role` key;
- access tokens pessoais;
- tokens de deploy;
- credenciais SMTP;
- chaves privadas;
- backups contendo dados pessoais;
- arquivos `.env` reais de backend.

## Constatação da auditoria

O arquivo `auth/config.js` está versionado e contém a URL real e uma chave pública/publishable do Supabase. Isso contradiz a documentação e o `.gitignore`, que tratam o arquivo como configuração de ambiente.

Não foi encontrada `service_role` key no conjunto auditado. Mesmo assim, na próxima intervenção técnica deve-se escolher formalmente uma estratégia:

1. manter a chave publishable no frontend e documentar que ela é pública; ou
2. gerar `auth/config.js` durante o deploy, deixando somente o modelo no GitHub.

Não remover o arquivo da versão atual sem validar a hospedagem, pois a aplicação estática depende dele para iniciar.

## Infraestrutura externa a confirmar

| Item | Estado no código | Confirmação externa necessária |
|---|---|---|
| Supabase Project URL | presente | projeto ativo |
| Supabase anon key | presente | chave válida/rotacionada |
| Usuário proprietário | UUID registrado no SQL | usuário ativo e acesso testado |
| RLS | SQL versionado | políticas aplicadas no banco |
| Dados do Capital Center | estrutura versionada | backup/exportação do banco |
| Hospedagem | `netlify.toml` presente | site atual e commit implantado |
| Domínio | não controlado pelo GitHub | DNS e certificado |
| Variáveis de deploy | não inventariadas | painel do provedor |

## Checklist antes da nova fase

- [ ] confirmar qual URL é a produção oficial;
- [ ] confirmar o commit atualmente publicado;
- [ ] testar login como proprietário;
- [ ] validar CRUD do Capital Center;
- [ ] exportar esquema e dados do Supabase;
- [ ] revisar RLS com testes por papel;
- [ ] registrar variáveis apenas pelos nomes, nunca pelos valores secretos;
- [ ] criar rotina de backup do banco;
- [ ] configurar CI para validação mínima;
- [ ] adicionar política de recuperação e rollback.

## Regra operacional

Toda nova fase deve terminar com:

1. código commitado;
2. documentação de estado atualizada;
3. migrações SQL versionadas;
4. testes registrados;
5. commit implantado identificado;
6. pendências externas listadas;
7. nenhum segredo privado no GitHub.
