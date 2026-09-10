# GUIA MESTRE DE IMPLANTAÇÃO EM PRODUÇÃO (DEPLOYMENT GUIDE)
## CMS VISUAL PARA IGREJAS — FASE 63
**Versão:** 1.0.0  
**Status:** HOMOLOGADO LOCALMENTE (PRONTO PARA EXECUÇÃO FUTURA AUTORIZADA)  
**Diretriz de Segurança:** Modo Cirúrgico / Modo Cofre (Sem acesso remoto, sem exposição de segredos)

---

## 1. ARQUITETURA DE PRODUÇÃO

O sistema em produção adota uma arquitetura em camadas de alta confiabilidade, segura e simples para VPS Linux:

```text
INTERNET
   │
   ▼
[DNS: cms.example.com (A/AAAA)]
   │
   ▼
[FIREWALL UFW: 80, 443 liberadas / 22 restrita / 3001 e 5432 BLOQUEADAS]
   │
   ▼
[NGINX REVERSE PROXY & HTTPS (Portas 80 e 443)]
   │
   ├──▶ [Arquivos Estáticos do Frontend] ──▶ /var/www/cms/current/dist (SPA Fallback)
   │
   └──▶ [Proxy Reverso /api/] ── (HTTP 1.1 / Headers / Trust Proxy: 1)
           │
           ▼
     [NODE.JS / EXPRESS (Porta Interna 127.0.0.1:3001)]
     (Gerenciado pelo Systemd: cms-backend.service)
           │
           ▼ (Pool de Conexões TCP / SSL opcional em localhost)
     [POSTGRESQL 15/16 (Porta Interna 127.0.0.1:5432)]
     ├── Tabelas: cms_resources, cms_users
     ├── Isolamento: Row-Level Security (RLS) obrigatório por tenant_id
     └── Usuários: cms_app_user (DML) / cms_admin (DDL/Migrations)
```

---

## 2. PRÉ-REQUISITOS DA VPS

Para hospedar o CMS Visual para Igrejas com estabilidade e isolamento, recomenda-se:

| Componente | Especificação Mínima | Especificação Recomendada |
| :--- | :--- | :--- |
| **Sistema Operacional** | Ubuntu 22.04 LTS ou Debian 12 | Ubuntu 24.04 LTS |
| **CPU / RAM** | 1 vCPU / 2 GB RAM | 2 vCPU / 4 GB RAM |
| **Armazenamento** | 25 GB SSD/NVMe | 50 GB NVMe |
| **Node.js** | Node.js v20 LTS ou v22 LTS | Node.js v22 LTS |
| **PostgreSQL** | PostgreSQL 15 ou 16 | PostgreSQL 16 |
| **Reverse Proxy** | Nginx 1.18+ com módulo SSL | Nginx 1.24+ |
| **SSL / TLS** | Certbot com plugin python3-certbot-nginx | Certbot 2.x |
| **Gerenciador de Processos** | Systemd nativo do Linux | Systemd nativo |

---

## 3. SELEÇÃO DO REVERSE PROXY E JUSTIFICATIVA TÉCNICA

Entre as alternativas analisadas (Nginx e Caddy), o **Nginx** foi selecionado como a tecnologia oficial:

1. **Conformidade Estrita com o Backend:** O Express em `server/app.ts` foi configurado com `app.set('trust proxy', 1)`. O Nginx realiza exatamente 1 salto de proxy reverso (`proxy_set_header X-Forwarded-For`), garantindo que o rate limiting leia o IP real do cliente.
2. **Serviço Estático de Alta Performance:** O frontend compilado com Vite (`dist/`) é servido diretamente pelo Nginx com cache longo para assets imutáveis e `try_files $uri $uri/ /index.html` para roteamento SPA, descarregando completamente o processo Node.js.
3. **Maturidade e Ubiquidade:** Nginx é o padrão em todas as distribuições Linux, possui documentação exaustiva, integração com Certbot automatizada e suporte a `systemctl reload` sem perda de conexões.

---

## 4. ESTRUTURA DE DIRETÓRIOS PADRONIZADA NA VPS

A implantação utiliza o padrão de **Releases Imutáveis com Link Simbólico**, permitindo deploys atômicos e rollbacks instantâneos sem risco de arquivos inconsistentes:

```text
/var/www/cms/
├── current -> /var/www/cms/releases/20260910_120000  (Link simbólico para release ativa)
├── releases/
│   ├── 20260910_110000/                            (Release anterior para rollback)
│   └── 20260910_120000/                            (Release atual em produção)
│       ├── dist/
│       │   ├── index.html                          (Frontend estático SPA)
│       │   ├── assets/                             (JS, CSS, Imagens)
│       │   └── server.mjs                          (Bundle compilado do Backend)
│       ├── server/
│       │   └── db/migrations/                      (Arquivos SQL de migração)
│       ├── node_modules/                           (Apenas dependências de produção)
│       ├── package.json
│       └── .env -> /var/www/cms/shared/.env        (Link para variáveis protegidas)
├── shared/
│   ├── .env                                        (Arquivo de segredos: permissão 0600)
│   └── logs/                                       (Logs do backend e auditoria)
└── /var/backups/cms/                               (Backups lógicos diários comprimidos)
```

---

## 5. VARIÁVEIS DE AMBIENTE E POLÍTICA DE SEGREDOS

O arquivo real `/var/www/cms/shared/.env` deve ser mantido fora do repositório Git, de propriedade exclusiva do usuário de serviço `cms:cms` com permissões restritas (`chmod 600`):

```bash
# Permissões na VPS:
sudo chown -R cms:cms /var/www/cms
sudo chmod 600 /var/www/cms/shared/.env
```

### Modelo de Variáveis de Produção (`shared/.env`):
```env
# Identificação e Runtime
NODE_ENV="production"
PORT="3001"
HOST="127.0.0.1"

# Origem Permitida para CORS
CORS_ORIGIN="https://cms.example.com"

# Persistência de Dados (PostgreSQL Privado)
DATABASE_URL="postgresql://cms_app_user:SENHA_FORTE_GERADA@127.0.0.1:5432/cms_igrejas?sslmode=disable"
DATABASE_HOST="127.0.0.1"
DATABASE_PORT="5432"
DATABASE_USER="cms_app_user"
DATABASE_PASSWORD="SENHA_FORTE_GERADA"
DATABASE_NAME="cms_igrejas"
DATABASE_SSL="false"
DATABASE_POOL_MIN="2"
DATABASE_POOL_MAX="10"

# Segurança de Sessão e Autenticação (Fases 58 e 62)
# Mínimo obrigatório de 32 caracteres criptograficamente aleatórios:
JWT_SECRET="GERAR_TOKEN_ALEATORIO_MIN_32_CHARS"
JWT_REFRESH_SECRET="GERAR_REFRESH_ALEATORIO_MIN_32_CHARS"
JWT_EXPIRES_IN="15m"
JWT_REFRESH_EXPIRES_IN="7d"
COOKIE_SECRET="GERAR_COOKIE_SECRET_ALEATORIO_MIN_32_CHARS"
```

---

## 6. PROCESSO DE BUILD E COMPILAÇÃO DO BACKEND

O projeto utiliza um pipeline unificado e sem necessidade de `tsx` ou ferramentas de desenvolvimento em produção:

```bash
# No ambiente de build (CI/CD ou local de preparação):
npm ci
npm run build
```

O comando `npm run build`:
1. Executa `vite build`: gera o frontend estático otimizado em `dist/`.
2. Executa `esbuild server/index.ts --bundle --platform=node --format=esm --packages=external --outfile=dist/server.mjs`: empacota todo o backend TypeScript em um único bundle ESM auto-suficiente em `dist/server.mjs`.

Na VPS de produção:
- `node dist/server.mjs` executa o backend de forma nativa e rápida.
- Nenhuma ferramenta de desenvolvimento (`tsx`, `typescript`, `@types/*`) precisa ser instalada no servidor remoto.
- `npm ci --omit=dev` garante o menor footprint de segurança possível.

---

## 7. GERENCIADOR DE PROCESSOS (SYSTEMD)

O backend é gerenciado nativamente pelo **systemd** do Linux via serviço `/etc/systemd/system/cms-backend.service`:

### Comandos de Operação:
```bash
# Iniciar o serviço
sudo systemctl start cms-backend

# Parar o serviço
sudo systemctl stop cms-backend

# Reiniciar graciosamente
sudo systemctl reload-or-restart cms-backend

# Verificar status
sudo systemctl status cms-backend

# Acompanhar logs em tempo real
sudo journalctl -u cms-backend -f -o cat
```

### Recursos de Segurança do Serviço Systemd:
- `User=cms`, `Group=cms`: execução sob usuário sem privilégios de root.
- `NoNewPrivileges=true`: impede elevação de privilégios via SUID.
- `ProtectSystem=full`: sistema de arquivos do SO montado em modo somente-leitura.
- `Restart=always`, `RestartSec=10`: recuperação automática após falha ou reboot da VPS.

---

## 8. CONFIGURAÇÃO DE REDE E FIREWALL (UFW)

A VPS deve possuir firewall ativo com princípio do menor privilégio:

```bash
# Regras recomendadas (UFW):
sudo ufw default deny incoming
sudo ufw default allow outgoing
sudo ufw allow 22/tcp comment 'SSH Seguro'
sudo ufw allow 80/tcp comment 'HTTP (Redirecionamento Let\'s Encrypt)'
sudo ufw allow 443/tcp comment 'HTTPS Nginx'
sudo ufw enable
```

**Portas Internas Restritas:**
- Porta `3001` (Node/Express): vinculada estritamente em `127.0.0.1`. Bloqueada contra acesso externo.
- Porta `5432` (PostgreSQL): vinculada estritamente em `127.0.0.1`. Bloqueada contra acesso externo.

---

## 9. HTTPS E GERENCIAMENTO DE CERTIFICADOS (SSL/TLS)

A emissão e renovação automática de certificados TLS é conduzida pelo Certbot:

```bash
# Emissão do certificado para o domínio oficial:
sudo certbot --nginx -d cms.example.com --non-interactive --agree-tos -m admin@example.com

# Teste da renovação automática:
sudo certbot renew --dry-run
```

O Nginx aplica:
- TLSv1.2 e TLSv1.3 exclusivamente.
- HSTS: `Strict-Transport-Security: max-age=31536000; includeSubDomains` (Fase 62).
- Redirecionamento permanente automático de HTTP (porta 80) para HTTPS (porta 443).

---

## 10. ESTRATÉGIA DE DOMÍNIOS E TENANTS

1. **Domínio Principal:** `cms.example.com` atende o painel administrativo e a API `/api/v1`.
2. **Resolução de Tenants:** Conforme arquitetura homologada, o isolamento dos dados ocorre via identificador de tenant (`tenantId` ou `X-Tenant-Id`) e sessões RBAC seguras.
3. **Domínios Customizados de Tenants (Fase 45):** A Fase 45 implementou a gestão informacional de domínios. A delegação de DNS ou virtual hosts dinâmicos para domínios de igrejas ocorrerá em fase específica, sem introduzir complexidade desnecessária na fundação da infraestrutura.

---

## 11. BANCO DE DADOS POSTGRESQL E MIGRAÇÕES

### Isolamento de Acesso ao Banco:
- Banco de dados: `cms_igrejas`.
- Usuário da Aplicação (`cms_app_user`): Apenas permissões DML (`SELECT`, `INSERT`, `UPDATE`, `DELETE`) sobre tabelas públicas. Políticas de RLS são aplicadas rigorosamente a cada query.
- Usuário de Migração (`cms_admin`): Utilizado exclusivamente durante `npm run db:migrate` para criar e atualizar schemas.

### Procedimento Seguro de Migração:
1. **Executar Backup Preventivo:** Gerar snapshot pré-deploy com `backup.sh`.
2. **Verificar Idempotência:** Migrações Drizzle em `server/db/migrations` são sequenciais e imutáveis.
3. **Executar Migração:**
   ```bash
   npm run db:migrate
   ```
4. **Validar Políticas RLS:** O script `migrate.ts` reaplica automaticamente as políticas RLS de `0001_rls_policies.sql`.
5. **Regra de Não-Destruição:** É estritamente proibido o uso de `DROP TABLE`, `DROP SCHEMA` ou `TRUNCATE` em migrações de produção.

---

## 12. ROTINA DE BACKUP E RESTAURAÇÃO

### Backup Lógico Automatizado (`deploy/scripts/backup.sh`):
- Executado diariamente via Cron (`0 2 * * *` — às 02:00 da manhã).
- Formato comprimido `pg_dump -Fc` armazenado em `/var/backups/cms/`.
- Cálculo de integridade `sha256sum` para cada arquivo gerado.
- Retenção automática de 14 dias de histórico com remoção de arquivos expirados.

### Restauração Segura (`deploy/scripts/restore.sh`):
- Exige arquivo `.dump` e checagem prévia de integridade SHA256.
- Solicita confirmação manual digitada (`RESTAURAR`) para evitar execuções acidentais.
- Utiliza `pg_restore --clean --if-exists`.
- Revalida e força o status ativo de Row-Level Security imediatamente após a restauração.

---

## 13. DEPLOY ATÔMICO E ESTRATÉGIA DE ROLLBACK

### Pipeline de Deploy (`deploy/scripts/deploy.sh`):
1. **Criação de Release:** Diretório com timestamp `/var/www/cms/releases/<TIMESTAMP>`.
2. **Build de Artefatos:** Frontend em `dist/` e bundle em `dist/server.mjs`.
3. **Backup Preventivo:** Execução do backup lógico do banco. Se falhar, o deploy é abortado.
4. **Migrações de Banco:** Execução de `npm run db:migrate`.
5. **Ativação Atômica:** Apontamento do symlink `/var/www/cms/current` para a nova release.
6. **Reload de Serviços:** `systemctl reload-or-restart cms-backend` e `systemctl reload nginx`.
7. **Health Check Pós-Deploy:** Consulta automatizada a `http://127.0.0.1:3001/api/v1/health`.
   - Se retornar `200 OK`, o deploy é declarado concluído e releases antigas (>5) são limpas.
   - Se falhar, o script dispara automaticamente o rollback emergencial.

### Rollback Instantâneo (`deploy/scripts/rollback.sh`):
1. Identifica a release cronológica anterior em `/var/www/cms/releases/`.
2. Redireciona o symlink `/var/www/cms/current` para a versão anterior em < 1 segundo.
3. Recarrega os serviços `cms-backend` e `nginx`.
4. Valida a restauração via Health Check.

---

## 14. POLÍTICA DE LOGS E MONITORAMENTO

- **Logs do Backend:** Direcionados para o `systemd-journald` via `SyslogIdentifier=cms-backend`.
- **Logs de Acesso Nginx:** Gravados em `/var/log/nginx/cms_access.log` com formatação padrão.
- **Higienização Estrita:** Conforme diretrizes das Fases 58, 59 e 62, nenhum log registra tokens JWT, cookies sensíveis, senhas, chaves de API ou segredos.
- **Health Check Endpoint:** `/api/v1/health` monitora a vitalidade do processo sem expor dados confidenciais.

---

## 15. CHECKLIST DE IMPLANTAÇÃO (GO-LIVE CHECKLIST)

### Fase Pré-Deploy (Local / Preparação):
- [ ] TypeScript compila com zero erros (`npm run lint` / `tsc --noEmit`).
- [ ] Build completo é gerado com sucesso (`npm run build`).
- [ ] Testes de validação passam com 100% de sucesso (`npm run verify:fase63` e fases anteriores).
- [ ] Nenhuma credencial ou segredo real presente no Git (`.env` fora do repositório).

### Fase de Configuração do Servidor (VPS):
- [ ] Usuário de sistema `cms` criado sem privilégios de root.
- [ ] Diretórios `/var/www/cms/releases`, `/var/www/cms/shared` e `/var/backups/cms` criados.
- [ ] Arquivo `/var/www/cms/shared/.env` configurado com segredos fortes e permissão `0600`.
- [ ] PostgreSQL instalado, usuário `cms_app_user` e banco `cms_igrejas` criados.
- [ ] Configuração do Nginx testada (`nginx -t`) e linkada em `/etc/nginx/sites-enabled/`.
- [ ] Certificado SSL emitido com Certbot.
- [ ] Serviço systemd `cms-backend.service` instalado e habilitado (`systemctl enable`).
- [ ] Firewall UFW ativo liberando apenas portas 22, 80 e 443.

### Fase Pós-Deploy:
- [ ] Health check retorna HTTP 200 em `https://cms.example.com/api/v1/health`.
- [ ] Painel administrativo carrega assets estáticos sem erros 404 no console.
- [ ] Login e autenticação por cookie HttpOnly e Bearer funcionam com isolamento multi-tenant.
- [ ] Backup de teste executado com sucesso e checksum validado.
- [ ] Script de rollback testado em ambiente de homologação.
