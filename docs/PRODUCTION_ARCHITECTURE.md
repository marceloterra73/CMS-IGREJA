# ESPECIFICAÇÃO ARQUITETURAL DE PRODUÇÃO — CMS VISUAL PARA IGREJAS
**Documento Técnico Mestre — Fase 55**  
**Versão:** 1.0.0  
**Data:** 2026-09-09  
**Status:** APROVADA / EM VIGOR  

---

## 1. VISÃO GERAL E CONTEXTO

O projeto **CMS Visual para Igrejas** completou e homologou com 100% de integridade as **Fases 0 a 54**. 
Atualmente, o sistema opera de forma autônoma e completa no ambiente cliente, estruturado da seguinte forma:

```text
┌─────────────────────────────────────────────────────────────┐
│                    COMPONENTES DO CMS                       │
│  (SettingsView, AppearanceView, PagesView, SchedulesView,   │
│   DonationsView, LiveStreamView, SEOView, DomainsView, etc.)│
└──────────────────────────────┬──────────────────────────────┘
                               │
                               ▼
┌─────────────────────────────────────────────────────────────┐
│                   CmsCanonicalRepository                    │
│            (Orquestrador Canônico no Frontend)              │
└──────────────────────────────┬──────────────────────────────┘
                               │
                               ▼
┌─────────────────────────────────────────────────────────────┐
│                       StorageEngine                         │
│               (Interface Abstrata de Storage)               │
└──────────────────────────────┬──────────────────────────────┘
                               │
                               ▼
┌─────────────────────────────────────────────────────────────┐
│                   localCmsStorageEngine                     │
│               (Provedor Local no Navegador)                 │
└──────────────────────────────┬──────────────────────────────┘
                               │
                               ▼
┌─────────────────────────────────────────────────────────────┐
│                        localStorage                         │
│            Chaves canônicas: cms:<tenantId>:<resource>      │
└─────────────────────────────────────────────────────────────┘
```

Este documento estabelece a **especificação arquitetural definitiva e oficial** para a futura transição da aplicação local para uma **arquitetura conectada a servidor de produção**, sem quebrar ou descontinuar nenhuma funcionalidade desenvolvida até a Fase 54.

> **DIRETRIZ MANDATÓRIA DA FASE 55:**  
> Esta fase é **estritamente arquitetural e documental**. Nenhuma linha de backend executável, endpoints de API, schemas de banco de dados, migrations, containers Docker ou serviços de infraestrutura foram criados. O sistema permanece 100% funcional em sua persistência canônica local atual.

---

## 2. AUDITORIA DA ARQUITETURA ATUAL (CÓDIGO REAL)

A auditoria exaustiva realizada no código-fonte do projeto revelou os seguintes fatos arquiteturais:

1. **Isolamento Absoluto de Storage Físico:**
   - 100% das chamadas a `localStorage` residem exclusivamente em `src/core/persistence/storageEngine.ts`.
   - Nenhum componente de UI (`src/components/`), renderizador público (`src/components/public-site/`) ou módulo de domínio acessa diretamente `localStorage`, `sessionStorage` ou `IndexedDB`.
2. **Zero Chamadas Externas de Rede:**
   - Não há nenhuma ocorrência de `fetch(`, `axios` ou `XMLHttpRequest` em todo o código-fonte sob `src/`.
   - A aplicação é totalmente autossuficiente e imune a dependências externas em tempo de execução.
3. **Orquestração Canônica Centralizada:**
   - Todos os componentes administrativos utilizam a instância única `cmsRepository` (`CmsCanonicalRepository`) exportada por `src/core/persistence`.
   - Todas as operações de leitura e escrita operam estritamente sobre os contratos canônicos definidos em `src/types/index.ts`.
4. **Renderizador Público Desacoplado:**
   - O `PublicSiteRenderer` e o `PublicSiteView` consomem os dados do repositório através de props ou via `cmsRepository`, sem qualquer acesso físico a armazenamento ou APIs.
5. **Injeção de Dependência no Repositório:**
   - O construtor de `CmsCanonicalRepository` recebe uma instância de `StorageEngine`:
     `constructor(engine: StorageEngine = localCmsStorageEngine)`
   - Essa estrutura permite que qualquer mecanismo de armazenamento seja conectado sem alterar a API pública do repositório.

---

## 3. ARQUITETURA ALVO DE PRODUÇÃO (TARGET ARCHITECTURE)

A arquitetura futura de produção preservará integralmente a interface de alto nível do CMS, desacoplando o backend da visualização por meio da interface `StorageEngine`:

```text
┌────────────────────────────────────────────────────────────────────────┐
│                              FRONTEND                                  │
│                                                                        │
│  ┌──────────────────────┐              ┌────────────────────────────┐  │
│  │     SITE PÚBLICO     │              │     PAINEL ADMINISTRATIVO  │  │
│  │ (PublicSiteRenderer) │              │      (Componentes CMS)     │  │
│  └──────────┬───────────┘              └─────────────┬──────────────┘  │
│             │                                        │                 │
│             └───────────────────┬────────────────────┘                 │
│                                 │                                      │
│                                 ▼                                      │
│                  ┌──────────────────────────────┐                      │
│                  │    CmsCanonicalRepository    │                      │
│                  └──────────────┬───────────────┘                      │
│                                 │                                      │
│                                 ▼                                      │
│                  ┌──────────────────────────────┐                      │
│                  │        StorageEngine         │                      │
│                  │    (Interface Polimórfica)   │                      │
│                  └──────┬────────────────┬──────┘                      │
│                         │                │                             │
│       ┌─────────────────┘                └─────────────────┐           │
│       ▼                                                    ▼           │
│ ┌──────────────────────┐                         ┌───────────────────┐ │
│ │ localCmsStorageEngine│                         │ServerPersistence- │ │
│ │  (Ambiente Local/    │                         │    Provider       │ │
│ │   Offline/Dev)       │                         │ (Produção Online) │ │
│ └──────────┬───────────┘                         └─────────┬─────────┘ │
│            │                                               │           │
│            ▼                                               │           │
│      localStorage                                          │           │
└────────────────────────────────────────────────────────────┼───────────┘
                                                             │ HTTP / HTTPS
                                                             ▼
┌────────────────────────────────────────────────────────────────────────┐
│                              BACKEND                                   │
│                                                                        │
│                       ┌─────────────────────────┐                      │
│                       │      Reverse Proxy      │                      │
│                       │     (Nginx / Caddy)     │                      │
│                       └────────────┬────────────┘                      │
│                                    │                                   │
│                                    ▼                                   │
│                       ┌─────────────────────────┐                      │
│                       │       API Gateway       │                      │
│                       │ (Auth / Rate Limit / RLS│                      │
│                       └────────────┬────────────┘                      │
│                                    │                                   │
│                                    ▼                                   │
│                       ┌─────────────────────────┐                      │
│                       │   REST API (/api/v1)    │                      │
│                       │  (Express / Fastify)    │                      │
│                       └────────────┬────────────┘                      │
│                                    │                                   │
│                                    ▼                                   │
│                       ┌─────────────────────────┐                      │
│                       │     Business Domain     │                      │
│                       │  (Multi-Tenant Service) │                      │
│                       └────────────┬────────────┘                      │
│                                    │                                   │
│             ┌──────────────────────┴──────────────────────┐            │
│             ▼                                             ▼            │
│  ┌────────────────────┐                        ┌────────────────────┐  │
│  │   Banco de Dados   │                        │   Object Storage   │  │
│  │ (PostgreSQL + RLS) │                        │ (S3-compatible CDN)│  │
│  └────────────────────┘                        └────────────────────┘  │
└────────────────────────────────────────────────────────────────────────┘
```

### Princípios Invioláveis da Arquitetura Alvo:
1. **O Frontend desconhece o Banco de Dados:** Nenhuma instrução SQL, detalhe de tabela, schema ORM ou credencial de banco existirá no frontend.
2. **O Repositório é a Fonte Única da Verdade:** Componentes da interface continuam interagindo exclusivamente com `cmsRepository`.
3. **Preservação dos Contratos de Domínio:** O contrato canônico entre o frontend e a camada de persistência não muda.

---

## 4. MAPA DOS CONTRATOS CANÔNICOS PARA O BACKEND

Todos os dados persistidos no servidor corresponderão fielmente aos contratos já tipados no arquivo `src/types/index.ts`. A tabela abaixo mapeia cada contrato atual para seu correspondente recurso de API e armazenamento:

| Contrato Canônico (Frontend) | Recurso da API | Tabela Principal (Banco) | Tipo de Armazenamento | Escopo Tenant |
| :--- | :--- | :--- | :--- | :--- |
| `SiteSettings` | `/api/v1/settings` | `site_settings` | Relacional / JSONB | Obrigatório (`tenant_id`) |
| `InstitutionalContent` | `/api/v1/institutional` | `institutional_contents` | Relacional / JSONB | Obrigatório (`tenant_id`) |
| `VisualTheme[]` | `/api/v1/themes` | `visual_themes` | Relacional / JSONB | Obrigatório (`tenant_id`) |
| `activeThemeId: string` | `/api/v1/themes/active` | `tenants.active_theme_id` | Coluna FK | Obrigatório (`tenant_id`) |
| `SiteSEO` | `/api/v1/seo` | `site_seo` | Relacional | Obrigatório (`tenant_id`) |
| `Page[]` | `/api/v1/pages` | `pages` | Relacional | Obrigatório (`tenant_id`) |
| `SectionInstance[]` | `/api/v1/pages/:id/sections`| `page_sections` | Relacional | Obrigatório (`tenant_id`) |
| `BlockInstance[]` | `/api/v1/sections/:id/blocks`| `page_blocks` | Relacional + JSONB | Obrigatório (`tenant_id`) |
| `NavigationMenu[]` | `/api/v1/navigation` | `navigation_menus` | Relacional + JSONB | Obrigatório (`tenant_id`) |
| `SiteDomain[]` | `/api/v1/domains` | `site_domains` | Relacional | Obrigatório (`tenant_id`) |
| `SiteAnalytics` | `/api/v1/analytics` | `site_analytics` | Relacional | Obrigatório (`tenant_id`) |
| `ChurchSchedule[]` | `/api/v1/schedules` | `church_schedules` | Relacional | Obrigatório (`tenant_id`) |
| `ChurchDonationInfo` | `/api/v1/donations` | `church_donations` | Relacional + JSONB | Obrigatório (`tenant_id`) |
| `ChurchLiveStreamInfo` | `/api/v1/live-stream` | `church_live_streams` | Relacional | Obrigatório (`tenant_id`) |
| `MediaItem[]` | `/api/v1/media` | `media_items` | Relacional + S3 Meta | Obrigatório (`tenant_id`) |
| `User` (Fase 13) | `/api/v1/users` | `users` | Relacional | Obrigatório (`tenant_id`) |
| `Tenant` | `/api/v1/tenants` | `tenants` | Relacional | Identificador Raiz |

---

## 5. ESPECIFICAÇÃO DO BANCO DE DADOS

### 5.1 Tecnologia Selecionada
- **SGBD Recomendado:** **PostgreSQL (15+)**
- **Justificativa Técnica:**
  - Suporte nativo a **Row-Level Security (RLS)** para isolamento automático e inviolável de multi-tenancy a nível de engine de dados.
  - Excelente suporte a tipos relacionais estritos com integridade referencial (ACID) associado a campos `JSONB` indexados (GIN), perfeitos para armazenar dados polimórficos de blocos do CMS sem degradação de performance.
  - Robustez comprovada em ambientes de produção corporativos e facilidade de backup físico e lógico contínuo (WAL archiving / pg_dump).

### 5.2 Estrutura de Tabelas e Relacionamentos

```text
┌─────────────────────────────────────────────────────────────┐
│                          tenants                            │
│ ─────────────────────────────────────────────────────────── │
│ id: VARCHAR(64) PRIMARY KEY                                 │
│ name: VARCHAR(255) NOT NULL                                 │
│ slug: VARCHAR(100) UNIQUE NOT NULL                          │
│ status: VARCHAR(20) NOT NULL ('active', 'suspended', etc.)  │
│ active_theme_id: VARCHAR(64)                                │
│ created_at: TIMESTAMPTZ NOT NULL DEFAULT NOW()              │
│ updated_at: TIMESTAMPTZ NOT NULL DEFAULT NOW()              │
│ deleted_at: TIMESTAMPTZ NULL (Soft Delete)                  │
└──────────────────────────────┬──────────────────────────────┘
                               │ 1:N (CASCADE)
         ┌─────────────────────┼─────────────────────┐
         ▼                     ▼                     ▼
┌──────────────────┐  ┌──────────────────┐  ┌──────────────────┐
│      users       │  │      pages       │  │ church_schedules │
│ ──────────────── │  │ ──────────────── │  │ ──────────────── │
│ id: UUID (PK)    │  │ id: VARCHAR(64)  │  │ id: VARCHAR(64)  │
│ tenant_id: (FK)  │  │ tenant_id: (FK)  │  │ tenant_id: (FK)  │
│ email: VARCHAR   │  │ title: VARCHAR   │  │ title: VARCHAR   │
│ role: VARCHAR    │  │ slug: VARCHAR    │  │ day_of_week: STR │
│ status: VARCHAR  │  │ status: VARCHAR  │  │ time: VARCHAR    │
│ created_at...    │  │ is_home: BOOLEAN │  │ status: VARCHAR  │
└──────────────────┘  │ order_num: INT   │  │ created_at...    │
                      │ seo: JSONB       │  └──────────────────┘
                      └────────┬─────────┘
                               │ 1:N
                               ▼
                      ┌──────────────────┐
                      │  page_sections   │
                      │ ──────────────── │
                      │ id: VARCHAR(64)  │
                      │ page_id: (FK)    │
                      │ tenant_id: (FK)  │
                      │ order_num: INT   │
                      │ is_visible: BOOL │
                      │ settings: JSONB  │
                      └────────┬─────────┘
                               │ 1:N
                               ▼
                      ┌──────────────────┐
                      │   page_blocks    │
                      │ ──────────────── │
                      │ id: VARCHAR(64)  │
                      │ section_id: (FK) │
                      │ tenant_id: (FK)  │
                      │ type: VARCHAR    │
                      │ order_num: INT   │
                      │ is_visible: BOOL │
                      │ config: JSONB    │
                      │ data: JSONB      │
                      └──────────────────┘
```

### 5.3 Regras Gerais de Banco de Dados:
1. **Identificador Canônico:** Toda tabela associada a uma congregação **deve** conter a coluna `tenant_id VARCHAR(64) NOT NULL REFERENCES tenants(id) ON DELETE CASCADE`.
2. **Índices de Performance:** Toda tabela deve possuir um índice composto `CREATE INDEX idx_<tabela>_tenant ON <tabela>(tenant_id);`.
3. **Auditoria Temporal:** Todas as tabelas devem conter `created_at` e `updated_at` preenchidos automaticamente via triggers.
4. **Soft Delete:** Exclusão lógica com `deleted_at` nulo por padrão para prevenir exclusões acidentais de páginas ou registros institucionais.

---

## 6. ESPECIFICAÇÃO DO ISOLAMENTO MULTI-TENANT

O isolamento entre igrejas é o requisito de maior criticidade de todo o projeto (`PROJECT_GUARD.md`).

### 6.1 Resolução do Tenant
A identificação do tenant em cada requisição à API deve seguir a seguinte precedência estrita:
1. **Host Header (Domínio Personalizado):** O servidor busca na tabela `site_domains` o registro `hostname = req.hostname` com `status = 'active'`. Se encontrado, resolve o `tenant_id`.
2. **Subdomínio:** Se o host for `<slug>.dominiodocms.com.br`, busca o tenant pelo `slug`.
3. **Contexto Autenticado:** Para rotas administrativas (`/api/v1/admin/*`), o `tenant_id` é extraído do token de autenticação criptograficamente assinado do usuário.
4. **Header Explícito (Superadmin):** Usuários com papel `'superadmin'` podem alternar de congregação enviando o header `X-Tenant-ID: <id>`. Usuários com papéis regulares são sumariamente rejeitados com status `403 Forbidden` se tentarem consultar outro tenant.

### 6.2 Garantia de Isolamento no PostgreSQL (Row-Level Security)
Para garantir que nenhum erro de programação (como esquecer um `WHERE tenant_id = ...`) resulte em vazamento cruzado de dados, o banco utilizará RLS:

```sql
-- Ativação de RLS na tabela de páginas
ALTER TABLE pages ENABLE ROW LEVEL SECURITY;

-- Política de isolamento estrito
CREATE POLICY tenant_isolation_policy ON pages
  FOR ALL
  USING (tenant_id = current_setting('app.current_tenant_id', true));
```

A cada conexão obtida do pool, o backend executará `SET LOCAL app.current_tenant_id = '<tenantId>'`, tornando fisicamente impossível uma query retornar dados de outra igreja.

---

## 7. USUÁRIOS, PAPÉIS E PERMISSÕES (RBAC)

Baseado no contrato canônico consolidado na **Fase 13** (`src/core/users.ts` e `src/types/index.ts`):

### 7.1 Papéis Canônicos
1. **`superadmin`:** Administrador da plataforma inteira. Acesso multi-tenant irrestrito, gerenciamento de instâncias e suporte global.
2. **`tenant_admin`:** Administrador geral da congregação. Acesso total a todas as configurações, páginas, usuários e temas da sua respectiva igreja.
3. **`pastor`:** Liderança pastoral. Visualização de relatórios, pedidos de oração, aprovação de sermões e publicação de conteúdos.
4. **`editor`:** Editor de conteúdo. Criação e edição de páginas, notícias, eventos e cultos. Sem acesso a configurações fiscais/domínios.
5. **`media_volunteer`:** Voluntário de mídia. Upload de arquivos, fotos da galeria, gerenciamento de links da transmissão ao vivo e cadastro de áudios de sermões.

### 7.2 Permissões Canônicas Mapeadas
- `manage:tenant`
- `manage:users`
- `manage:pages`
- `publish:pages`
- `manage:blocks`
- `manage:media`
- `manage:navigation`
- `manage:themes`
- `manage:modules`
- `manage:sermons`
- `manage:events`
- `manage:prayer_requests`
- `view:analytics`

---

## 8. AUTENTICAÇÃO E SESSÃO

### 8.1 Mecanismo de Autenticação
- **Tokens Assinados (JWT) em Cookies HTTP-Only:**
  - `access_token` (vida curta: 15 minutos): Contém `userId`, `tenantId`, `role` e permissões.
  - `refresh_token` (vida longa: 7 a 30 dias): Armazenado com hash criptográfico no banco para permitir revogação instantânea de sessão.
- **Segurança de Cookies:** Flags obrigatórias `HttpOnly; Secure; SameSite=Strict`. Proteção total contra scripts maliciosos (XSS) e Cross-Site Request Forgery (CSRF).

### 8.2 Fluxo de Sessão
1. `POST /api/v1/auth/login`: Validação de e-mail/senha com bcrypt/argon2 -> Emissão de cookies de sessão.
2. `POST /api/v1/auth/refresh`: Rotação segura de refresh token e emissão de novo access token.
3. `POST /api/v1/auth/logout`: Invalidação do token no banco e limpeza dos cookies.
4. `POST /api/v1/auth/forgot-password`: Envio de token único de recuperação com expiração em 1 hora.

---

## 9. ESPECIFICAÇÃO DA API RESTFUL (`/api/v1`)

### 9.1 Padrão de Endpoints Canônicos

| Método | Rota | Descrição | Permissão Mínima |
| :--- | :--- | :--- | :--- |
| **GET** | `/api/v1/public/site` | Dados completos consolidados para o Site Público | Pública |
| **GET** | `/api/v1/settings` | Obtém `SiteSettings` da igreja | `manage:tenant` |
| **PUT** | `/api/v1/settings` | Atualiza `SiteSettings` da igreja | `manage:tenant` |
| **GET** | `/api/v1/institutional` | Obtém `InstitutionalContent` | Autenticado |
| **PUT** | `/api/v1/institutional` | Atualiza `InstitutionalContent` | `manage:tenant` |
| **GET** | `/api/v1/themes` | Lista todos os `VisualTheme` | Autenticado |
| **POST** | `/api/v1/themes` | Cria novo tema | `manage:themes` |
| **PUT** | `/api/v1/themes/:id` | Atualiza tema específico | `manage:themes` |
| **POST** | `/api/v1/themes/active` | Define tema ativo | `manage:themes` |
| **GET** | `/api/v1/pages` | Lista páginas do tenant | `manage:pages` |
| **POST** | `/api/v1/pages` | Cria nova página com seções/blocos | `manage:pages` |
| **GET** | `/api/v1/pages/:id` | Retorna página detalhada com seções | `manage:pages` |
| **PUT** | `/api/v1/pages/:id` | Atualiza página, seções e blocos | `manage:pages` |
| **DELETE**| `/api/v1/pages/:id` | Exclusão lógica de página | `manage:pages` |
| **GET** | `/api/v1/navigation` | Lista menus de navegação | Autenticado |
| **PUT** | `/api/v1/navigation` | Atualiza menus e hierarquia de links | `manage:navigation` |
| **GET** | `/api/v1/schedules` | Lista horários de cultos | Autenticado |
| **PUT** | `/api/v1/schedules` | Atualiza grade completa de cultos | `manage:modules` |
| **GET** | `/api/v1/donations` | Obtém dados de doação e PIX | Autenticado |
| **PUT** | `/api/v1/donations` | Atualiza dados de doação e PIX | `manage:tenant` |
| **GET** | `/api/v1/live-stream` | Obtém status de transmissão ao vivo | Autenticado |
| **PUT** | `/api/v1/live-stream` | Atualiza status e URL da live | `manage:modules` |
| **GET** | `/api/v1/media` | Lista arquivos de mídia com paginação | `manage:media` |
| **POST** | `/api/v1/media/presigned`| Gera URL para upload direto ao S3 | `manage:media` |
| **POST** | `/api/v1/media/confirm` | Registra metadados após upload concluído | `manage:media` |
| **GET** | `/api/v1/domains` | Lista domínios configurados | `manage:tenant` |
| **POST** | `/api/v1/domains` | Adiciona novo domínio | `manage:tenant` |
| **DELETE**| `/api/v1/domains/:id` | Remove domínio configurado | `manage:tenant` |
| **GET** | `/api/v1/analytics` | Obtém configurações de analytics | `view:analytics` |
| **PUT** | `/api/v1/analytics` | Atualiza IDs de rastreamento | `manage:tenant` |

### 9.2 Formato Padronizado de Erros

```json
{
  "success": false,
  "error": {
    "code": "VALIDATION_FAILED",
    "message": "Os dados fornecidos não atendem aos critérios de validação.",
    "details": [
      {
        "field": "contactEmail",
        "message": "Formato de e-mail inválido."
      }
    ],
    "requestId": "req_fase55_78912345",
    "timestamp": "2026-09-09T12:00:00.000Z"
  }
}
```

Códigos de erro padronizados:
- `UNAUTHENTICATED`: Credenciais ausentes ou expiradas (401).
- `FORBIDDEN`: Usuário não possui a permissão requerida (403).
- `RESOURCE_NOT_FOUND`: Entidade não encontrada ou pertencente a outro tenant (404).
- `VALIDATION_FAILED`: Dados em desconformidade com o schema (422).
- `TENANT_INACTIVE`: Igreja suspensa ou pendente de ativação (403).
- `RATE_LIMIT_EXCEEDED`: Excesso de requisições por segundo/minuto (429).
- `INTERNAL_SERVER_ERROR`: Falha não esperada no servidor (500).

---

## 10. ESTRATÉGIA DE CONEXÃO DO STORAGE ENGINE AO SERVIDOR

A grande vantagem da arquitetura consolidada na **Fase 54** é que o `CmsCanonicalRepository` interage com o armazenamento através da interface `StorageEngine`:

```typescript
export interface StorageEngine {
  read<T>(key: string, fallback: T): T | Promise<T>;
  write<T>(key: string, data: T): boolean | Promise<boolean>;
  remove(key: string): boolean | Promise<boolean>;
  exists(key: string): boolean | Promise<boolean>;
  clearByPrefix(prefix: string): boolean | Promise<boolean>;
}
```

Na fase futura de transição (Fase 59):
1. Será implementado o `serverCmsStorageEngine` (ou `ServerPersistenceProvider`).
2. Esse engine traduzirá as operações para requisições HTTP RESTful correspondentes à chave canônica (ex.: `write('cms:ib_central:settings', data)` se tornará um `PUT /api/v1/settings`).
3. O `cmsRepository` simplesmente receberá `new CmsCanonicalRepository(serverCmsStorageEngine)`.
4. **Nenhum componente do CMS precisará ser modificado.** O painel continuará chamando `cmsRepository.savePages()`, `cmsRepository.loadSchedules()`, etc.

---

## 11. ESTRATÉGIA DE MIGRAÇÃO LOCAL → SERVIDOR

Para migrar os dados existentes no `localStorage` dos navegadores dos clientes para o novo banco de dados relacional em produção, será executado um procedimento em 8 passos:

```text
  1. EXPORTAÇÃO
     Varredura de todas as chaves 'cms:<tenantId>:*' no localStorage.
         ↓
  2. VALIDAÇÃO DE INTEGRIDADE
     Validação contra schemas Zod para garantir que os dados atendem aos contratos.
         ↓
  3. TRANSFORMAÇÃO DE PAYLOAD
     Empacotamento em um envelope canônico de migração (Bundle JSON).
         ↓
  4. ENVIO AUTENTICADO
     Envio via POST /api/v1/admin/migration/import com token de tenant_admin.
         ↓
  5. INGESTÃO TRANSACIONAL (BEGIN TRANSACTION)
     Backend insere entidades em ordem de dependência relacional no PostgreSQL.
         ↓
  6. CONFIRMAÇÃO & VERIFICAÇÃO DE CHECKSUM
     Backend retorna hash de confirmação de sucesso de gravação.
         ↓
  7. BACKUP LOCAL & ATIVAÇÃO
     LocalStorage marca flag 'cms:<tenantId>:migrated = true' e mantém backup local.
         ↓
  8. COMUTAÇÃO DE PROVEDOR
     Aplicação passa a ler e gravar exclusivamente no ServerPersistenceProvider.
```

---

## 12. GESTÃO E ARMAZENAMENTO DE MÍDIA

Atualmente, o contrato `MediaItem` suporta URLs externas e imagens em memória. Em produção, a biblioteca de mídia operará com:
1. **Direct-to-S3 Upload:** O navegador solicita à API uma URL pré-assinada (`POST /api/v1/media/presigned`).
2. **Envio Direto:** O arquivo (imagem, áudio de sermão ou documento) é enviado diretamente do navegador do usuário para o bucket S3/Cloud Storage, sem onerar a memória do servidor da aplicação.
3. **Processamento Opcional:** Microserviço ou Lambda gera thumbnails e versões webp responsivas.
4. **CDN Global:** O arquivo é servido via CloudFront / Fastly com cache na borda.

---

## 13. DOMÍNIOS, SSL E INFRAESTRUTURA DE PRODUÇÃO

Para atender a congregações com domínios próprios (ex.: `www.igrejabatista.com.br`):
1. **DNS da Igreja:** A congregação aponta um registro CNAME para `proxy.dominiodocms.com.br`.
2. **Reverse Proxy com ACME Automático:**
   - O proxy de borda (Caddy Server ou Nginx com Certbot) intercepta a requisição.
   - Utiliza TLS-SNI para gerar certificados SSL Let's Encrypt automaticamente em tempo real para qualquer domínio cadastrado.
3. **Resolução de Tenant:** O proxy encaminha a requisição com o cabeçalho `Host` original para o backend, que identifica o tenant correspondente via banco de dados.

---

## 14. MATRIZ DE DECISÕES TÉCNICAS

| Item de Decisão | Estado Oficial | Justificativa Arquitetural |
| :--- | :--- | :--- |
| **Linguagem Backend** | **DEFINIDO: TypeScript (Node.js)** | Compartilhamento 100% estrito dos tipos de `src/types/index.ts`, reduzindo retrabalho e riscos de incompatibilidade de schema. |
| **Framework Backend** | **DEFINIDO: Fastify ou Express** | Alta performance, ecossistema maduro, suporte excelente a TypeScript e middlewares de autenticação/RLS. |
| **Banco de Dados** | **DEFINIDO: PostgreSQL 15+** | Suporte a Row-Level Security nativo, robustez relacional e campos JSONB indexados. |
| **ORM / Query Builder** | **DEFINIDO: Drizzle ORM ou Prisma** | Totalmente tipado em TypeScript, controle estrito de migrations e suporte limpo a RLS. |
| **Armazenamento de Mídia** | **DEFINIDO: S3-Compatible Object Storage** | Escalabilidade infinita, baixo custo, suporte a presigned URLs e integração simples com CDN. |
| **Estratégia de Cache** | **DEFINIDO: Redis para Cache de Páginas Públicas** | O Site Público consome páginas estáticas/cacheadas para garantir carregamento sub-100ms. |
| **Deploy / Orquestração** | **DEFINIDO: Docker / VPS ou Cloud Run** | Conteinerização padrão, portabilidade e isolamento em portas internas seguras. |

---

## 15. MATRIZ DE RISCOS E MITIGAÇÕES

| Risco Identificado | Nível | Impacto | Estratégia de Mitigação |
| :--- | :--- | :--- | :--- |
| **Vazamento de dados entre Tenants** | **CRÍTICO** | Uma congregação visualizar dados ou membros de outra | Implementação de PostgreSQL Row-Level Security (RLS) + validação no middleware da API. |
| **Quebra de Contratos Canônicos** | **ALTO** | O frontend quebrar após uma atualização de schema | Tipos centralizados em TypeScript compartilhados entre backend e frontend (`src/types`). |
| **Perda de Dados na Migração** | **ALTO** | Perda de configurações feitas localmente no navegador | Validação prévia de schema, transação ACID única no banco e retenção de backup no localStorage. |
| **Queda de Performance no Site Público**| **MÉDIO** | Lentidão em dias de evento/culto ao vivo | Cache das páginas publicadas no Redis / CDN na borda. O site público não consulta o banco em cada hit. |
| **Falha em Upload de Mídias Pesadas** | **MÉDIO** | Esgotamento de memória do container | Upload direto navegador → S3 via Presigned URLs, contornando o backend da aplicação. |

---

## 16. ROADMAP DE FASES FUTURAS

Com a aprovação da especificação da **Fase 55**, as fases seguintes deverão seguir a ordem técnica canônica abaixo:

```text
┌─────────────────────────────────────────────────────────────┐
│ FASE 56: Estrutura do Backend & Servidor da API             │
│ • Setup do servidor TypeScript (Node.js/Express/Fastify)    │
│ • Roteamento base, middlewares de segurança e CORS          │
└──────────────────────────────┬──────────────────────────────┘
                               ▼
┌─────────────────────────────────────────────────────────────┐
│ FASE 57: Banco de Dados Relacional & Migrations             │
│ • Schema PostgreSQL com suporte a RLS                       │
│ • Modelos relacionais fiéis aos contratos canônicos         │
└──────────────────────────────┬──────────────────────────────┘
                               ▼
┌─────────────────────────────────────────────────────────────┐
│ FASE 58: Autenticação, Usuários & RBAC em Servidor          │
│ • Emissão e validação de tokens seguros                     │
│ • Middleware de isolamento de Tenant e controle de acesso   │
└──────────────────────────────┬──────────────────────────────┘
                               ▼
┌─────────────────────────────────────────────────────────────┐
│ FASE 59: Server Persistence Provider & Integração Frontend  │
│ • Implementação de ServerStorageEngine                      │
│ • Injeção no CmsCanonicalRepository sem alterar a UI        │
└──────────────────────────────┬──────────────────────────────┘
                               ▼
┌─────────────────────────────────────────────────────────────┐
│ FASE 60: Ferramenta de Migração Local → Servidor            │
│ • Assistente de exportação do localStorage para a API       │
│ • Validação e importação transacional segura                │
└──────────────────────────────┬──────────────────────────────┘
                               ▼
┌─────────────────────────────────────────────────────────────┐
│ FASE 61: Produção, Domínios Customizados & Homologação Final│
│ • Reverse Proxy com SSL automático                         │
│ • Homologação de ponta a ponta em ambiente real             │
└─────────────────────────────────────────────────────────────┘
```

---

## 17. CONCLUSÃO ARQUITETURAL

A arquitetura do **CMS Visual para Igrejas** está perfeitamente preparada para a transição para servidores de produção. O trabalho executado na Fase 54 isolou completamente a camada de persistência sob a interface `StorageEngine`, garantindo que a implementação futura da API e do banco de dados (Fases 56–61) ocorra de forma transparente, sustentável e sem qualquer regressão nas interfaces e experiências do usuário consolidadas nas Fases 0 a 54.
