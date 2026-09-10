# CHANGELOG.md — HISTÓRICO DE MUTAÇÕES E ENTREGAS

Registro formal e estruturado de todas as fases, funcionalidades, alterações e validações realizadas no **CMS VISUAL PARA IGREJAS**.

---

## [Fase 56 — Estrutura do Backend e Servidor Base da API]
- **Data:** 2026-09-09
- **Fase:** Fase 56 — Estrutura do Backend e Servidor Base da API
- **Contexto & Escopo:**
  - Criação da fundação executável do backend e servidor HTTP base da aplicação utilizando Express (reutilizando a dependência e tipagens oficiais já homologadas no `package.json`).
  - Respeito estrito às proibições absolutas da Fase 56:
    - **NENHUM BANCO DE DADOS OU ORM:** Zero PostgreSQL, SQLite, Prisma, Drizzle ou migrations criadas.
    - **NENHUMA AUTENTICAÇÃO ANTECIPADA:** Zero tokens JWT, sessões, cookies de login ou usuários reais.
    - **NENHUM RECURSO DE NEGÓCIO OU CRUD:** Sem criação de endpoints de conteúdo antes da persistência.
    - **NENHUM SERVER PERSISTENCE PROVIDER:** `StorageEngine` preservado 100% intacto; o frontend continua consumindo o repositório local com zero regressões.
    - **ZERO CONTAMINAÇÃO DO FRONTEND:** Nenhuma alteração em `src/components/`, `src/core/` ou nos contratos canônicos de domínio em `src/types/index.ts`.
- **Módulos do Servidor Criados (`server/`):**
  1. `server/config/index.ts`: Configuração centralizada e tipada do servidor HTTP (`port`, `host`, `nodeEnv`, `isProduction`, `isTest`, `apiVersion`), sem chaves secretas ou credenciais de serviços não implementados.
  2. `server/errors/apiError.ts`: Classe `ApiError` estendendo a classe nativa com status codes HTTP e envelope canônico de erro estruturado conforme especificação da Fase 55 (`code`, `message`, `details`, `requestId`, `timestamp`).
  3. `server/middleware/requestId.ts`: Middleware de identificação e rastreabilidade de requisições com sanitização de header `X-Request-Id` recebido ou geração segura de UUID para cada ciclo HTTP.
  4. `server/middleware/logger.ts`: Middleware de logging estruturado de requisições registrando método, rota, status, duração e request ID no console (com silenciamento automático em ambiente de teste).
  5. `server/middleware/errorHandler.ts`: Middleware global de captura e tratamento de erros, formatando 100% das respostas de erro (operacionais e exceções 500) no padrão canônico JSON.
  6. `server/routes/v1/health.ts`: Endpoints canônicos `GET /api/v1/health` (monitoramento de saúde e uptime) e `GET /api/v1/status` (status técnico da versão).
  7. `server/routes/v1/index.ts`: Roteador agregador modular para a versão `v1` da API.
  8. `server/routes/index.ts`: Roteador raiz da API (`GET /api`) listando versões ativas e pontos de montagem.
  9. `server/app.ts`: Fábrica e instância da aplicação Express (`createApp`) com headers de segurança (`X-Content-Type-Options: nosniff`, `X-Frame-Options: SAMEORIGIN`, remoção de `X-Powered-By`), middlewares de JSON/urlencoded e interceptador 404 padronizado para `/api/*`.
  10. `server/index.ts`: Ponto de entrada executável do servidor HTTP (`http.createServer`) com suporte nativo a encerramento gracioso (Graceful Shutdown para `SIGTERM` e `SIGINT` com timeout de segurança).
- **Scripts NPM Atualizados:**
  - `package.json`: Adicionado script `"server": "tsx server/index.ts"`, preservando integralmente `"dev"`, `"build"`, `"preview"`, `"clean"` e `"lint"`.
- **Suíte de Testes e Homologação:**
  - Criado `scripts/verify-server-fase56.ts` com 31 asserções cobrindo:
    - Inicialização do servidor HTTP e vinculação de porta;
    - Endpoint raiz `/api` e catálogo de versões;
    - Monitoramento `GET /api/v1/health` e `GET /api/v1/status`;
    - Propagação e sanitização do header `X-Request-Id`;
    - Tratamento de rotas inexistentes (404) com envelope canônico de erro;
    - Tratamento de erros tipados `ApiError` e exceções não tratadas (500);
    - Presença de headers de segurança e ausência de `X-Powered-By`;
    - Isolamento arquitetural estrito: zero referências a APIs de navegador (`localStorage`, `window`) no backend;
    - Desacoplamento estrito: zero dependências de `server/` importadas pelos componentes do frontend;
    - Encerramento gracioso do servidor sem deixar conexões pendentes.
- **Resultados dos Testes:**
  - `scripts/verify-server-fase56.ts`: 31/31 asserções aprovadas com 100% de sucesso.
  - `scripts/verify-architecture-fase54.ts`: 24/24 asserções aprovadas com 100% de sucesso.
  - `scripts/verify-e2e-fase53.ts`: 61/61 asserções aprovadas com 100% de sucesso.
  - Linter (`tsc --noEmit`): 0 erros.
  - Build (`vite build` / `compile_applet`): Sucesso.
- **Data:** 2026-09-09
- **Fase:** Fase 55 — Especificação Arquitetural do Backend, API, Banco de Dados e Produção
- **Contexto & Escopo:**
  - Elaboração da especificação arquitetural mestra e definitiva para a futura evolução do CMS de aplicação local para sistema corporativo conectado a servidor e banco de dados.
  - Respeito estrito às proibições absolutas da Fase 55:
    - **NÃO IMPLEMENTAR BACKEND.** (Zero endpoints ou servidores de aplicação criados).
    - **NÃO CRIAR API.** (Nenhum controller, rota REST ou RPC criado).
    - **NÃO CRIAR BANCO DE DADOS.** (Nenhuma migration, schema ORM ou banco relacional provisionado).
    - **NÃO CRIAR AUTENTICAÇÃO EXECUTÁVEL.** (Zero tokens JWT, sessões ou cookies gerados em código).
    - **NÃO CRIAR FALSOS PROVEDORES/MOCKS.** (Proibição de `ServerProvider`, `ApiProvider`, etc. rigorosamente respeitada).
    - **NENHUMA DEPENDÊNCIA ADICIONADA.** (0 pacotes npm instalados).
- **Documento Arquitetural Gerado:**
  - Criação do documento oficial em `/docs/PRODUCTION_ARCHITECTURE.md`, estruturado em 17 seções técnicas cobrindo:
    1. **Visão Geral e Contexto:** Consolidação das Fases 0–54.
    2. **Auditoria da Arquitetura Atual:** Mapeamento do isolamento de `localStorage` em `storageEngine.ts`, zero chamadas externas e orquestração canônica em `cmsRepository`.
    3. **Arquitetura Alvo de Produção:** Diagrama conceitual em camadas e fluxo de dados desacoplado (`Frontend -> CmsCanonicalRepository -> StorageEngine -> ServerPersistenceProvider -> REST API -> PostgreSQL RLS`).
    4. **Mapa de Contratos Canônicos para o Backend:** Mapeamento integral de todos os tipos canônicos de `src/types/index.ts` para tabelas relacionais com isolamento mandatória por `tenant_id`.
    5. **Especificação do Banco de Dados:** Adoção de PostgreSQL 15+ com Row-Level Security (RLS), integridade referencial, chaves estrangeiras com soft delete e campos JSONB indexados com GIN para dados de blocos.
    6. **Isolamento Multi-Tenant:** Estratégia de resolução de tenant (Host Header/Domínio Customizado, Subdomínio e Contexto Autenticado) e aplicação de RLS a nível de SGBD.
    7. **Usuários, Papéis e Permissões (RBAC):** Mapeamento fiel dos papéis da Fase 13 (`superadmin`, `tenant_admin`, `pastor`, `editor`, `media_volunteer`) e das 13 permissões canônicas.
    8. **Autenticação e Sessão:** Tokens JWT em cookies HTTP-Only seguros (`SameSite=Strict`), rotação de refresh tokens e proteção CSRF/XSS.
    9. **API RESTful (`/api/v1`):** Especificação completa de mais de 25 endpoints canônicos, verbos HTTP, modelo padronizado de respostas e erros estruturados (`code`, `message`, `details`, `requestId`, `timestamp`).
    10. **Storage Engine e Conexão com Servidor:** Preservação da interface `StorageEngine` como fronteira polimórfica consumida pelo `CmsCanonicalRepository`.
    11. **Estratégia de Migração Local → Servidor:** Procedimento transacional em 8 etapas para migrar payloads do `localStorage` para o banco de produção sem perda de dados.
    12. **Gestão de Mídia:** Upload direto do navegador para Object Storage (S3-compatible) via Presigned URLs, com CDN global.
    13. **Domínios e SSL:** Relação com reverse proxy e geração automatizada de certificados TLS/SSL Let's Encrypt via ACME.
    14. **Matriz de Decisões Técnicas:** Tecnologias oficiais consolidadas e justificadas.
    15. **Matriz de Riscos e Mitigações:** Identificação e plano de contingência para 5 riscos críticos/altos.
    16. **Roadmap de Fases Futuras:** Cronograma lógico e sequencial para as Fases 56 a 61.
    17. **Conclusão Arquitetural:** Garantia de compatibilidade sem retrabalho.
- **Validação de Não-Regressão:**
  - `npx tsc --noEmit` (**lint_applet**): 0 erros.
  - `npm run build` (**compile_applet**): Sucesso.
  - Todas as suítes de testes preexistentes (`verify-persistence.ts`, `verify-audit-fase52.ts`, `verify-e2e-fase53.ts`, `verify-architecture-fase54.ts`) executadas com 100% de sucesso.
  - Preservação integral das Fases 0 a 54.

---

## [Fase 54 — Fundação da Arquitetura de Produção e Estratégia Local → Servidor]
- **Data:** 2026-09-09
- **Fase:** Fase 54 — Fundação da Arquitetura de Produção e Estratégia Local → Servidor
- **Contexto & Escopo:**
  - Fase arquitetural e preparatória que estabelece a fundação técnica segura para uma futura transição da persistência local para uma infraestrutura de produção, sem alterar o funcionamento atual da aplicação.
  - Respeito estrito às proibições fundamentais da fase:
    - **NÃO CRIAR BACKEND.** (Nenhum endpoint ou servidor de aplicação implementado).
    - **NÃO CRIAR API.** (Nenhuma rota REST, GraphQL ou RPC criada).
    - **NÃO CRIAR BANCO DE DADOS.** (Nenhum PostgreSQL, MySQL, SQLite, Supabase ou Firebase provisionado).
    - **NÃO CRIAR AUTENTICAÇÃO.** (Nenhuma sessão, token JWT ou fluxo de login implementado).
    - **NÃO CRIAR FALSOS PROVEDORES/MOCKS.** (Proibição de `ServerProvider`, `ApiProvider`, `HttpProvider`, etc. respeitada).
    - **NENHUMA DEPENDÊNCIA ADICIONADA.** (0 pacotes npm instalados).
- **Auditoria Arquitetural Conduzida:**
  1. **Auditoria de Acoplamento do `localStorage`:** Varredura integral da pasta `src/` confirmou que 100% dos acessos ao `localStorage` estão estritamente contidos dentro de `src/core/persistence/storageEngine.ts`. Zero componentes React ou módulos de domínio tocam no `localStorage` diretamente.
  2. **Auditoria de Desacoplamento via CMS Repository:** Todos os módulos do painel administrativo (`SettingsView`, `AppearanceView`, `PagesView`, `NavigationView`, `SEOView`, `DomainsView`, `AnalyticsView`, `SchedulesView`, `DonationsView`, `LiveStreamView`) e os renderizadores do site público (`PublicSiteRenderer`, `PublicSiteView`) consomem exclusivamente `cmsRepository`.
  3. **Auditoria da Camada de Persistência (Persistence Layer):** Validação da interface `StorageEngine` (`read`, `write`, `remove`, `exists`, `clearByPrefix`), comprovando que o `CmsCanonicalRepository` recebe o mecanismo de armazenamento via injeção de dependência (`constructor(engine: StorageEngine = localCmsStorageEngine)`).
  4. **Auditoria de Isolamento de Rede:** Varredura global confirmou zero chamadas a `fetch(`, `axios` ou `XMLHttpRequest` em `src/`.
  5. **Auditoria de Contratos Canônicos:** Preservação integral de todos os tipos canônicos de `src/types/index.ts` (`SiteSettings`, `InstitutionalContent`, `VisualTheme`, `SiteSEO`, `ChurchSchedule`, `ChurchDonationInfo`, `ChurchLiveStreamInfo`, `Page`, `NavigationMenu`, etc.). Nenhum tipo duplicado ou paralelo foi criado.
  6. **Auditoria Multi-Tenant:** Preservação da convenção canônica `cms:<tenantId>:<resource>` com isolamento total entre congregações.
  7. **Auditoria do Site Público:** Comprovação de que `PublicSiteRenderer` atua como consumidor dos dados do CMS Repository sem qualquer acesso direto a storage, API ou banco.
- **Validação Automatizada:**
  - Criação de suíte automatizada `scripts/verify-architecture-fase54.ts` com 24 asserções formais cobrindo todos os critérios de aceitação.
  - Execução com 100% de aprovação (24/24).
  - Testes de não-regressão das Fases 51, 52 e 53 re-executados com 100% de sucesso.
  - `npx tsc --noEmit` (**lint_applet**): 0 erros.
  - `npm run build` (**compile_applet**): Sucesso.

---

## [Fase 53 — Homologação Funcional Ponta a Ponta do CMS]
- **Data:** 2026-09-09
- **Fase:** Fase 53 — Homologação Funcional Ponta a Ponta do CMS
- **Contexto & Escopo:**
  - Homologação funcional completa de ponta a ponta do CMS, auditando e comprovando a cadeia completa:
    `ADMINISTRADOR -> PAINEL -> ESTADO -> CMS REPOSITORY -> PERSISTÊNCIA LOCAL -> RECARREGAMENTO DA APLICAÇÃO -> LEITURA DOS DADOS -> SITE PÚBLICO / RENDERER -> CONFIRMAÇÃO VISUAL E FUNCIONAL`.
  - Respeito estrito ao **Modo Cirúrgico Absoluto**:
    - Zero novas funcionalidades de negócio ou telas administrativas.
    - Zero novos módulos ou contratos paralelos.
    - Zero adições de backend, REST, APIs, endpoints ou bancos externos (PostgreSQL, MySQL, Supabase, Firebase).
    - Preservação integral das Fases 0 a 52.
- **Auditoria de Integração Executada (10 Testes Obrigatórios):**
  1. **Configurações Institucionais -> Site Público:** Alteração de `profile.name`, `profile.tagline`, `profile.description`, `contact` e `address`. Salvamento via `cmsRepository`, confirmação no `localStorage`, recarregamento desacoplado e comprovação de consumo no Header público, Footer e Blocos Hero/About.
  2. **Aparência & Design Tokens -> Site Público:** Alteração de cores primárias/secundárias e tipografia no `VisualTheme`. Persistência, reload e injeção canônica de variáveis CSS (`--color-theme-primary`, etc.) no renderizador público.
  3. **Páginas do CMS -> Site Público:** Criação de página canônica (`Page`) com seções e blocos, persistência, recarregamento e resolução por ID e Slug para exibição pública com respeito a status e ciclo de vida.
  4. **Seções do Site Público:** Ordenação numérica estrita (`order`), respeito à visibilidade (`isVisible: false`), configurações de layout (`paddingY`, `containerWidth`) e persistência.
  5. **Blocos Públicos & Registry:** Resolução dos 13 tipos canônicos através do `PUBLIC_BLOCK_REGISTRY` (`hero`, `about`, `schedule`, `events`, `sermons`, `live_stream`, `donations`, `contact`, `ministries`, `leadership`, `news`, `prayer_request`, `gallery`). Isolamento de falhas e fallback para blocos desconhecidos via `PublicBlockFallback`.
  6. **Navegação & Menus -> Site Público:** Edição de itens de menu (`NavigationMenu`), persistência, reload e consumo no Header e Footer com respeito a visibilidade e hierarquia.
  7. **SEO Global & de Páginas -> Site Público:** Persistência de `SiteSEO` e `PageSEO`, composição dinâmica de `document.title` no `PublicPageRenderer`.
  8. **Horários & Cultos -> Bloco Público:** Criação, salvamento e recuperação de cultos. Remoção cirúrgica de restrição hardcoded em `PublicScheduleBlock.tsx`, garantindo que qualquer culto ativo seja renderizado independentemente do tenantId atribuído.
  9. **Doações & PIX -> Bloco Público:** Persistência de dados bancários e chave PIX sob o contrato canônico `ChurchDonationInfo`.
  10. **Transmissão ao Vivo -> Bloco Público:** Persistência de URL e status da live sob o contrato `ChurchLiveStreamInfo`, com renderização de badges ("No Ar", "Culto Agendado", "Offline").
- **Testes de Ciclo Global, Multi-Tenant e Resiliência:**
  - **Teste Global de Reload:** Modificação de múltiplos módulos -> persistência -> destruição e recriação da instância do repositório -> conferência integral dos dados persistidos e refletidos no site público.
  - **Isolamento Multi-Tenant:** Validação entre tenants concorrentes (`comunidade_esperanca` vs `igreja_alianca`), demonstrando total ausência de vazamento de dados e preservação de um tenant quando o outro é limpo por prefixo.
  - **Resiliência e Tolerância a Falhas:** Recuperação automática com fallback canônico em cenários de chaves inexistentes, JSON corrompido, incompatibilidade de tipos e valores nulos.
- **Suítes de Testes Executadas:**
  - `verify-e2e-fase53.ts`: 61 de 61 asserções aprovadas com 100% de sucesso.
  - `verify-audit-fase52.ts`: 35 de 35 asserções aprovadas com 100% de sucesso.
  - `verify-persistence.ts`: 16 de 16 asserções aprovadas com 100% de sucesso.
  - Validação de tipos (`tsc --noEmit`): 0 erros.
  - Compilação de Produção (`vite build`): Sucesso.
- **Divergência Encontrada e Corrigida:**
  - `PublicScheduleBlock.tsx`: Removido filtro hardcoded `s.tenantId === 'ib_central'` que impedia cultos de outros tenants de serem renderizados no bloco público de cultos quando isolados via props.

---

## [Fase 52 — Auditoria Integral, Testes de Regressão e Homologação do CMS]
- **Data:** 2026-09-08
- **Fase:** Fase 52 — Auditoria Integral, Testes de Regressão e Homologação do CMS
- **Contexto & Escopo:**
  - Auditoria completa e minuciosa de todo o ecossistema do CMS (Fases 0 a 51) após a introdução da camada central de persistência local da Fase 51.
  - Obediência rigorosa ao **Modo Cirúrgico**: nenhuma nova funcionalidade de negócio, tela, rota ou contrato paralelo foi criado.
  - Zero adições de backend, endpoints, APIs ou bancos de dados externos.
- **Camada de Persistência Auditada:**
  1. `StorageEngine` (`src/core/persistence/storageEngine.ts`):
     - Operações atômicas de leitura (`read`), escrita (`write`), remoção (`remove`), verificação de existência (`exists`) e limpeza seletiva por prefixo (`clearByPrefix`).
     - Proteção completa e não-propagação de exceções para o frontend na ausência de `window`/`localStorage` (SSR/sandbox safe).
     - Tolerância comprovada contra JSON corrompido, strings primitivas em vez de objetos, objetos em vez de arrays e arrays em vez de objetos, com ativação segura de fallback canônico.
  2. `CanonicalStorageKeys` (`src/core/persistence/canonicalStorageKeys.ts`):
     - Validação da convenção canônica estrita: `cms:<tenantId>:<resource>`.
     - Garantia de isolamento por sanitização do `tenantId` (trim e lowercase).
     - Ausência comprovada de colisões ou chaves órfãs manuais.
  3. `CmsCanonicalRepository` (`src/core/persistence/cmsRepository.ts`):
     - Instância única global consumindo exclusivamente os contratos canônicos oficiais sem duplicação de tipos.
     - Precedência de dados persistidos sobre os dados iniciais de fallback.
- **Módulos e Fluxos Auditados:**
  - **Fase 42 (Settings & Institutional):** Carregar -> Alterar -> Salvar -> Recarregar -> Descartar -> Restaurar snapshot.
  - **Fase 43 (Appearance & VisualTheme):** Persistência de tema ativo e tokens visuais com sincronização reativa.
  - **Fase 44 (SEO Global & PageSEO):** Persistência de `SiteSEO` e metadados de páginas.
  - **Fase 45 (Domains):** Adição, listagem e definição de domínio principal persistidos.
  - **Fase 46 (Analytics & Privacy):** Tags de rastreamento e opções de privacidade persistidas.
  - **Fase 47 (Schedules):** Criação, edição, exclusão e ordenação de cultos com ciclo de dirty state validado.
  - **Fase 48 (Donations & PIX):** Configurações de PIX e dados bancários persistidos.
  - **Fase 49 (Live Stream):** Status, URL e embed da transmissão ao vivo persistidos.
  - **Páginas & Editor Visual:** Sincronização e persistência de páginas, seções e blocos.
  - **Navegação & Menus:** Árvores de links e itens de menu sincronizados.
  - **Site Público / Public Site Renderer (Fase 50):** Consumo fiel dos dados persistidos no repositório (header, footer, páginas, blocos temáticos e responsividade desktop, tablet e mobile).
- **Testes de Isolamento Multi-Tenant:**
  - Testes com tenants concorrentes (`congrega_norte` vs `congrega_sul`) confirmaram que alterações e limpezas por prefixo em um tenant não afetam o outro.
- **Suíte de Testes Automatizada Executada:**
  - `verify-audit-fase52.ts`: 35 de 35 asserções aprovadas com 100% de sucesso.
  - `verify-persistence.ts`: 16 de 16 asserções aprovadas com 100% de sucesso.
  - Linter (`tsc --noEmit`): 0 erros.
  - Build de Produção (`vite build`): Sucesso sem advertências.
- **Garantia de Não-Regressão:**
  - Todas as funcionalidades implementadas nas Fases 0 a 51 permanecem 100% operantes, sem quebras, vazamento de dados ou regressões de contrato.

---

## [Fase 51 — Persistência Local Canônica do CMS]
- **Data:** 2026-09-08
- **Fase:** Fase 51 — Persistência Local Canônica do CMS
- **Contexto & Formalização:**
  - Estabelecimento da camada técnica e canônica de persistência local para o estado do CMS, eliminando a volatilidade de estados in-memory demonstrativos sem a necessidade de backend, banco de dados externo ou APIs.
  - O CMS permanece a fonte única de verdade: os contratos canônicos foram rigorosamente preservados sem qualquer duplicação ou criação de modelos paralelos.
  - Proibições estritamente respeitadas:
    - Sem criação de backend, rotas de API, REST, GraphQL ou microsserviços;
    - Sem adição de banco de dados (PostgreSQL, MySQL, Supabase, Firebase, SQLite);
    - Sem autenticação de usuário externa ou cookies de sessão;
    - Sem duplicação de contratos canônicos;
    - Os dados iniciais (`INITIAL_DEMO_*`) foram preservados e agora atuam como fallback seguro quando não houver registro prévio persistido no tenant.
- **Camada Técnica Implementada (`src/core/persistence/`):**
  1. `storageEngine.ts`: Motor técnico puro e resiliente de persistência local (`StorageEngine`). Suporta leitura, escrita, remoção, verificação de existência e limpeza atômica por prefixo. Inclui tratamento de erros para JSON corrompido, ambientes SSR ou sandboxes com restrição de acesso ao `localStorage`, garantindo retorno seguro do fallback canônico sem quebrar a aplicação.
  2. `canonicalStorageKeys.ts`: Convenção centralizada e isolada por tenant para as chaves de persistência, seguindo o padrão canônico `cms:<tenantId>:<resource>`. Suporte ao tenant demonstrativo padrão (`ib_central`).
  3. `cmsRepository.ts`: Classe canônica global `CmsCanonicalRepository` provendo métodos atômicos e tipados para todas as entidades e recursos das fases anteriores:
     - Configurações do Site e Perfil Institucional (`SiteSettings`, `InstitutionalContent` — Fase 42)
     - Aparência, Temas e Seleção Ativa (`VisualTheme`, `tokens` — Fase 43)
     - SEO Global e Metadados das Páginas (`SiteSEO`, `PageSEO` — Fase 44)
     - Gestão de Domínios (`SiteDomain[]` — Fase 45)
     - Analytics e Tags de Rastreamento (`SiteAnalytics` — Fase 46)
     - Grade Semanal de Cultos (`ChurchSchedule[]` — Fase 47)
     - Informações de Doações e PIX (`ChurchDonationInfo` — Fase 48)
     - Transmissão ao Vivo (`ChurchLiveStreamInfo` — Fase 49)
     - Páginas do CMS (`Page[]` — Fases 32 e 50)
     - Menus e Navegação (`NavigationMenu[]` — Fase 31)
  4. `index.ts`: Ponto de entrada técnico exportado via `src/core/index.ts` (`PersistenceDomain` e exports diretos).
- **Integrações Cirúrgicas nos Módulos Administrativos e Público:**
  - `SettingsView.tsx`: Inicializa com dados persistidos do repositório; salva no storage local com dirty state atômico; cancelamento restaura o snapshot persistido.
  - `AppearanceView.tsx`: Inicializa temas e tema ativo do repositório; persiste a seleção de tema e a edição de tokens no storage.
  - `SEOView.tsx`: Persiste `siteSeo` e metadados de páginas sincronizados.
  - `DomainsView.tsx`: Persiste a lista de domínios customizados e subdomínios.
  - `AnalyticsView.tsx`: Persiste as tags de medição e configurações de privacidade.
  - `SchedulesView.tsx`: Persiste a grade completa de cultos e reuniões no salvamento.
  - `DonationsView.tsx`: Persiste as informações bancárias e de PIX.
  - `LiveStreamView.tsx`: Persiste o status, embed e URLs da transmissão ao vivo.
  - `PagesView.tsx`: Inicializa páginas persistidas e sincroniza atômica e reativamente a cada edição, criação, duplicação ou alteração no editor visual de blocos.
  - `NavigationView.tsx`: Inicializa e persiste os menus do site.
  - `PublicSiteRenderer.tsx` & `PublicSiteView.tsx`: Consomem os dados canônicos persistidos no repositório (páginas, temas, horários de cultos, doações, institucional), refletindo imediatamente as alterações salvas no painel e mantendo a integridade mesmo após recarregar o navegador.
- **Suíte de Testes Automatizada:**
  - Criado `scripts/verify-persistence.ts` com 16 asserções cobrindo:
    - Convenção canônica de chaves (`cms:<tenantId>:<resource>`);
    - Isolamento estrito entre diferentes tenants (`ib_central` vs `comunidade_esperanca`);
    - Tolerância ativa a JSON corrompido com fallback seguro;
    - Ciclo Salvar → Recarregar para Settings, Temas, Grade de Cultos, Páginas, Doações e Transmissão.
  - Resultado: 16/16 testes aprovados com sucesso.
- **Status de Homologação:**
  - Linter (`tsc --noEmit`): 0 erros.
  - Build (`compile_applet` / Vite): 0 erros.
  - Regressão: Nenhuma funcionalidade anterior foi afetada.

---

## [Fase 50 — Fundação do Site Público / Renderer]
- **Data:** 2026-09-08
- **Fase:** Fase 50 — Fundação do Site Público / Public Site Renderer
- **Contexto & Formalização:**
  - Esta fase inaugura a fundação do **SITE PÚBLICO / PUBLIC SITE RENDERER**.
  - O renderer é estritamente um consumidor da arquitetura canônica estabelecida nas Fases 0–49:
    `PÁGINAS` → `SEÇÕES` → `BLOCOS` → `CONFIGURAÇÕES` → `DADOS`.
  - Proibições rigorosamente respeitadas:
    - Sem criação de arquitetura paralela;
    - Sem criação de novo CMS ou editor visual no lado público;
    - Sem duplicar os contratos canônicos;
    - Sem transformar páginas em HTML livre ou strings arbitrárias;
    - Sem alterar banco de dados, APIs, infraestrutura ou autenticação;
    - Sem dependência do renderer público para com ferramentas ou componentes administrativos (Sidebar, AdminShell, modais de edição).
- **Contratos Canônicos Consumidos:**
  - `Page`: id, tenantId, title, slug, status ('published' | 'draft' | 'archived'), order, isHome, seo (metaTitle, metaDescription), sections.
  - `SectionInstance`: id, title, order, isVisible, backgroundColor, config (paddingY, containerWidth, themeVariant), blocks.
  - `BlockInstance`: id, type (BlockType), order, isVisible, config (alignment, paddingY, containerWidth, themeVariant), data.
  - `VisualTheme` & `DesignTokens`: colors (primary, secondary, accent, background, surface, text, muted, border), typography, spacing, borders, elevations.
  - `NavigationMenu` & `NavigationItem`: id, label, order, isVisible, target, children, url, isExternal, openInNewTab.
  - `InstitutionalContent`: ChurchProfile (name, tagline, slogan, leadPastor, logoUrl), ChurchAddress, ChurchContact, ChurchSocialLinks.
  - Módulos canônicos associados: `ChurchSchedule` (Fase 47), `ChurchDonationInfo` (Fase 48), `ChurchLiveStreamInfo` (Fase 49).
- **Componentes Arquiteturais Criados (`src/components/public-site/`):**
  1. `PublicSiteRenderer.tsx`: Componente orquestrador raiz público. Aplica as variáveis CSS baseadas nos `DesignTokens` do `VisualTheme` ativo, renderiza o cabeçalho público, resolve a página ativa e renderiza o rodapé.
  2. `PublicPageRenderer.tsx`: Interpretador canônico de `Page`. Valida status de publicação, sincroniza o título do documento (SEO canônico) e renderiza as seções ordenadas e visíveis.
  3. `PublicSectionRenderer.tsx`: Interpretador canônico de `SectionInstance`. Aplica padding vertical, largura de container, variante temática e background da seção, renderizando a coleção ordenada de blocos.
  4. `PublicBlockRenderer.tsx`: Resolutor canônico de `BlockInstance`. Consulta o registry técnico de blocos com tratamento seguro de erros e dados corrompidos.
  5. `PublicBlockRegistry.tsx`: Registro técnico que mapeia o enum canônico `BlockType` para o componente correspondente sem criar contratos paralelos.
  6. `PublicBlockFallback.tsx`: Fallback seguro e neutro para blocos desconhecidos ou dados estruturais inválidos, impedindo a quebra da página.
  7. `PublicSiteHeader.tsx`: Cabeçalho institucional público consumindo `NavigationMenu` e `ChurchProfile`, com suporte a links internos, dropdowns, links externos e menu responsivo mobile.
  8. `PublicSiteFooter.tsx`: Rodapé institucional público consumindo perfil da igreja, endereço formatado, telefones, redes sociais e links rápidos.
  9. `PublicSiteView.tsx`: Wrapper de visualização e demonstração com alternador responsivo de viewport (Desktop 100%, Tablet 768px, Mobile 375px), seletor de páginas canônicas e navegação de retorno ao painel administrativo.
  10. Catálogo de Renderizadores de Blocos Canônicos (`src/components/public-site/blocks/`):
      - `PublicHeroBlock.tsx` (Hero banner com título, subtítulo, botões e imagem de fundo)
      - `PublicAboutBlock.tsx` (História, visão pastoral, pilares de comunhão, doutrina e missão)
      - `PublicScheduleBlock.tsx` (Programação semanal de cultos da congregação - Fase 47)
      - `PublicEventsBlock.tsx` (Próximos eventos e conferências)
      - `PublicSermonsBlock.tsx` (Acervo e destaques de mensagens em vídeo)
      - `PublicLiveStreamBlock.tsx` (Status e card declarativo de transmissão ao vivo - Fase 49)
      - `PublicDonationsBlock.tsx` (Dízimos e ofertas com chave PIX e dados bancários - Fase 48)
      - `PublicContactBlock.tsx` (Endereço, contatos pastorais e localização)
      - `PublicMinistriesBlock.tsx` (Grade de ministérios e grupos de conexão)
      - `PublicLeadershipBlock.tsx` (Corpo pastoral e liderança)
      - `PublicNewsBlock.tsx` (Notícias e cartas pastorais)
      - `PublicPrayerBlock.tsx` (Formulário declarativo de pedido de oração)
      - `PublicGalleryBlock.tsx` (Galeria de registros fotográficos da vida comunitária)
- **Integração no Roteamento:**
  - `src/App.tsx`: Suporte bidirecional para alternar entre o `AdminShell` e o `PublicSiteView` (via botão "Visitar site" no cabeçalho ou hash `#site` / `#public`).
  - `src/components/layout/Header.tsx`: Propagação da ação `onVisitSite` para o botão `btn-visit-site`.
  - `src/components/layout/AdminShell.tsx`: Repasse de `onVisitSite` e link direto no rodapé administrativo.
- **Status de Homologação:**
  - Compilação estática (`tsc --noEmit`): Sucesso (0 erros).
  - Verificação de empacotamento (`compile_applet`): Sucesso (0 erros).
  - Regressão: Nenhuma funcionalidade das Fases 0–49 foi afetada.

---

## [Fase 49 — Gestão Visual de Transmissão ao Vivo / Live Stream]
- **Data:** 2026-09-08
- **Fase:** Fase 49 — Gestão Visual de Transmissão ao Vivo (Sequência Atual Formalizada)
- **Contexto & Formalização:**
  - Esta Fase 49 é uma **fase formalmente definida para a sequência atual do projeto**, subsequente à Fase 48 (Gestão Visual de Doações e PIX).
  - Utiliza com rigor cirúrgico o contrato canônico consolidado na **Fase 12**: `ChurchLiveStreamInfo` e o enum auxiliar `LiveStreamStatus` ('live' | 'scheduled' | 'offline').
- **Objetivo:**
  - Prover uma interface administrativa visual e declarativa para gerenciamento das informações de transmissão ao vivo de cultos e celebrações (`ChurchLiveStreamInfo`).
  - Proibição estrita respeitada: sem ingestão de vídeo, sem encoder, sem RTMP, sem WebRTC, sem HLS real, sem scraping, sem chamadas externas a APIs de terceiros (YouTube, Twitch, Facebook) e sem chat ao vivo. Trata-se de gestão visual e declarativa de metadados, links e agendamento.
- **Campos Efetivamente Utilizados do Contrato Canônico (`ChurchLiveStreamInfo`):**
  - `id`: identificador único do registro (`livestream_central` - somente leitura no formulário).
  - `tenantId`: identificador do tenant proprietário (`ib_central` - isolamento multi-tenant rigorosamente mantido).
  - `title`: título descritivo do culto ou evento transmitido (obrigatório, editável).
  - `description`: descrição ou mensagem pastoral orientativa (opcional, editável).
  - `streamUrl`: endereço oficial público da transmissão (opcional, editável com validação visual de formato e cópia rápida).
  - `status`: estado declarativo da transmissão (`LiveStreamStatus` = `'live' | 'scheduled' | 'offline'`).
  - `scheduledAt`: data e horário ISO programados para o início da transmissão (editável via campo datetime-local).
  - `updatedAt`: data/hora ISO da última modificação cadastral.
- **Funcionalidades Implementadas:**
  - **Interface Administrativa de Transmissão ao Vivo (`LiveStreamView`):**
    - Acessível no menu lateral do `AdminShell` em `currentSection === 'livestream'`, sob a categoria IGREJA (ícone `Radio`).
    - Cabeçalho padronizado com badge da Fase 49, identificador de tenant (`ib_central`), status visual e botões de ação com controle de estado sujo (*dirty state*).
  - **Painel de Métricas Derivadas dos Dados Reais:**
    - 4 cards informativos calculados estritamente dos dados do contrato:
      1. Status da Transmissão (Ao Vivo no Ar vs Agendada vs Offline / Inativa)
      2. Endereço do Stream (Configurado com validação de formato vs Não Informado)
      3. Próxima Programação (Data e hora agendada formatada vs Sem Agendamento)
      4. Detalhes Pastorais (Título e descrição pastoral presentes)
    - Proibição respeitada: sem métricas inventadas de espectadores simultâneos, visualizações falsas ou telemetria fictícia.
  - **Seções Estruturadas com `SettingsSectionCard`:**
    - Seção 1: Status da Transmissão (seleção amigável entre 'live', 'scheduled' e 'offline' com prévias visuais).
    - Seção 2: Informações Editoriais (título obrigatório e descrição pastoral).
    - Seção 3: Endereço do Stream (URL com validação de protocolo, botão de cópia com feedback).
    - Seção 4: Agendamento da Próxima Transmissão (seletor datetime-local integrado a ISO string).
    - Seção 5: Segurança & Fronteira Arquitetural (garantia de zero ingestão de vídeo, sem servidor de mídia e isolamento multi-tenant).
  - **Simulação Visual do Player no Site Público (`LiveStreamPreview`):**
    - Renderização proporcional 16:9 estilizada simulando o visual no site da congregação.
    - Badges específicos e dinâmicos para transmissão 'Ao Vivo' (com animação pulsante), 'Agendado' (com exibição da data/hora) e 'Offline'.
    - Botão de cópia da URL do stream com feedback instantâneo.
  - **Persistência em Memória e Controle de Alterações:**
    - Gerenciamento de estado via snapshot (`savedLiveStream`).
    - Banner de alterações não salvas com suporte a descarte e salvamento.
    - Notificações toast temporárias locais.
- **Arquivos Criados:**
  - `src/components/live-stream/demoLiveStreamData.ts`
  - `src/components/live-stream/LiveStreamPreview.tsx`
  - `src/components/live-stream/LiveStreamView.tsx`
- **Arquivos Modificados:**
  - `src/components/layout/Sidebar.tsx` (Adição do item 'livestream' na categoria IGREJA e tipo `NavigationKey`)
  - `src/components/common/PlaceholderView.tsx` (Adição de metadados para 'livestream')
  - `src/components/layout/AdminShell.tsx` (Roteamento de 'livestream' para `LiveStreamView` e atualização do rodapé para Fase 49)
  - `CHANGELOG.md` (Documentação formal da Fase 49)
- **Status de Homologação:**
  - Compilação estática (`tsc --noEmit`): Sucesso (0 erros).
  - Build do projeto (`npm run build`): Sucesso.
  - Ausência de regressão: Todas as fases de 0 a 48 preservadas e operacionais.

---

## [Fase 48 — Gestão Visual de Doações e PIX]
- **Data:** 2026-09-08
- **Fase:** Fase 48 — Gestão Visual de Doações e PIX (Sequência Atual Formalizada)
- **Contexto & Formalização:**
  - Esta Fase 48 é uma **fase formalmente definida para a sequência atual do projeto**, subsequente à Fase 47 (Gestão Visual de Horários e Cultos).
  - O roadmap histórico original da Fase 42 em diante não foi recuperado; esta fase pertence à sequência formal atual do projeto, governada estritamente pelos contratos canônicos consolidados.
  - Utiliza com precisão cirúrgica o contrato canônico consolidado da **Fase 12**: `ChurchDonationInfo` e o tipo auxiliar `DonationStatus` ('active' | 'inactive').
- **Objetivo:**
  - Transformar a gestão visual das informações declarativas de dízimos, ofertas, chave PIX e contas bancárias da igreja (`ChurchDonationInfo`) em uma interface visual administrativa funcional, reativa, responsiva e segura dentro do CMS.
  - Não constitui sistema de pagamento, gateway ou liquidação financeira: trata-se de configuração e publicação de dados declarativos e orientações para a comunidade.
- **Campos Efetivamente Utilizados do Contrato Canônico (`ChurchDonationInfo`):**
  - `id`: identificador único do registro (`donation_central` - gerado/somente leitura).
  - `tenantId`: identificador do tenant proprietário (`ib_central` - isolamento multi-tenant preservado; somente leitura).
  - `title`: título descritivo do bloco / seção (editável com validação obrigatória).
  - `description`: mensagem pastoral de acolhimento e contextualização bíblica da contribuição (editável).
  - `bankAccountInfo`: informações das contas bancárias institucionais para transferência / TED / depósito (editável).
  - `pixKey`: chave PIX oficial da congregação (editável com botão de cópia rápida e detecção orientativa de formato).
  - `instructions`: orientações adicionais aos membros para envio de comprovantes à secretaria ou destinação específica de ofertas (editável).
  - `status`: status canônico de visibilidade no site público (`DonationStatus` = `'active' | 'inactive'` - editável via switch).
  - `updatedAt`: data/hora ISO da última modificação cadastral (gerenciado).
- **Funcionalidades Implementadas:**
  - **Interface Administrativa de Doações e PIX (`DonationsView`):**
    - Acessível no menu lateral do `AdminShell` em `currentSection === 'donations'`, sob a categoria IGREJA.
    - Cabeçalho padronizado com badge da Fase 48, tenant de referência (`ib_central`), status visual e botões de ação para descarte de alterações ou salvamento com indicador visual de estado sujo (*dirty state*).
  - **Painel de Métricas Derivadas dos Dados Reais:**
    - 4 cards analíticos calculados estritamente a partir dos dados do contrato:
      1. Status de Exibição (Ativo & Visível vs Inativo / Oculto)
      2. Chave PIX (Configurada com detecção amigável de tipo vs Não Informada)
      3. Dados Bancários (Configurado vs Não Informado)
      4. Orientações de Envio (Cadastradas vs Opcional)
    - Proibição estrita respeitada: sem métricas financeiras fictícias, sem gráficos falsos de arrecadação, sem extratos inventados.
  - **Módulo PIX Oficial:**
    - Campo textual para chave PIX (`pixKey`).
    - Botão de cópia rápida com feedback visual e notificação toast.
    - Indicador orientativo do tipo de chave (CNPJ, E-mail, Telefone, Chave Aleatória) sem alterar o contrato de dados.
    - Orientações institucionais de segurança e recomendação de uso do CNPJ da igreja.
  - **Seções Configuradoras estruturadas com `SettingsSectionCard`:**
    - Status de publicação e ativação global (`status`).
    - Título e mensagem pastoral (`title`, `description`).
    - Contas bancárias e transferências (`bankAccountInfo`).
    - Instruções adicionais para secretaria (`instructions`).
    - Painel de Segurança e Fronteira Arquitetural (isolamento multi-tenant e confirmação de zero custódia de valores).
  - **Pré-Visualização do Site Público em Tempo Real (`DonationPublicPreview`):**
    - Aba com renderização fiel de como as informações de dízimos, ofertas, PIX e contas bancárias aparecem aos visitantes no portal público.
    - Alerta explicativo quando o status estiver inativo.
    - Botão de cópia da chave PIX funcional na pré-visualização.
  - **Persistência em Memória e Controle de Alterações:**
    - Gestão de estado em memória React com snapshot de comparação (`savedDonation`).
    - Banner de alterações pendentes (*dirty state*) com opções de descarte ou consolidação.
    - Notificações toast temporárias sem dependências externas.
- **Arquivos Criados:**
  - `src/components/donations/demoDonationData.ts`
  - `src/components/donations/DonationPublicPreview.tsx`
  - `src/components/donations/DonationsView.tsx`
- **Arquivos Modificados:**
  - `src/components/layout/Sidebar.tsx` (inclusão de `donations` em `NavigationKey` e item `Doações & PIX` no grupo IGREJA sem reorganização)
  - `src/components/common/PlaceholderView.tsx` (inclusão dos metadados de `donations` no `Record<NavigationKey, SectionInfo>`)
  - `src/components/layout/AdminShell.tsx` (roteamento para `DonationsView` e atualização do rodapé para a Fase 48)
  - `CHANGELOG.md` (registro formal da entrega da Fase 48)
- **Verificação de Regressão & Validação de Qualidade:**
  - `lint_applet` executado com sucesso (zero erros).
  - `compile_applet` executado com sucesso (zero erros).
  - Nenhuma tela, rota ou contrato prévio das Fases 0–47 quebrado ou alterado fora do escopo.

---
- **Data:** 2026-09-08
- **Fase:** Fase 47 — Gestão Visual de Horários e Cultos (Sequência Atual Formalizada)
- **Contexto & Formalização:**
  - Esta Fase 47 é uma **fase formalmente definida para a sequência atual do projeto**, subsequente à Fase 46 (Gestão Visual de Analytics e Tags).
  - O roadmap histórico original da Fase 42 em diante não foi recuperado; esta fase pertence à sequência formal atual do projeto, governada estritamente pelos contratos canônicos consolidados.
  - Utiliza com precisão cirúrgica o contrato canônico consolidado da **Fase 12**: `ChurchSchedule` e o tipo auxiliar `ScheduleStatus` ('active' | 'inactive').
- **Objetivo:**
  - Transformar o gerenciamento da grade de programação regular e cultos da igreja (`ChurchSchedule`) em uma interface visual administrativa funcional, reativa, responsiva e profissional.
- **Campos Efetivamente Utilizados do Contrato Canônico (`ChurchSchedule`):**
  - `id`: identificador único do registro (gerado/somente leitura).
  - `tenantId`: identificador do tenant proprietário (`ib_central` - isolamento multi-tenant preservado; somente leitura).
  - `title`: nome ou título do culto / reunião (editável com validação obrigatória).
  - `dayOfWeek`: dia da semana do culto (editável via seletor canônico de dias da semana em português ou texto personalizado).
  - `time`: horário do culto em formato `HH:mm` (editável com validação obrigatória).
  - `description`: descrição informativa com detalhes, público-alvo ou faixas etárias atendidas (editável).
  - `location`: localização física ou espaço na congregação (editável, ex: Templo Principal, Salão Social).
  - `status`: status canônico de exibição (`ScheduleStatus` = `'active' | 'inactive'` - editável via toggle e modal).
  - `createdAt`: data/hora ISO de criação (gerenciado).
  - `updatedAt`: data/hora ISO da última atualização (gerenciado).
- **Funcionalidades Implementadas:**
  - **Interface Administrativa de Cultos & Horários (`SchedulesView`):**
    - Acessível no menu lateral do `AdminShell` em `currentSection === 'schedule'`, sob a categoria IGREJA.
    - Cabeçalho padronizado com badge da Fase 47, tenant de referência (`ib_central`) e botões de ação para descarte de alterações ou consolidação com indicador visual de estado sujo (dirty state).
  - **Resumo Visual / Painel Estatístico (Métricas Derivadas dos Dados Reais):**
    - 4 cards analíticos calculados exclusivamente a partir dos registros em memória:
      1. Total de Horários Cadastrados
      2. Horários Ativos / Em Exibição
      3. Cultos Dominicais
      4. Dias da Semana Atendidos com Programação
    - Proibição estrita respeitada: sem dados fictícios de presença, sem número de membros inventado, sem contadores simulados de visitantes.
  - **Barra de Ferramentas & Filtros (`SchedulesToolbar`):**
    - Busca em tempo real por título, dia da semana, horário, local ou descrição.
    - Filtro por status (Todos, Ativos, Inativos).
    - Filtro por dia da semana (Todos os dias, Domingo a Sábado).
    - Ordenação pura baseada em campos existentes:
      - Dia da semana cronológico (Domingo a Sábado)
      - Horário do culto (`time`)
      - Nome do culto em ordem alfabética (`title`)
      - Status (`active` primeiro)
    - Sem criação de campo `order` paralelo no contrato `ChurchSchedule`.
    - Alternância rápida entre visualização em Cards (`ScheduleCard`) e Tabela (`ScheduleTable`).
    - Botão primário "+ Novo Horário".
  - **Card de Horário (`ScheduleCard`) & Tabela Compacta (`ScheduleTable`):**
    - Exibição destacada do dia da semana, badge de horário em destaque com ícone `Clock`, nome do culto, local com ícone `MapPin`, descrição e badge de status.
    - Botão de ativação/pausa rápida sem necessidade de abrir o modal.
    - Botões de edição e exclusão.
  - **Modal de Criação / Edição (`ScheduleEditorModal`):**
    - Validação de campos obrigatórios (`title` e `time`).
    - Seleção de dia da semana canônico com suporte a dia personalizado.
    - Seleção de status de exibição (`active` vs `inactive`).
    - Contexto de tenant multi-tenant (`ib_central`) somente leitura.
  - **Modal de Confirmação de Exclusão (`DeleteScheduleConfirmModal`):**
    - Confirmação visual clara com apresentação dos dados do culto antes da remoção definitiva do estado.
  - **Persistência em Memória e Controle de Alterações:**
    - Estado gerenciado em memória React com snapshot de comparação (`savedSnapshot`).
    - Banner de alterações pendentes com opções de descartar e salvar agora.
    - Notificações toast temporárias sem dependências externas.
- **Arquivos Criados:**
  - `src/components/schedules/demoSchedulesData.ts`
  - `src/components/schedules/schedulesUtils.ts`
  - `src/components/schedules/ScheduleStatusBadge.tsx`
  - `src/components/schedules/ScheduleCard.tsx`
  - `src/components/schedules/ScheduleEditorModal.tsx`
  - `src/components/schedules/DeleteScheduleConfirmModal.tsx`
  - `src/components/schedules/SchedulesToolbar.tsx`
  - `src/components/schedules/ScheduleTable.tsx`
  - `src/components/schedules/SchedulesView.tsx`
- **Arquivos Modificados:**
  - `src/components/layout/Sidebar.tsx` (inclusão de `schedule` em `NavigationKey` e item na categoria IGREJA sem reorganização)
  - `src/components/common/PlaceholderView.tsx` (inclusão dos metadados de `schedule` no `Record<NavigationKey, SectionInfo>`)
  - `src/components/layout/AdminShell.tsx` (roteamento para `SchedulesView` e atualização do rodapé para a Fase 47)
  - `CHANGELOG.md` (registro desta Fase 47)
- **Verificação de Regressão & Validação de Qualidade:**
  - `lint_applet` executado com sucesso (zero erros).
  - `compile_applet` executado com sucesso (zero erros).
  - Nenhuma tela, rota ou contrato prévio das Fases 0–46 quebrado ou alterado fora do escopo.

---
- **Data:** 2026-09-08
- **Fase:** Fase 46 — Gestão Visual de Analytics e Tags (Sequência Atual Formalizada)
- **Contexto & Formalização:**
  - Esta Fase 46 é uma **fase formalmente definida para a sequência atual do projeto**, subsequente à Fase 45 (Gestão Visual de Domínios e Endereços).
  - O roadmap histórico original da Fase 42 em diante não foi recuperado; esta fase pertence à sequência formal atual do projeto, governada estritamente pelos contratos canônicos consolidados.
  - Utiliza com precisão cirúrgica os contratos canônicos consolidados da **Fase 23**: `SiteAnalytics` e `SiteAnalyticsProvider` ('google_analytics' | 'google_tag_manager' | 'meta_pixel').
- **Objetivo:**
  - Transformar a rota administrativa `analytics` (que anteriormente utilizava `PlaceholderView`) em uma interface visual administrativa funcional, reativa, responsiva e profissional para a gestão declarativa de identificadores de medição, tags de terceiros e preferências de privacidade da igreja.
- **Campos Efetivamente Utilizados do Contrato Canônico (`SiteAnalytics`):**
  - `tenantId`: identificador do tenant proprietário (`ib_central` - isolamento multi-tenant preservado; somente leitura).
  - `googleAnalyticsId`: ID de medição do Google Analytics 4 (`G-XXXXXXXXXX` - editável).
  - `googleTagManagerId`: ID do contêiner do Google Tag Manager (`GTM-XXXXXXX` - editável).
  - `metaPixelId`: ID numérico do Meta / Facebook Pixel (15-16 dígitos - editável).
  - `searchConsoleVerificationToken`: token declarativo de meta tag para o Google Search Console (editável).
  - `anonymizeIp`: flag booleana de anonimização de endereço IP dos visitantes (editável).
  - `consentRequired`: flag booleana de exigência declarativa de consentimento prévio para telemetria / LGPD (editável).
  - `isActive`: chave mestra global que ativa ou suspende os identificadores de medição do portal (editável).
  - `updatedAt`: data/hora ISO da última modificação cadastral (gerenciado).
- **Funcionalidades Implementadas:**
  - **Interface Administrativa de Analytics e Tags (`AnalyticsView`):**
    - Acessível no menu lateral do `AdminShell` em `currentSection === 'analytics'`, sob a categoria SITE / ANALYTICS.
    - Cabeçalho padronizado com badge da Fase 46, descrição funcional e botões de ação (Descartar e Salvar Configurações).
  - **Painel de Status da Configuração (Métricas Derivadas dos Dados Reais):**
    - Exibe o estado da Chave Mestra (Ativo & Operante vs Desativado), a contagem de tags configuradas (ex: 4 de 4 tags ativas) e o resumo de privacidade (IP Anonimizado e Consentimento Exigido).
    - Proibição estrita respeitada: sem métricas fictícias de tráfego, sem gráficos falsos de visitantes ou pageviews.
  - **Chave Mestra Global (`SiteAnalytics.isActive`):**
    - Switch global com indicador visual ativo/inativo e banner explicativo quando desativado.
  - **Identificadores de Medição & Tags de Terceiros:**
    - Cards individuais para Google Analytics 4, Google Tag Manager, Meta Pixel e Google Search Console.
    - Indicador de status (Configurado vs Não configurado), inputs com validação de formato orientativa e botão de cópia rápida com feedback visual.
  - **Preferências de Privacidade e Conformidade (LGPD):**
    - Toggles para anonimização de IP (`anonymizeIp`) e exigência de consentimento prévio do visitante (`consentRequired`).
  - **Painel de Segurança e Fronteira Arquitetural:**
    - Callout informativo esclarecendo a ausência de scripts executáveis arbitrários (`<script>`) para proteção anti-XSS e conformidade multi-tenant.
  - **Controle de Estado, Persistência e Feedback:**
    - Gerenciamento in-memory com detecção de alterações pendentes (*dirty state*) e banner de alerta interativo.
    - Ação de descarte que restaura o snapshot salvo.
    - Notificações toast para todas as operações (salvar, descartar e cópia de identificadores).
- **Fronteiras e Restrições Arquiteturais Respeitadas:**
  - **Nenhum tracking real:** Sem disparo de eventos, sem chamadas HTTP para o Google/Meta, sem cookies de rastreamento, sem fingerprinting.
  - **Nenhum script arbitrário executado:** Sem injeção de `<script>`, sem `dangerouslySetInnerHTML`, sem runtime JavaScript.
  - **Nenhum banco ou API backend:** Gerenciamento de estado in-memory estritamente alinhado aos padrões das Fases 42–45.
  - **Preservação Integral das Fases 0 a 45:** Nenhuma tela, componente ou rota anterior sofreu regressão.
  - **Fase 47 Protegida:** Nenhuma funcionalidade de horários/cultos foi antecipada ou implementada.
- **Arquivos Criados:**
  - `src/components/analytics/demoAnalyticsData.ts`
  - `src/components/analytics/AnalyticsView.tsx`
- **Arquivos Modificados:**
  - `src/components/layout/AdminShell.tsx`
  - `CHANGELOG.md`
- **Validação e Testes:**
  - `tsc --noEmit` via `lint_applet`: 0 erros.
  - `npm run build` via `compile_applet`: Compilação executada com 100% de sucesso.

---

## [Fase 45 — Gestão Visual de Domínios e Endereços]
- **Data:** 2026-09-08
- **Fase:** Fase 45 — Gestão Visual de Domínios e Endereços (Sequência Atual Formalizada)
- **Contexto & Formalização:**
  - Esta Fase 45 é uma **fase formalmente definida para a sequência atual do projeto**, subsequente à Fase 44 (Gestão Visual de SEO e Metadados).
  - O roadmap histórico original da Fase 42 em diante não foi recuperado; esta fase pertence à sequência formal atual do projeto, governada estritamente pelos contratos canônicos consolidados.
  - Utiliza com rigor absoluto os contratos canônicos consolidados da **Fase 18**: `SiteDomain`, `SiteDomainType` ('subdomain' | 'custom_domain') e `SiteDomainStatus` ('pending' | 'active' | 'inactive').
- **Objetivo:**
  - Transformar a rota administrativa `domains` (que anteriormente utilizava `PlaceholderView`) em uma interface visual administrativa funcional, responsiva, profissional e orientada ao usuário para a gestão de domínios, subdomínios e endereços do portal da igreja.
- **Campos Efetivamente Utilizados do Contrato Canônico (`SiteDomain`):**
  - `id`: identificador único do registro (somente leitura / gerado pelo sistema).
  - `tenantId`: identificador da congregação proprietária (`ib_central` - isolamento multi-tenant mantido).
  - `hostname`: endereço do domínio ou subdomínio (editável com sanitização e validação de formato).
  - `type`: classificação do endereço (`custom_domain` ou `subdomain` - editável).
  - `status`: situação cadastral declarativa (`active`, `pending` ou `inactive` - editável).
  - `isPrimary`: flag que define se é o endereço canônico principal de acesso da igreja (editável com exclusividade mútua).
  - `createdAt`: data/hora ISO de vinculação do domínio (somente leitura).
  - `updatedAt`: data/hora ISO da última modificação cadastral.
- **Funcionalidades Implementadas:**
  - **Interface Administrativa de Domínios (`DomainsView`):**
    - Acessível no menu lateral do `AdminShell` em `currentSection === 'domains'`, sob a categoria SITE / DOMÍNIOS.
    - Cabeçalho padronizado com badge da Fase 45, descrição funcional e botões de ação (Descartar, Salvar Alterações e + Conectar Domínio).
  - **Card de Destaque: Domínio Principal da Igreja:**
    - Exibe com destaque o endereço primário ativo (`isPrimary: true`), badge de situação operacional (`active`, `pending` ou `inactive`), tipo de domínio e ação de cópia com um clique da URL canônica completa (`https://...`).
  - **Tabela de Gerenciamento de Domínios Conectados:**
    - Filtro por abas (Todos, Domínios Próprios e Subdomínios).
    - Exibição de hostname, ID/Tenant, badges de tipo (`custom_domain` vs `subdomain`), seletores de situação rápida (`active`, `pending`, `inactive`) e data de cadastro.
    - Ações por linha: definir como principal (1 clique com exclusividade), copiar endereço, editar e desconectar (com bloqueio preventivo para não remover o último domínio).
  - **Modal de Conexão e Edição de Domínio (`DomainEditorModal`):**
    - Formulário com sanitização automática (remoção de `https://`, barras e espaços), validação de formato de hostname, seleção de tipo, seleção de status e flag de domínio primário.
    - Prevenção contra duplicidade de hostnames cadastrados.
  - **Modal de Confirmação de Exclusão (`DomainDeleteModal`):**
    - Confirmação com aviso contextual caso o domínio a ser desconectado seja o endereço primário.
  - **Guia Técnico Informativo de DNS (Estritamente Declarativo):**
    - Tabela conceitual de registros DNS recomendados (CNAME para `www` e A para `@`), orientando a configuração no registrador da congregação.
    - Alerta transparente de que o CMS não executa chamadas de infraestrutura nem acessa dados sensíveis externos de DNS.
  - **Controle de Estado, Persistência e Feedback:**
    - Gerenciamento in-memory com detecção de alterações pendentes (*dirty state*) e banner de alerta.
    - Ação de descarte que restaura o snapshot salvo.
    - Notificações toast para todas as operações (salvar, descartar, definir principal, conectar, atualizar e remover).
- **Fronteiras e Restrições Arquiteturais Respeitadas:**
  - **Nenhum DNS real executado:** Sem criação de registros em provedores, sem CNAME lookups, sem chamadas WHOIS ou APIs de registradores.
  - **Nenhum deploy/servidor/SSL:** Sem provisionamento de VPS, sem Nginx/Apache, sem Let's Encrypt runtime.
  - **Nenhum banco ou API backend:** Gerenciamento de estado in-memory estritamente alinhado aos padrões das Fases 42–44.
  - **Preservação Integral das Fases 0 a 44:** Nenhuma tela, componente ou rota anterior sofreu regressão.
  - **Fase 46 Protegida:** A rota `analytics` permanece intacta utilizando `PlaceholderView`.
- **Arquivos Criados:**
  - `src/components/domains/demoDomainsData.ts`
  - `src/components/domains/DomainEditorModal.tsx`
  - `src/components/domains/DomainDeleteModal.tsx`
  - `src/components/domains/DomainsView.tsx`
- **Arquivos Modificados:**
  - `src/components/layout/AdminShell.tsx`
  - `CHANGELOG.md`
- **Validação e Testes:**
  - `tsc --noEmit` via `lint_applet`: 0 erros.
  - `npm run build` via `compile_applet`: Compilação executada com 100% de sucesso.

---

## [Fase 44 — Gestão Visual de SEO e Metadados]
- **Data:** 2026-09-08
- **Fase:** Fase 44 — Gestão Visual de SEO e Metadados (Sequência Atual Formalizada)
- **Contexto & Formalização:**
  - Esta Fase 44 é uma **fase formalmente definida para a sequência atual do projeto**, subsequente à Fase 43 (Aparência e Temas), mantendo a regra de que o roadmap histórico original não estava disponível e que contratos canônicos consolidados governam a implementação.
  - Utiliza com precisão cirúrgica os contratos canônicos consolidados da **Fase 16**: `SiteSEO`, `PageSEO`, `RobotsDirective`, `OpenGraphMetadata` e `TwitterCardMetadata`.
- **Objetivo:**
  - Transformar a rota administrativa `seo` (que renderizava `PlaceholderView`) em uma interface visual administrativa funcional, interativa, responsiva e profissional para a gestão declarativa de SEO do site e das páginas do CMS.
- **Funcionalidades Implementadas:**
  - **Interface Administrativa de SEO (`SEOView`):**
    - Acessível no menu lateral do `AdminShell` em `currentSection === 'seo'`, sob a categoria SITE / SEO.
    - Cabeçalho padronizado com identificador de fase, descrição e ações de topo (Descartar alterações e Salvar SEO).
  - **Aba 1: SEO Global do Site (`SiteSEO`):**
    - **Metadados Principais de Busca:** Edição declarativa de `title`, `description`, `siteName`, `canonicalBaseUrl`, `locale` e lista dinâmica de `keywords` (com inclusão e remoção visual por tags).
    - **Diretivas de Robôs (`RobotsDirective`):** Configuração estruturada de `index`, `follow` e `archive`.
    - **Compartilhamento Social & Open Graph (`OpenGraphMetadata`):** Configuração de `title`, `description`, `type` e seleção da imagem padrão com integração ao `MediaPickerModal` existente (`defaultImageUrl` e `defaultImageMediaId`).
    - **Cartões do Twitter / X (`TwitterCardMetadata`):** Configuração declarativa de `card` (`summary_large_image` ou `summary`), `title` e `description`.
  - **Aba 2: SEO das Páginas (`PageSEO`):**
    - Listagem de todas as páginas cadastradas no CMS com identificadores visuais de status, rota/slug e indicação de SEO customizado vs. padrão.
    - Seleção interativa da página para ajuste fino de metadados.
    - Edição de `metaTitle`, `metaDescription`, `canonicalUrl`, flag `noIndex`, `keywords` por tag e imagem social específica da página (`ogImage` / `imageMediaId`) integrada ao `MediaPickerModal`.
    - Configuração de diretivas específicas de robôs por página (`robots.index`, `robots.follow`, `robots.archive`).
  - **Simulador Visual de Indexação e Compartilhamento (`SEOPreview`):**
    - **Simulação Google SERP:** Renderiza a prévia fiel do snippet de busca com favicon, domínio, título clicável e descrição com contadores recomendados de caracteres (~65 para título e ~160 para descrição).
    - **Simulação de Card Social (Open Graph):** Renderiza o card de compartilhamento com imagem em proporção panorâmica, domínio em caixa alta, título e snippet.
    - Suporte a alternância de escopo em tempo real (SiteSEO Global ou PageSEO da página ativa).
    - Alerta visual quando a diretiva `noindex` estiver ativa.
  - **Controle de Estado, Segurança de Dados e Feedback:**
    - Detecção automática de modificações pendentes com banner dinâmico (`seo-unsaved-banner`).
    - Botão de descarte e restauração instantânea do estado original.
    - Notificação toast de feedback após salvar com sucesso (`seo-feedback-toast`).
    - Integração sem atrito com `MediaPickerModal` para seleção de ativos da biblioteca existente.
- **Arquitetura & Segurança:**
  - Respeito integral à fronteira declarativa da Fase 16: sem injeção de HTML/scripts externos, sem crawlers, sem geradores de sitemap runtime, sem novos contratos paralelos.
  - Dados gerenciados no padrão em memória com isolamento total em `src/components/seo/`.
  - Nenhuma persistência externa, backend novo ou banco de dados foi criado.
  - Nenhuma funcionalidade das Fases 1 a 43 foi quebrada ou modificada fora do estritamente necessário.
  - Fases 45 e 46 (Domínios e Analytics) permanecem intocadas e roteadas para `PlaceholderView`.
- **Arquivos Criados:**
  - `src/components/seo/demoSeoData.ts`
  - `src/components/seo/SEOPreview.tsx`
  - `src/components/seo/SEOView.tsx`
- **Arquivos Modificados:**
  - `src/components/layout/AdminShell.tsx`
  - `CHANGELOG.md`
- **Testes Realizados:**
  - `tsc --noEmit` via `lint_applet`: 0 erros.
  - `npm run build` via `compile_applet`: Sucesso (0 erros).

---

## [Fase 43 — Gestão Visual de Aparência e Temas]
- **Data:** 2026-09-08
- **Fase:** Fase 43 — Gestão Visual de Aparência e Temas (Continuação da Nova Sequência Formalizada)
- **Contexto & Formalização:**
  - Esta Fase 43 é uma **fase formalmente definida para a sequência atual do projeto**, subsequente à nova Fase 42, mantendo a regra de que o roadmap histórico original não estava disponível e que contratos canônicos consolidados governam a implementação.
  - Utiliza com precisão absoluta os contratos canônicos da **Fase 8** (`VisualTheme` e `DesignTokens`, englobando `ColorTokens`, `TypographyTokens`, `SpacingTokens`, `BorderTokens` e `ElevationTokens`).
- **Objetivo:**
  - Transformar a rota administrativa `appearance` (que renderizava `PlaceholderView`) em uma interface visual administrativa funcional, interativa e profissional para a gestão da aparência, seleção de temas e personalização dos tokens visuais do CMS.
- **Funcionalidades Implementadas:**
  - **Interface Administrativa de Aparência (`AppearanceView`):**
    - Acessível no menu lateral do `AdminShell` em `currentSection === 'appearance'`, sob a categoria SITE / APARÊNCIA.
    - Cabeçalho padronizado com identificador de fase, descrição e ações de topo (Descartar alterações e Salvar Tema).
  - **Catálogo e Seleção de Temas Canônicos (`VisualTheme`):**
    - Grid seletor com cartões interativos de temas eclesiásticos estruturados conforme o contrato `VisualTheme`: "Harmonia Eclesiástica (Padrão)", "Serenidade Litúrgica" e "Graça & Renovação (Oliva)".
    - Indicador de tema ativo, versão e amostra visual das paletas de cores.
  - **Live Preview Visual dos Design Tokens (`ThemePreview`):**
    - Área de demonstração em tempo real que renderiza componentes típicos do ecossistema eclesiástico (cabeçalho da congregação, hero banner de boas-vindas, cards de sermões, agenda e pedidos de oração) com aplicação estrita e em tempo real dos tokens visuais em edição.
    - Sem duplicar o editor de páginas, sem injetar CSS arbitrário e sem alterar o Tailwind global.
  - **Edição dos Design Tokens Canônicos (`DesignTokens`):**
    - **ColorTokens:** Edição integrada de `primary`, `secondary`, `accent`, `background`, `surface`, `text`, `muted`, `border` e `success`, com seletores de cor nativos sincronizados a inputs hexadecimais formatados.
    - **TypographyTokens:** Configuração estruturada de `fontFamilyHeading`, `fontFamilyBody`, `fontSizeBase`, `fontSizeHeading`, `lineHeightBase`, `letterSpacingBase`, `fontWeightNormal` e `fontWeightBold`.
    - **BorderTokens:** Parametrização declarativa de `radiusSmall`, `radiusMedium`, `radiusLarge`, `borderWidthThin` e `borderWidthThick`.
    - **SpacingTokens:** Parametrização declarativa de `base`, `sectionPaddingYMedium` e `containerStandard`.
  - **Controle de Estado, Segurança de Dados e Feedback:**
    - Detecção automática de modificações pendentes com alerta visual dinâmico (`appearance-unsaved-banner`).
    - Descarte e restauração instantânea dos tokens originais do tema.
    - Notificação toast de feedback após salvar com sucesso (`appearance-feedback-toast`).
- **Arquitetura & Segurança:**
  - Respeito integral à fronteira declarativa da Fase 8: sem runtime de CSS externo, sem injeção de scripts/fontes de terceiros, sem novos contratos paralelos.
  - Dados gerenciados no padrão em memória com isolamento total em `src/components/appearance/`.
  - Nenhuma persistência externa, backend novo ou banco de dados foi criado.
  - Nenhuma funcionalidade das Fases 1 a 42 foi quebrada ou modificada fora do estritamente necessário.
  - Nenhuma fase futura (SEO, Domínios, Analytics, Cultos regulares, Doações) foi antecipada.
- **Arquivos Criados:**
  - `src/components/appearance/demoAppearanceData.ts`
  - `src/components/appearance/ThemePreview.tsx`
  - `src/components/appearance/AppearanceView.tsx`
- **Arquivos Modificados:**
  - `src/components/layout/AdminShell.tsx`
  - `CHANGELOG.md`
- **Testes Realizados:**
  - `tsc --noEmit` via `lint_applet`: 0 erros.
  - `npm run build` via `compile_applet`: Sucesso (0 erros).

---

## [Fase 42 — Gestão Visual de Configurações Gerais e Identidade da Igreja]
- **Data:** 2026-09-08
- **Fase:** Fase 42 — Gestão Visual de Configurações Gerais e Identidade da Igreja (Nova Formalização Controlada)
- **Contexto & Formalização:**
  - Esta Fase 42 foi **formalmente redefinida agora**, em razão da comprovação via auditoria de que o roadmap histórico original não estava disponível na base de código.
  - O escopo foi estabelecido com base estrita nos contratos canônicos consolidados `SiteSettings` (Fase 17) e `InstitutionalContent` (`ChurchProfile`, `ChurchAddress`, `ChurchContact`, `ChurchSocialLinks` - Fase 11).
  - A Fase 41 (Gestão Visual de Banners) permanece como a última fase histórica anterior homologada.
- **Objetivo:**
  - Substituir o `PlaceholderView` da rota administrativa `settings` por uma interface administrativa visual completa, responsiva e funcional para gestão das configurações gerais do site e da identidade eclesiástica da congregação.
- **Funcionalidades Implementadas:**
  - **Tela Principal de Configurações (`SettingsView`):**
    - Acessível diretamente pelo item "Configurações" no menu lateral do `AdminShell` (`currentSection === 'settings'`), no grupo SITE / SISTEMA.
    - Cabeçalho padronizado com título, badge "Fase 42", subtítulo descritivo e barra de ações de salvamento e descarte de alterações.
  - **Identidade Institucional da Igreja (`ChurchProfile`):**
    - Edição dos campos canônicos: Nome Oficial da Igreja (`name`), Nome Curto / Sigla (`shortName`), Pastor Presidente (`leadPastor`), Denominação (`denomination`), Ano de Fundação (`foundingYear`), Lema (`tagline`), Slogan (`slogan`) e Descrição Institucional (`description`).
    - Integração cirúrgica com o `MediaPickerModal` existente para seleção do Logotipo da Igreja (`logoMediaId` e `logoUrl`) diretamente da biblioteca de mídia do sistema, com opção de remoção e exibição do preview.
  - **Informações e Preferências Gerais do Site (`SiteSettings`):**
    - Edição dos campos canônicos: Nome Público do Site (`siteName`), Fuso Horário (`timezone`), Idioma Principal (`language`), Localidade (`locale`), Formato de Data (`dateFormat`) e Formato de Hora (`timeFormat`).
    - Integração cirúrgica com o `MediaPickerModal` para seleção do Favicon do Site (`faviconMediaId` e `faviconUrl`).
  - **Canais de Contato Institucional (`ChurchContact`):**
    - Edição dos canais oficiais: E-mail Institucional (`email`), Telefone Fixo / Secretaria (`phone`) e WhatsApp Oficial (`whatsapp`).
  - **Endereço e Sede da Congregação (`ChurchAddress`):**
    - Edição dos campos físicos: Logradouro (`street`), Número (`number`), Complemento (`complement`), Bairro (`neighborhood`), Cidade (`city`), Estado/UF (`state`), CEP (`postalCode`) e País (`country`).
  - **Redes Sociais e Canais Oficiais (`ChurchSocialLinks`):**
    - Edição dos links oficiais: Instagram (`instagram`), YouTube (`youtube`), Facebook (`facebook`) e Spotify (`spotify`).
  - **Experiência de Usuário e Segurança de Dados:**
    - Detecção automática de alterações pendentes com alerta visual dinâmico (`unsaved-changes-banner`).
    - Ação de descarte de alterações com restauração imediata dos valores originais salvos.
    - Validação de preenchimento obrigatório para Nome da Igreja, Nome do Site e E-mail Institucional.
    - Notificação toast de feedback após salvar com sucesso (`settings-feedback-toast`).
    - Layout modular e limpo utilizando o container `SettingsSectionCard`, totalmente responsivo (375px a 1440px+).
- **Arquitetura & Segurança:**
  - Contratos canônicos `SiteSettings` e `InstitutionalContent` 100% preservados e reutilizados sem duplicidade ou criação de contratos paralelos.
  - Nenhuma persistência externa, backend novo ou banco de dados foi criado (padrão em memória preservado).
  - Nenhuma funcionalidade das Fases 1 a 41 foi modificada ou quebrada.
  - Nenhuma fase futura (Aparência, SEO, Domínios, Analytics, Cultos regulares, Doações) foi antecipada.
- **Arquivos Criados:**
  - `src/components/settings/demoSettingsData.ts`
  - `src/components/settings/SettingsSectionCard.tsx`
  - `src/components/settings/SettingsView.tsx`
- **Arquivos Modificados:**
  - `src/components/layout/AdminShell.tsx`
  - `CHANGELOG.md`
- **Testes Realizados:**
  - `tsc --noEmit` via `lint_applet`: 0 erros.
  - `npm run build` via `compile_applet`: Sucesso (0 erros).

---

## [Fase 41 — Gestão Visual de Banners]
- **Data:** 2026-09-08
- **Fase:** Fase 41 — Gestão Visual de Banners
- **Objetivo:**
  - Implementar a área de Gestão Visual de Banners no painel administrativo do CMS, consumindo e integrando o contrato canônico `ChurchBanner` (`id`, `tenantId`, `title`, `subtitle`, `imageMediaId`, `primaryButtonLabel`, `primaryButtonUrl`, `secondaryButtonLabel`, `secondaryButtonUrl`, `order`, `status`, `createdAt`, `updatedAt`) e o enum de status `BannerStatus` (`'active' | 'inactive'`).
- **Funcionalidades Implementadas:**
  - **Tela Principal de Banners (`BannersView`):**
    - Acessível diretamente pelo item "Banners" no menu lateral do `AdminShell` (`currentSection === 'banners'`), no grupo de CONTEÚDO logo abaixo de "Mídia".
    - Cabeçalho padronizado: "Banners" com ícone `Layers` e subtítulo descritivo.
    - Contadores dinâmicos derivados do estado local em memória: Total de Banners, Ativos (`active`) e Inativos (`inactive`).
    - Botão primário `[ + Novo banner ]`.
  - **Barra de Controle, Busca, Filtros e Ordenação (`BannersToolbar`):**
    - Busca textual em tempo real nos campos textuais canônicos: título (`title`), subtítulo (`subtitle`) e rótulo do botão primário (`primaryButtonLabel`).
    - Filtro rápido por status canônico (`all`, `active`, `inactive`) através dos cartões de métricas clicáveis e do seletor dedicado.
    - Seletor de ordenação: Ordem de exibição (# crescente), Título A–Z, Título Z–A, Mais recentes e Mais antigos.
    - Alternador de modos de exibição: Grade de Cartões Visuais (`cards`) e Tabela / Lista (`table`).
    - Indicador visual de filtros ativos com botão de limpeza e redefinição instantânea.
  - **Listagem e Cartões (`BannerList` e `BannerCard`):**
    - Grade de cartões responsiva (1, 2 e 3 colunas) com prévia da imagem de destaque, indicador de ordem (#), badge de status (`BannerStatusBadge`), título, subtítulo, botões de ação configurados, data de atualização e menu de ações rápidas.
    - Tabela administrativa desktop com colunas: Ordem (#), Mídia, Título & Mensagem, Chamadas de Ação, Status, Atualização e Ações completas.
    - Layout responsivo adaptado com alvos de toque >= 44px e compatibilidade total em 375px a 1440px.
  - **Criação e Edição de Banners (`BannerEditorModal`):**
    - Suporte estrito e exclusivo aos campos do contrato canônico `ChurchBanner`: `title`, `subtitle`, `imageMediaId`, `primaryButtonLabel`, `primaryButtonUrl`, `secondaryButtonLabel`, `secondaryButtonUrl`, `order` e `status` (`active` | `inactive`).
    - Integração cirúrgica com o `MediaPickerModal` existente para seleção da imagem de destaque (`imageMediaId`) diretamente da biblioteca de mídia.
    - Validação de preenchimento obrigatório para `title` e `order` (maior ou igual a 1).
    - Validação de URLs seguras para chamadas de ação (iniciando com `https://`, `http://` ou rotas relativas como `/sobre`, `/sermoes`).
  - **Visualização Local do Banner (`BannerPreviewModal`):**
    - Modal de visualização detalhada com simulação visual fiel do bloco de destaque, exibição da imagem de fundo com overlay elegante, indicador de ordem (#), badges de status, título, mensagem de apoio, botões de ação simulados, dados técnicos de URLs, detalhes do ativo de mídia e metadados de auditoria (`createdAt`, `updatedAt`).
    - Atalho para edição rápida.
    - Zero interpretação de HTML arbitrário: todo conteúdo é renderizado como texto puro e seguro.
  - **Duplicação e Exclusão Seguras:**
    - Duplicação local em memória com novo ID, título acrescido de "(Cópia)", incremento da ordem de exibição e preservação da imagem e links.
    - Confirmação explícita de exclusão (`DeleteBannerConfirmModal`) com resumo do banner e garantia de que os arquivos de mídia não são excluídos da biblioteca.
  - **Alteração Rápida de Status:**
    - Transição direta entre os estados canônicos (`active` <-> `inactive`) com feedback imediato via toast de notificação.
- **Arquitetura & Segurança:**
  - Contrato `ChurchBanner` e `BannerStatus` formalizados no modelo de dados em `src/types/index.ts`.
  - Zero criação de contratos paralelos ou duplicados.
  - Zero uso de `dangerouslySetInnerHTML`, `innerHTML`, `outerHTML`, `eval`, `new Function` ou scripts.
  - Zero persistência externa (sem backend, API, banco de dados, cookies ou localStorage).
  - `src/App.tsx` permaneceu 100% intacto.
  - Zero dependências adicionadas ao `package.json`.
- **Arquivos Criados:**
  - `src/components/banners/bannersUtils.ts`
  - `src/components/banners/demoBannersData.ts`
  - `src/components/banners/BannerStatusBadge.tsx`
  - `src/components/banners/BannersToolbar.tsx`
  - `src/components/banners/BannerCard.tsx`
  - `src/components/banners/BannerList.tsx`
  - `src/components/banners/BannerEditorModal.tsx`
  - `src/components/banners/BannerPreviewModal.tsx`
  - `src/components/banners/DeleteBannerConfirmModal.tsx`
  - `src/components/banners/BannersView.tsx`
- **Arquivos Modificados Cirurgicamente:**
  - `src/types/index.ts` (definição do contrato canônico `ChurchBanner` e `BannerStatus`)
  - `src/components/layout/Sidebar.tsx` (registro de `banners` em `NavigationKey` e inserção do item Banners com ícone `Layers` no grupo CONTEÚDO)
  - `src/components/layout/AdminShell.tsx` (importação e renderização de `BannersView` e atualização do rodapé para Fase 41)
  - `src/components/common/PlaceholderView.tsx` (registro de metadados para fallback de navegação)
  - `CHANGELOG.md` (documentação da entrega da Fase 41)

---

## [Fase 40 — Gestão Visual de Lideranças]
- **Data:** 2026-09-07
- **Fase:** Fase 40 — Gestão Visual de Lideranças
- **Objetivo:**
  - Implementar a área de Gestão Visual de Lideranças no painel administrativo do CMS, consumindo estritamente a única fonte de verdade: o contrato canônico `ChurchLeader` (`id`, `tenantId`, `name`, `role`, `description`, `photoMediaId`, `order`, `status`, `createdAt`, `updatedAt`) e o enum de status `LeaderStatus` (`'active' | 'inactive'`).
- **Funcionalidades Implementadas:**
  - **Tela Principal de Lideranças (`LeadersView`):**
    - Acessível diretamente pelo item "Lideranças" no menu lateral do `AdminShell` (`currentSection === 'leaders'`).
    - Cabeçalho padronizado: "Lideranças" com ícone `UserCheck` e subtítulo contextual.
    - Contadores dinâmicos derivados do estado local em memória: Total de Lideranças, Ativos (`active`) e Inativos (`inactive`).
    - Botão primário `[ + Nova liderança ]`.
  - **Barra de Controle, Busca, Filtros e Ordenação (`LeadersToolbar`):**
    - Busca textual em tempo real nos campos textuais canônicos: nome (`name`), cargo/função (`role`) e apresentação (`description`).
    - Filtro rápido por status canônico (`all`, `active`, `inactive`) através dos cartões de métricas clicáveis e do seletor dedicado.
    - Seletor de ordenação: Ordem de exibição (`order_asc`), Nome A–Z (`name_asc`), Nome Z–A (`name_desc`), Cargo / Função A–Z (`role_asc`), Mais recentes (`recent`) e Mais antigos (`oldest`).
    - Alternador de modos de exibição: Grade de Cartões (`cards`) e Tabela / Lista (`table`).
    - Indicador visual de filtros ativos com botão de limpeza e redefinição instantânea.
  - **Listagem e Cartões (`LeaderList` e `LeaderCard`):**
    - Grade de cartões responsiva (1, 2 e 3 colunas) com foto ou avatar com iniciais elegantes, indicador de ordem (#), badge de status ministerial (`LeaderStatusBadge`), nome, cargo, apresentação, data de atualização e menu de ações rápidas.
    - Tabela administrativa desktop com colunas: Ordem (#), Foto/Avatar, Nome & Função, Apresentação (truncada), Status, Atualização e Ações completas.
    - Layout responsivo adaptado com alvos de toque >= 44px e compatibilidade total em 375px a 1440px.
  - **Criação e Edição de Lideranças (`LeaderEditorModal`):**
    - Suporte estrito e exclusivo aos campos do contrato canônico `ChurchLeader`: `name`, `role`, `description`, `photoMediaId`, `order` e `status` (`active` | `inactive`).
    - Integração cirúrgica com o `MediaPickerModal` existente para seleção da foto de perfil (`photoMediaId`) diretamente da biblioteca de mídia.
    - Validação de preenchimento obrigatório para `name`, `role` e `order` (maior ou igual a 1).
    - Sem campos inventados (sem redes sociais, telefone, e-mail, departamento, ministério vinculado, data de ordenação, etc.).
  - **Visualização Local da Liderança (`LeaderPreviewModal`):**
    - Modal de visualização detalhada com exibição da foto de perfil ou avatar com iniciais em destaque, indicador de ordem (#), badges de status, nome, cargo, tenant, situação explicativa, apresentação ministerial completa, detalhes do arquivo de foto na biblioteca e metadados de auditoria (`createdAt`, `updatedAt`).
    - Atalho para edição rápida.
    - Zero interpretação de HTML arbitrário: todo conteúdo é renderizado como texto puro e seguro.
  - **Duplicação e Exclusão Seguras:**
    - Duplicação local em memória com novo ID, nome acrescido de "(Cópia)", incremento da ordem de exibição e preservação da foto e dados ministeriais.
    - Confirmação explícita de exclusão (`DeleteLeaderConfirmModal`) com resumo do líder e garantia de que os arquivos de mídia não são excluídos da biblioteca.
  - **Alteração Rápida de Status:**
    - Transição direta entre os estados canônicos (`active` <-> `inactive`) com feedback imediato via toast de notificação.
- **Arquitetura & Segurança:**
  - Consumo estrito do contrato `ChurchLeader` e `LeaderStatus` definidos em `src/types/index.ts`.
  - Zero criação de contratos paralelos ou duplicados.
  - Zero campos inventados.
  - Zero uso de `dangerouslySetInnerHTML`, `innerHTML`, `outerHTML`, `eval`, `new Function` ou scripts.
  - Zero persistência externa (sem backend, API, banco de dados, cookies ou localStorage).
  - `src/App.tsx` permaneceu 100% intacto.
  - Zero dependências adicionadas ao `package.json`.
- **Arquivos Criados:**
  - `src/components/leaders/leadersUtils.ts`
  - `src/components/leaders/demoLeadersData.ts`
  - `src/components/leaders/LeaderStatusBadge.tsx`
  - `src/components/leaders/LeadersToolbar.tsx`
  - `src/components/leaders/LeaderCard.tsx`
  - `src/components/leaders/LeaderList.tsx`
  - `src/components/leaders/LeaderEditorModal.tsx`
  - `src/components/leaders/LeaderPreviewModal.tsx`
  - `src/components/leaders/DeleteLeaderConfirmModal.tsx`
  - `src/components/leaders/LeadersView.tsx`
- **Arquivos Modificados:**
  - `src/components/layout/Sidebar.tsx`
  - `src/components/layout/AdminShell.tsx`
  - `src/components/common/PlaceholderView.tsx`
  - `CHANGELOG.md`
- **Arquivos Removidos:**
  - Nenhum arquivo removido.

---

## [Fase 39 — Gestão Visual de Galeria]
- **Data:** 2026-09-07
- **Fase:** Fase 39 — Gestão Visual de Galeria
- **Objetivo:**
  - Implementar a área de Gestão Visual de Galeria de Fotos no painel administrativo do CMS, consumindo estritamente a única fonte de verdade: o contrato canônico `ChurchGalleryAlbum` (`id`, `tenantId`, `title`, `slug`, `description`, `coverMediaId`, `mediaIds`, `status`, `createdAt`, `updatedAt`) e o enum de status `GalleryStatus` (`'active' | 'archived'`).
- **Funcionalidades Implementadas:**
  - **Tela Principal de Galeria (`GalleryView`):**
    - Acessível diretamente pelo item "Galeria" no menu lateral do `AdminShell` (`currentSection === 'gallery'`).
    - Cabeçalho padronizado: "Galeria" com ícone `Camera` e subtítulo contextual.
    - Contadores dinâmicos de álbuns e mídias derivados do estado local em memória: Total de Álbuns, Álbuns Ativos (`active`), Álbuns Arquivados (`archived`) e Total de Fotos Vinculadas (`totalPhotos`).
    - Botão primário `[ + Novo álbum ]`.
  - **Barra de Controle, Busca, Filtros e Ordenação (`GalleryToolbar`):**
    - Busca reativa em tempo real por título (`title`), identificador amigável (`slug`) e descrição (`description`).
    - Filtro rápido por status canônico (`all`, `active`, `archived`) através das métricas clicáveis e de seletor dedicado.
    - Seletor de ordenação: Mais recentes (`recent`), Mais antigos (`oldest`), Título (A-Z) (`title_asc`), Título (Z-A) (`title_desc`) e Mais fotos (`photos_desc`).
    - Alternador de modos de exibição: Grade de Cartões (`cards`) e Tabela / Lista (`table`).
    - Indicador visual de filtros ativos com botão de limpeza e redefinição instantânea.
  - **Listagem e Cartões (`GalleryList` e `GalleryCard`):**
    - Grade de cartões responsiva (1, 2 e 3 colunas) com pré-visualização da imagem de capa (`coverMediaId` ou primeira foto de `mediaIds`), badges sobrepostos de status e contagem de fotos, título, slug, descrição truncada, data de criação e menu de ações.
    - Tabela desktop com colunas: Capa & Álbum (miniatura + título + slug), Descrição (truncada), Fotos (contador com ícone), Data de Criação, Status (`GalleryStatusBadge`) e Ações.
    - Layout responsivo adaptado com alvos de toque >= 44px e compatibilidade total em 375px a 1440px.
  - **Criação e Edição de Álbuns (`GalleryEditorModal`):**
    - Suporte estrito e exclusivo aos campos do contrato canônico `ChurchGalleryAlbum`: `title`, `slug`, `description`, `coverMediaId`, `mediaIds` e `status` (`active` | `archived`).
    - Integração cirúrgica com o `MediaPickerModal` existente para seleção da imagem de capa (`coverMediaId`) e inclusão de fotos no álbum (`mediaIds`).
    - Gerenciador visual de fotos do álbum com miniaturas, indicador de capa, opção para definir foto como capa e remoção de fotos da lista.
    - Sugestão automática de slug a partir do título digitado.
    - Validação de preenchimento obrigatório para `title`.
    - Sem campos inventados (sem categorias, fotógrafo, localização, data do evento, tags, etc.).
  - **Visualização Local do Álbum (`GalleryPreviewModal`):**
    - Modal de visualização detalhada com exibição da imagem de capa em destaque, título, badge de status, metadados (slug, data de criação, última atualização), descrição completa e galeria de fotos associadas.
    - Visualizador ampliado de fotos individual ao clicar em qualquer miniatura da galeria.
    - Atalhos para alternância rápida de status (Ativar / Arquivar), duplicação e edição.
    - Zero interpretação de HTML arbitrário: todo conteúdo é renderizado como texto puro e seguro.
  - **Duplicação e Exclusão Seguras:**
    - Duplicação local em memória com novo ID, título acrescido de "(Cópia)", slug derivado e preservação das fotos associadas.
    - Confirmação explícita de exclusão (`DeleteGalleryConfirmModal`) com resumo do álbum e garantia de que os arquivos de mídia não são excluídos da biblioteca.
  - **Alteração Rápida de Status:**
    - Transição entre os estados canônicos (`active` <-> `archived`) com feedback imediato via toast de notificação.
- **Arquitetura & Segurança:**
  - Consumo estrito do contrato `ChurchGalleryAlbum` e `GalleryStatus` definidos em `src/types/index.ts`.
  - Zero criação de contratos paralelos ou duplicados.
  - Zero campos inventados.
  - Zero uso de `dangerouslySetInnerHTML`, `innerHTML`, `outerHTML`, `eval`, `new Function` ou scripts.
  - Zero persistência externa (sem backend, API, banco de dados, cookies ou localStorage).
  - `src/App.tsx` permaneceu 100% intacto.
  - Zero dependências adicionadas ao `package.json`.
- **Arquivos Criados:**
  - `src/components/gallery/galleryUtils.ts`
  - `src/components/gallery/demoGalleryData.ts`
  - `src/components/gallery/GalleryStatusBadge.tsx`
  - `src/components/gallery/GalleryToolbar.tsx`
  - `src/components/gallery/GalleryCard.tsx`
  - `src/components/gallery/GalleryList.tsx`
  - `src/components/gallery/GalleryEditorModal.tsx`
  - `src/components/gallery/GalleryPreviewModal.tsx`
  - `src/components/gallery/DeleteGalleryConfirmModal.tsx`
  - `src/components/gallery/GalleryView.tsx`
- **Arquivos Modificados:**
  - `src/components/layout/AdminShell.tsx`
  - `CHANGELOG.md`
- **Arquivos Removidos:**
  - Nenhum.
- **Validação de Compilação:**
  - TypeScript (`npx tsc --noEmit`) e Vite Build (`npm run build`) validados com sucesso absoluto.

---

## [Fase 38 — Gestão Visual de Pedidos de Oração]
- **Data:** 2026-09-07
- **Fase:** Fase 38 — Gestão Visual de Pedidos de Oração
- **Objetivo:**
  - Implementar a área de Gestão Visual de Pedidos de Oração e Intercessão Pastoral no CMS, consumindo estritamente a única fonte de verdade: o contrato canônico `ChurchPrayerRequest` (`id`, `tenantId`, `title`, `requesterName`, `requestText`, `isAnonymous`, `status`, `createdAt`, `updatedAt`).
- **Funcionalidades Implementadas:**
  - **Tela Principal de Pedidos de Oração (`PrayerRequestsView`):**
    - Acessível diretamente pelo item "Pedidos de Oração" no menu lateral do `AdminShell`.
    - Cabeçalho padronizado: "Pedidos de Oração" com ícone `HeartHandshake` e subtítulo pastoral.
    - Contadores dinâmicos de pedidos derivados do estado local em memória: Total, Pendentes (`pending`), Em Oração (`praying`), Respondidos (`answered`) e Arquivados (`archived`).
    - Botão primário `[ + Novo pedido ]`.
  - **Barra de Controle, Busca, Filtros e Ordenação (`PrayerRequestsToolbar`):**
    - Busca reativa por título (`title`), solicitante (`requesterName`), texto do pedido (`requestText`) e termo "anônimo".
    - Filtro rápido por status canônico (`all`, `pending`, `praying`, `answered`, `archived`) através de métricas clicáveis e seletores.
    - Seletor de ordenação: Mais recentes, Mais antigos, Solicitante (A-Z) e Solicitante (Z-A).
    - Alternador de modos de exibição: Tabela/Lista (`table`) e Cartões/Grade (`cards`).
    - Indicador visual de filtros ativos com botão de redefinição instantânea.
  - **Listagem e Cartões (`PrayerRequestList` e `PrayerRequestCard`):**
    - Tabela desktop com colunas: Solicitante & Título (com badge ou identificação visual de anonimato), Motivo da Intercessão (`requestText` truncado de forma segura e legível), Data de Envio (`createdAt`), Status (`PrayerRequestStatusBadge`) e Ações.
    - Cards responsivos com indicador de anonimato/solicitante, data, badge de status, título, trecho do pedido e menu suspenso de ações.
    - Suporte responsivo com alvos de toque >= 44px e layout mobile adaptado.
  - **Criação e Edição de Pedidos (`PrayerRequestEditorModal`):**
    - Suporte estrito e exclusivo aos campos do contrato canônico `ChurchPrayerRequest`: `title`, `requesterName`, `requestText`, `isAnonymous` e `status` (`pending` | `praying` | `answered` | `archived`).
    - Alternador de anonimato com desativação automática do nome do solicitante para garantia de confidencialidade.
    - Validação de preenchimento obrigatório para `requestText`.
    - Sem campos inventados (sem email, telefone, resposta pastoral externa, moderação ou categorias inventadas).
  - **Visualização Segura e Confidencial (`PrayerRequestPreviewModal`):**
    - Modal de visualização detalhada com selo de sigilo pastoral, dados do solicitante ou anonimato, data/hora formatada, status atual com descrição pastoral, texto integral em parágrafos seguros e atalhos rápidos para transição de status.
    - Zero interpretação de HTML arbitrário: todo conteúdo é renderizado como texto puro (`whitespace-pre-wrap`).
  - **Duplicação e Exclusão Seguras:**
    - Duplicação local em memória com novo ID, título com "(Cópia)" e status inicial redefinido para `pending`.
    - Confirmação explícita de exclusão (`DeletePrayerRequestConfirmModal`) com detalhes do pedido e remoção local em memória.
  - **Alteração Rápida de Status:**
    - Transição entre os estados canônicos (`pending`, `praying`, `answered`, `archived`) com feedback visual imediato via toast de notificação.
- **Arquitetura & Segurança:**
  - Consumo estrito do contrato `ChurchPrayerRequest` e `PrayerRequestStatus` definidos em `src/types/index.ts`.
  - Zero criação de contratos paralelos ou duplicados.
  - Zero campos inventados.
  - Zero uso de `dangerouslySetInnerHTML`, `eval` ou injeção de HTML.
  - Zero persistência externa (sem backend, API, banco de dados, cookies ou localStorage).
  - `src/App.tsx` permaneceu 100% intacto.
  - Zero dependências adicionadas ao `package.json`.
- **Arquivos Criados:**
  - `src/components/prayer-requests/prayerRequestsUtils.ts`
  - `src/components/prayer-requests/demoPrayerRequestsData.ts`
  - `src/components/prayer-requests/PrayerRequestStatusBadge.tsx`
  - `src/components/prayer-requests/PrayerRequestsToolbar.tsx`
  - `src/components/prayer-requests/PrayerRequestCard.tsx`
  - `src/components/prayer-requests/PrayerRequestList.tsx`
  - `src/components/prayer-requests/PrayerRequestEditorModal.tsx`
  - `src/components/prayer-requests/PrayerRequestPreviewModal.tsx`
  - `src/components/prayer-requests/DeletePrayerRequestConfirmModal.tsx`
  - `src/components/prayer-requests/PrayerRequestsView.tsx`
- **Arquivos Modificados:**
  - `src/components/layout/AdminShell.tsx`
  - `CHANGELOG.md`

---

## [Fase 37 — Gestão Visual de Ministérios]
- **Data:** 2026-09-07
- **Fase:** Fase 37 — Gestão Visual de Ministérios
- **Objetivo:**
  - Implementar a área de Gestão Visual de Ministérios e Departamentos da congregação no CMS, consumindo estritamente a única fonte de verdade: o contrato canônico `ChurchMinistry` (`id`, `tenantId`, `name`, `slug`, `description`, `leaderName`, `imageMediaId`, `status`, `createdAt`, `updatedAt`).
- **Funcionalidades Implementadas:**
  - **Tela Principal de Ministérios (`MinistriesView`):**
    - Acessível diretamente pelo item "Ministérios" no menu lateral do `AdminShell`.
    - Cabeçalho padronizado: "Ministérios" com ícone `Users` e subtítulo descritivo.
    - Contadores dinâmicos de ministérios derivados do estado local: Total, Ativos (`active`), Inativos (`inactive`).
    - Botão primário `[ + Novo ministério ]`.
  - **Barra de Controle, Busca, Filtros e Ordenação (`MinistriesToolbar`):**
    - Busca reativa por nome (`name`), slug (`slug`), liderança (`leaderName`) e descrição (`description`).
    - Filtro rápido por status canônico (`all`, `active`, `inactive`) através dos cartões de métricas e seletores.
    - Seletor de ordenação: Mais recentes, Mais antigos, Nome (A-Z), Nome (Z-A), Liderança (A-Z) e Liderança (Z-A).
    - Alternador de modos de exibição: Tabela/Lista (`table`) e Cartões/Grade (`cards`).
  - **Listagem e Cartões (`MinistryList` e `MinistryCard`):**
    - Tabela desktop com colunas: Ministério (thumbnail da foto, nome, descrição), Slug, Liderança (`leaderName`), Data, Status (`active` / `inactive`) e Ações.
    - Cards responsivos com imagem de destaque vinculada por `imageMediaId`, badge de status (`MinistryStatusBadge`), líder responsável, nome, descrição, slug com cópia rápida e menu flutuante de ações.
    - Suporte responsivo a dispositivos móveis com alvos de toque >= 44px.
  - **Criação e Edição de Ministérios (`MinistryEditorModal`):**
    - Suporte estrito e exclusivo aos campos do contrato canônico `ChurchMinistry`: `name`, `slug`, `description`, `leaderName`, `imageMediaId` e `status` (`active` | `inactive`).
    - Geração automática de slug a partir do nome com normalização segura e garantia de unicidade em memória (`ensureUniqueMinistrySlug`).
    - Reutilização direta do `MediaPickerModal` existente para seleção da imagem de destaque (`imageMediaId`).
    - Seleção de status operacional (`active` ou `inactive`).
    - Descrição mantida como texto estruturado seguro sem interpretação de HTML arbitrário.
  - **Prévia Visual Realista do Ministério (`MinistryPreviewModal`):**
    - Modal de visualização estruturado com capa, título, slug legível, liderança responsável, status e texto em parágrafos seguros sem scripts ou HTML arbitrário.
  - **Duplicação e Exclusão Seguras:**
    - Duplicação local em memória com novo ID, nome acrescido de "(Cópia)", slug único e status inicial `inactive`.
    - Confirmação explícita de exclusão (`DeleteMinistryConfirmModal`) com remoção segura em memória.
  - **Alteração Rápida de Status:**
    - Transição entre `active` e `inactive` com feedback visual imediato via toast.
- **Arquitetura & Segurança:**
    - Consumo estrito do contrato `ChurchMinistry` e `MinistryStatus` definidos em `src/types/index.ts`.
    - Zero criação de contratos paralelos ou duplicados.
    - Zero campos inventados (sem categoria, sem calendário artificial, sem membros inventados).
    - Zero uso de `dangerouslySetInnerHTML`, `eval` ou manipulação insegura de HTML.
    - Zero persistência externa (sem backend, API, banco de dados ou localStorage).
    - `src/App.tsx` permaneceu 100% intacto.
    - Zero dependências adicionadas ao `package.json`.
- **Arquivos Criados:**
  - `src/components/ministries/ministriesUtils.ts`
  - `src/components/ministries/demoMinistriesData.ts`
  - `src/components/ministries/MinistryStatusBadge.tsx`
  - `src/components/ministries/MinistriesToolbar.tsx`
  - `src/components/ministries/MinistryCard.tsx`
  - `src/components/ministries/MinistryList.tsx`
  - `src/components/ministries/MinistryEditorModal.tsx`
  - `src/components/ministries/MinistryPreviewModal.tsx`
  - `src/components/ministries/DeleteMinistryConfirmModal.tsx`
  - `src/components/ministries/MinistriesView.tsx`
- **Arquivos Modificados:**
  - `src/components/layout/AdminShell.tsx`
  - `src/components/layout/Sidebar.tsx`
  - `CHANGELOG.md`

---

## [Fase 36 — Gestão Visual de Sermões]
- **Data:** 2026-09-07
- **Fase:** Fase 36 — Gestão Visual de Sermões
- **Objetivo:**
  - Implementar a primeira versão visual e funcional em memória da área de Gestão de Sermões e Mensagens da Igreja no CMS, consumindo estritamente o contrato canônico `ChurchSermon`.
- **Funcionalidades Implementadas:**
  - **Tela Principal de Sermões (`SermonsView`):**
    - Acessível diretamente pelo item "Sermões" no menu lateral do `AdminShell`.
    - Cabeçalho padronizado: "Sermões" com ícone `Video` e subtítulo descritivo.
    - Contadores dinâmicos de sermões derivados do estado local: Total, Publicados (`published`), Rascunhos (`draft`), Arquivados (`archived`).
    - Botão primário `[ + Novo sermão ]`.
  - **Barra de Controle, Busca, Filtros e Ordenação (`SermonsToolbar`):**
    - Busca instantânea e reativa por título (`title`), slug (`slug`), pregador (`preacher`), passagem bíblica (`scriptureReference`) e descrição (`description`).
    - Filtro rápido por status canônico (`all`, `published`, `draft`, `archived`) através dos cards de métricas e botões de filtro.
    - Seletor de ordenação: Mais recentes, Mais antigos, Título (A-Z), Título (Z-A), Pregador (A-Z) e Pregador (Z-A).
    - Alternador de modos de exibição: Tabela/Lista (`table`) e Cartões/Grade (`cards`).
  - **Listagem e Cartões (`SermonList` e `SermonCard`):**
    - Tabela desktop com colunas: Sermão (com thumbnail da capa, título, descrição e badges de vídeo/áudio), Slug, Pregador, Passagem Bíblica, Data, Status e Ações.
    - Cards responsivos com imagem de destaque, badge de status, chips de mídia (vídeo/áudio), pregador, passagem bíblica, data, resumo e menu de ações.
    - Integração com a biblioteca de mídia via `thumbnailMediaId` e indicador de áudio via `audioMediaId`.
  - **Criação e Edição de Sermões (`SermonEditorModal`):**
    - Suporte estrito e exclusivo aos campos do contrato canônico `ChurchSermon`: `title`, `slug`, `description`, `preacher`, `date`, `scriptureReference`, `videoUrl`, `audioMediaId`, `thumbnailMediaId` e `status`.
    - Geração automática de slug a partir do título com normalização segura e garantia de unicidade em memória (`ensureUniqueSermonSlug`).
    - Validação de segurança estrita para URL de vídeo (`isValidVideoUrl`), aceitando somente `http://` e `https://` e rejeitando esquemas perigosos como `javascript:`, `data:`, `vbscript:` ou tags HTML.
    - Reutilização direta do `MediaPickerModal` existente para seleção da imagem de capa (`thumbnailMediaId`).
    - Seleção segura de áudios cadastrados na biblioteca de mídia para o campo `audioMediaId`.
    - Descrição mantida como texto seguro sem interpretação de HTML arbitrário.
  - **Prévia Visual Realista do Sermão (`SermonPreviewModal`):**
    - Modal de visualização estruturado como página de sermão real da igreja: capa, título, slug legível, pregador, passagem bíblica, data, links seguros para reprodutor externo de vídeo e arquivos de áudio, e descrição em parágrafos seguros sem scripts ou iframes arbitrários.
  - **Duplicação e Exclusão Seguras:**
    - Duplicação local em memória com novo ID, título acrescido de "(Cópia)", slug único e status inicial `draft`.
    - Confirmação explícita de exclusão (`DeleteSermonConfirmModal`) com remoção segura em memória.
  - **Alteração Rápida de Status:**
    - Transição entre `published`, `draft` e `archived` com feedback visual imediato via toast.
- **Arquitetura & Segurança:**
  - Consumo estrito do contrato `ChurchSermon` e `SermonStatus` definidos em `src/types/index.ts`.
  - Zero criação de contratos paralelos ou duplicados.
  - Zero uso de `dangerouslySetInnerHTML`, `eval` ou manipulação insegura de HTML.
  - Zero persistência externa (sem backend, API, banco de dados ou localStorage).
  - `src/App.tsx` permaneceu 100% intacto.
  - Zero dependências adicionadas ao `package.json`.
- **Arquivos Criados:**
  - `src/components/sermons/sermonsUtils.ts`
  - `src/components/sermons/demoSermonsData.ts`
  - `src/components/sermons/SermonStatusBadge.tsx`
  - `src/components/sermons/SermonsToolbar.tsx`
  - `src/components/sermons/SermonCard.tsx`
  - `src/components/sermons/SermonList.tsx`
  - `src/components/sermons/SermonEditorModal.tsx`
  - `src/components/sermons/SermonPreviewModal.tsx`
  - `src/components/sermons/DeleteSermonConfirmModal.tsx`
  - `src/components/sermons/SermonsView.tsx`
- **Arquivos Modificados:**
  - `src/components/layout/AdminShell.tsx`
  - `CHANGELOG.md`
- **Validação Técnica:**
  - `lint_applet` (`tsc --noEmit`): 0 erros.
  - `compile_applet` (`vite build`): Sucesso total.

---

## [Fase 35 — Gestão Visual de Notícias]
- **Data:** 2026-09-07
- **Fase:** Fase 35 — Gestão Visual de Notícias
- **Objetivo:**
  - Implementar a primeira versão visual e funcional em memória da área de Gestão de Notícias da Igreja no CMS, consumindo estritamente o contrato canônico `ChurchNews`.
- **Funcionalidades Implementadas:**
  - **Tela Principal de Notícias (`NewsView`):**
    - Acessível diretamente pelo item "Notícias" no menu lateral do `AdminShell`.
    - Cabeçalho padronizado: "Notícias" e "Gerencie as notícias, comunicados e conteúdos informativos da sua igreja."
    - Contadores dinâmicos de notícias derivados do estado local: Total, Publicadas (`published`), Rascunhos (`draft`), Arquivadas (`archived`).
    - Botão primário `[ + Nova notícia ]`.
  - **Barra de Controle, Busca, Filtros e Ordenação (`NewsToolbar`):**
    - Busca instantânea e reativa por título (`title`), slug (`slug`), resumo (`summary`) e autor (`author`).
    - Filtro rápido por status canônico (`all`, `published`, `draft`, `archived`) através dos cards de métricas e chips.
    - Seletor de ordenação: Mais recentes, Mais antigas, Título (A-Z) e Título (Z-A).
    - Alternador de modos de exibição: Tabela/Lista (`table`) e Cartões/Grade (`cards`).
  - **Listagem e Cartões (`NewsList` e `NewsCard`):**
    - Tabela desktop com colunas: Notícia (com miniatura da capa, título, resumo e tempo estimado de leitura), Slug, Autor, Data de Publicação, Status e Ações.
    - Cards responsivos com imagem de destaque, badge flutuante de status, tempo de leitura estimado e menu de ações rápidas.
    - Integração visual com a biblioteca de mídia via `imageMediaId` para exibição das fotos de capa.
  - **Criação e Edição de Notícias (`NewsEditorModal`):**
    - Suporte estrito e exclusivo aos campos do contrato canônico `ChurchNews`: `title`, `slug`, `summary`, `content`, `imageMediaId`, `author`, `publishedAt` e `status`.
    - Geração automática de slug a partir do título com normalização segura e validação de unicidade local (`ensureUniqueNewsSlug`).
    - Campo de conteúdo com textarea confortável e contagem estimada de leitura em tempo real.
    - Conteúdo mantido como texto puro e seguro sem interpretação de HTML arbitrário.
    - Integração direta com a biblioteca de mídia existente através do componente `MediaPickerModal`.
  - **Prévia Visual Realista da Notícia (`NewsPreviewModal`):**
    - Modal de visualização estruturado como página de notícia real da igreja: capa fotográfica, título, slug legível, autor, data formatada, resumo destacado e parágrafos renderizados com segurança.
  - **Duplicação e Exclusão Seguras:**
    - Ação de duplicação com novo ID, título acrescido de "(Cópia)", slug único garantido e status `draft`.
    - Modal de confirmação explícita de exclusão (`DeleteNewsConfirmModal`) com remoção segura em memória.
  - **Alteração Rápida de Status:**
    - Transição local entre `published`, `draft` e `archived` com feedback via toast.
- **Arquitetura & Segurança:**
  - Consumo estrito do contrato `ChurchNews` e `NewsStatus` / `ContentStatus` definidos em `src/types/index.ts`.
  - Zero criação de contratos paralelos ou duplicados.
  - Zero uso de `dangerouslySetInnerHTML`, `eval` ou manipulação insegura de HTML.
  - Zero persistência externa (sem backend, API, Firestore ou localStorage).
  - `src/App.tsx` permaneceu 100% intacto.
  - Zero dependências adicionadas ao `package.json`.
- **Arquivos Criados:**
  - `src/components/news/demoNewsData.ts`
  - `src/components/news/newsUtils.ts`
  - `src/components/news/NewsStatusBadge.tsx`
  - `src/components/news/NewsToolbar.tsx`
  - `src/components/news/NewsCard.tsx`
  - `src/components/news/NewsList.tsx`
  - `src/components/news/NewsEditorModal.tsx`
  - `src/components/news/NewsPreviewModal.tsx`
  - `src/components/news/DeleteNewsConfirmModal.tsx`
  - `src/components/news/NewsView.tsx`
- **Arquivos Modificados:**
  - `src/components/layout/AdminShell.tsx`
  - `CHANGELOG.md`
- **Validação Técnica:**
  - `lint_applet` (`tsc --noEmit`): 0 erros.
  - `compile_applet` (`vite build`): Sucesso total.

---

## [Fase 34 — Gestão Visual de Eventos]
- **Data:** 2026-09-07
- **Fase:** Fase 34 — Gestão Visual de Eventos
- **Objetivo:**
  - Implementar a primeira versão visual e funcional em memória da área de Gestão de Eventos da Igreja no CMS, consumindo estritamente o contrato canônico `ChurchEvent`.
- **Funcionalidades Implementadas:**
  - **Tela Principal de Eventos (`EventsView`):**
    - Acessível diretamente pelo item "Eventos" no menu lateral do `AdminShell`.
    - Cabeçalho padronizado: "Eventos" e "Organize os eventos e atividades da sua igreja."
    - Contadores dinâmicos de eventos: Total, Publicados (`published`), Rascunhos (`draft`), Arquivados (`archived`).
    - Botão primário `[ + Novo evento ]`.
  - **Busca, Filtros e Ordenação (`EventsToolbar`):**
    - Busca instantânea e reativa por título (`title`), slug (`slug`), localização (`location`) e descrição (`description`).
    - Filtros por status canônico (`all`, `published`, `draft`, `archived`).
    - Filtro temporal derivado da data (`all`, `upcoming`, `past`).
    - Seletor de ordenação: Mais próximos, Mais recentes, Título A-Z, Título Z-A.
    - Alternador de modos de exibição: Tabela/Lista (`table`), Cartões (`cards`) e Calendário (`calendar`).
  - **Listagem e Cartões (`EventList` e `EventCard`):**
    - Tabela desktop com colunas: Data (com badge estilizado dia/mês), Evento (título, slug e miniatura da imagem), Data & Horário, Localização, Status canônico e Ações.
    - Cards responsivos para mobile e tablet.
    - Integração de imagens através de `imageMediaId` referenciando itens da biblioteca de mídia (`MediaItem`).
  - **Visualização por Calendário (`EventCalendarView`):**
    - Navegação mensal intuitiva (mês/ano anterior e próximo).
    - Grade do mês com identificação visual dos dias com eventos agendados.
    - Painel lateral interativo que lista detalhadamente os eventos do dia selecionado ou de todo o mês.
  - **Criação e Edição de Eventos (`EventEditorModal`):**
    - Suporte estrito e exclusivo aos campos do contrato canônico `ChurchEvent`: `title`, `slug`, `startDate`, `endDate`, `time`, `location`, `description`, `status` e `imageMediaId`.
    - Geração automática e garantia de unicidade de slugs (`ensureUniqueEventSlug`).
    - Seletor integrado com a biblioteca de mídia existente (`MediaPickerModal`).
  - **Visualização Detalhada do Evento (`EventPreviewModal`):**
    - Modal de prévia com imagem de capa, badge visual com dia e mês, metadados de data/horário/local, descrição completa e status.
  - **Duplicação e Exclusão Seguras:**
    - Ação de duplicação com novo ID, título com sufixo, slug único e status `draft`.
    - Modal de confirmação para exclusão em memória (`DeleteEventConfirmModal`).
  - **Alteração Rápida de Status:**
    - Transição local entre `published`, `draft` e `archived` com feedback via toast.
- **Arquitetura & Segurança:**
  - Consumo estrito do contrato `ChurchEvent` e `EventStatus` definidos em `src/types/index.ts`.
  - Zero dependências adicionadas ao `package.json`.
  - Zero criação de campos ou contratos paralelos não autorizados.
  - Zero uso de `dangerouslySetInnerHTML`, `eval` ou manipulação insegura do DOM.
  - `src/App.tsx` permaneceu 100% intacto.
- **Arquivos Criados:**
  - `src/components/events/demoEventsData.ts`
  - `src/components/events/eventsUtils.ts`
  - `src/components/events/EventStatusBadge.tsx`
  - `src/components/events/EventsToolbar.tsx`
  - `src/components/events/EventCard.tsx`
  - `src/components/events/EventList.tsx`
  - `src/components/events/EventCalendarView.tsx`
  - `src/components/events/EventEditorModal.tsx`
  - `src/components/events/EventPreviewModal.tsx`
  - `src/components/events/DeleteEventConfirmModal.tsx`
  - `src/components/events/EventsView.tsx`
- **Arquivos Modificados:**
  - `src/components/layout/AdminShell.tsx`
  - `CHANGELOG.md`
- **Validação Técnica:**
  - `lint_applet` (`tsc --noEmit`): 0 erros.
  - `compile_applet` (`vite build`): Sucesso total.

---

## [Fase 33 — Gestão Visual de Formulários]
- **Data:** 2026-09-07
- **Fase:** Fase 33 — Gestão Visual de Formulários
- **Objetivo:**
  - Implementar a camada visual e funcional local para gerenciamento de formulários do CMS na seção "Formulários" do Sidebar.
- **Funcionalidades Implementadas:**
  - **Tela Principal de Formulários (`FormsView`):**
    - Interface profissional de CMS com contador de formulários ativos, rascunhos e arquivados.
    - Botão de ação rápida `[ + Novo formulário ]`.
    - Alternância suave entre visualização em Grade (`FormCard`) e Lista (`FormList`).
  - **Busca e Filtros (`FormsToolbar`):**
    - Busca em tempo real e instantânea por `name`, `slug` e `description`.
    - Filtros por status canônico (`all`, `active`, `draft`, `archived`) com contadores integrados.
  - **Criação de Formulários (`FormEditorModal`):**
    - Geração automática de `slug` a partir do `name` com validação de unicidade (`ensureUniqueSlug`).
    - Campo de descrição e seleção de status (`draft`, `active`, `archived`).
    - Opção de estrutura inicial de campos: template padrão (Nome, E-mail, Mensagem) ou formulário vazio.
  - **Edição e Gestão de Campos (`FormFieldEditor`):**
    - Adição, edição, duplicação e reordenação (mover para cima / para baixo) de campos mantendo a propriedade `order` consistente.
    - Seletor de tipo estritamente mapeado para os 11 tipos canônicos de `FormFieldType` (`text`, `textarea`, `email`, `tel`, `number`, `url`, `date`, `select`, `radio`, `checkbox`, `boolean`).
    - Configuração de `label`, `name`, `placeholder`, `helpText` e flag `required`.
    - Gerenciador completo de opções para campos `select` e `radio` utilizando `FormFieldOption` (`label`, `value`, adição, reordenação e exclusão).
    - Modal de confirmação para remoção de campo.
  - **Prévia Visual Realista (`FormPreviewModal`):**
    - Renderização de cada campo de acordo com seu tipo canônico (inputs, textarea, selects, radio groups, checkboxes e boolean switches).
    - Exibição de asterisco obrigatório e textos de instrução (`helpText`).
    - Botão demonstrativo `[ Enviar formulário ]` com feedback informativo esclarecendo que o envio real será conectado em fase futura.
  - **Duplicação e Exclusão Seguras:**
    - Duplicação de formulário com geração de novos IDs (`id` e IDs de cada campo) e novo slug único.
    - Exclusão com modal de confirmação claro informando a remoção durante a sessão atual.
- **Arquitetura & Segurança:**
  - Utilização estrita dos contratos canônicos: `FormDefinition`, `FormFieldDefinition`, `FormFieldOption`, `FormFieldType`, `FormStatus`.
  - Zero criação de contratos duplicados ou paralelos.
  - Zero persistência externa (sem backend, API, Firestore ou localStorage).
  - Zero execução de código arbitrário ou HTML não sanitizado.
  - `src/App.tsx` permaneceu 100% intacto.
- **Arquivos criados:**
  - `src/components/forms/demoFormsData.ts`
  - `src/components/forms/formsUtils.ts`
  - `src/components/forms/FormStatusBadge.tsx`
  - `src/components/forms/FormsToolbar.tsx`
  - `src/components/forms/FormCard.tsx`
  - `src/components/forms/FormList.tsx`
  - `src/components/forms/FormFieldEditor.tsx`
  - `src/components/forms/FormEditorModal.tsx`
  - `src/components/forms/FormPreviewModal.tsx`
  - `src/components/forms/DeleteFormConfirmModal.tsx`
  - `src/components/forms/FormsView.tsx`
- **Arquivos modificados:**
  - `src/components/layout/AdminShell.tsx`
  - `CHANGELOG.md`
- **Validação Técnica:**
  - `npx tsc --noEmit` via `lint_applet`: 0 erros.
  - `npm run build` via `compile_applet`: Sucesso total.
- **Status:** CONCLUÍDO.

---

## [Fase 32 — Biblioteca Visual de Mídia e Seleção de Imagens]
- **Data:** 2026-09-07
- **Fase:** Fase 32 — Biblioteca Visual de Mídia e Seleção de Imagens
- **Objetivo:**
  - Transformar a área **Mídia** do CMS em uma biblioteca visual profissional e conectar essa biblioteca ao campo de imagem (`ImageField`) existente no Editor Visual.
- **Funcionalidades Implementadas:**
  - **Biblioteca Visual de Mídia (`MediaView`):**
    - Listagem de ativos eclesiais locais (imagens de fachada, cultos, pastoral, batismo, ação social; gravações de vídeo; áudios de hinos e podcasts; documentos oficiais PDF).
    - Cabeçalho profissional com contador de arquivos e botão `[ + Adicionar mídia ]`.
    - Modal informativo `AddMediaModal` esclarecendo que o ambiente opera em memória e que o upload real será conectado em fase futura.
    - Alternador de visualização: Grade (`MediaCard`) ou Lista (`MediaList`).
  - **Busca e Filtros (`MediaToolbar`):**
    - Busca em tempo real por `title`, `filename` e `originalName`.
    - Filtro por tipo (`MediaType`: `image`, `video`, `audio`, `document`).
    - Filtro por status (`MediaStatus`: `active`, `archived`).
    - Filtro por pasta (`folder?: string`).
  - **Preview e Detalhes (`MediaDetailsModal`):**
    - Preview de imagem em alta resolução, representação visual de vídeos, faixas de áudio e documentos.
    - Exibição de metadados técnicos: nome, arquivo original, tipo MIME, dimensões em pixels, tamanho formatado (B, KB, MB, GB), pasta e URL.
    - Edição local permitida estritamente para `title`, `altText` e `status` com persistência em memória e notificação visual.
  - **Seleção de Imagens e Integração com `ImageField` (`MediaPickerModal`):**
    - Abertura da biblioteca modal a partir do botão `[ Selecionar da biblioteca ]` no `ImageField`.
    - Filtro forçado automático para `MediaType = 'image'`, impedindo seleção de vídeos ou documentos em campos de imagem.
    - Preenchimento coerente de `mediaId = media.id`, `url = media.url`, `altText = media.altText`, `width = media.dimensions?.width` e `height = media.dimensions?.height`.
    - Ao digitar ou alterar a URL manualmente, `mediaId` é desvinculado (`mediaId = undefined`), evitando inconsistências.
    - Reflexo instantâneo no Canvas do Editor sem afetar os dados de outros blocos.
- **Arquitetura & Segurança:**
  - Contrato canônico único preservado: `MediaItem`.
  - Zero criação de novos contratos paralelos ou duplicados.
  - Zero upload real, zero `<input type="file">`, zero `FileReader`, zero storage ou CDN.
  - Zero APIs externas ou bancos de dados adicionados.
  - `src/App.tsx` permaneceu 100% intacto.
- **Arquivos criados:**
  - `src/components/media/demoMediaData.ts`
  - `src/components/media/mediaUtils.ts`
  - `src/components/media/AddMediaModal.tsx`
  - `src/components/media/MediaCard.tsx`
  - `src/components/media/MediaList.tsx`
  - `src/components/media/MediaToolbar.tsx`
  - `src/components/media/MediaDetailsModal.tsx`
  - `src/components/media/MediaPickerModal.tsx`
  - `src/components/media/MediaView.tsx`
- **Arquivos modificados:**
  - `src/components/editor/inspector/ImageField.tsx`
  - `src/components/layout/AdminShell.tsx`
  - `CHANGELOG.md`
- **Validação Técnica:**
  - `npx tsc --noEmit` via `lint_applet`: 0 erros.
  - `npm run build` via `compile_applet`: Sucesso total.
- **Status:** CONCLUÍDO.

---

## [Fase 31 — Gestão Visual de Navegação e Menus]
- **Data:** 2026-09-07
- **Fase:** Fase 31 — Gestão Visual de Navegação e Menus
- **Objetivo:**
  - Transformar a área **Navegação** do CMS em uma tela visual profissional e funcional para gerenciamento local de menus e itens de navegação do site da igreja.
- **Funcionalidades Implementadas:**
  - **Gestão de Menus:**
    - Visualização em cards de todos os menus configurados com nome, localização, status, contagem de itens e data de atualização.
    - Modal de criação de novos menus (`NewMenuModal`) com campos para nome, localização (`MenuLocation`) e status (`NavigationMenuStatus`).
    - Alternância rápida de status (`active` -> `draft` -> `archived`).
    - Duplicação de menu com regeneração de novos IDs únicos para o menu e todos os seus itens/sub-itens.
    - Exclusão segura de menu com modal de confirmação visual (`DeleteMenuConfirmModal`).
  - **Localizações Canônicas Suportadas (`MenuLocation`):**
    - `header`: Cabeçalho Principal.
    - `footer`: Rodapé Institucional.
    - `mobile_drawer`: Menu Mobile (Gaveta Lateral).
    - `mobile`: Barra Mobile Inferior.
    - `sidebar`: Barra Lateral de Navegação.
  - **Gestão Hierárquica de Itens (`ManageMenuView`):**
    - Adição e edição estruturada de itens de navegação via modal dedicado (`ItemModal`).
    - Suporte a destinos internos (`page`) vinculados a `PageId` das páginas do CMS na sessão local.
    - Suporte a destinos externos (`external`) com validação de segurança contra protocolos perigosos (`javascript:`, `data:`, `vbscript:`).
    - Controle declarativo de `openInNewTab` para links externos.
    - Controle de visibilidade (`isVisible`) com toggle reativo.
    - Reordenação sequencial de itens (`↑` / `↓`) com atualização do campo `order`.
    - Suporte hierárquico pai/filho (`parentId` e `children[]`).
    - Duplicação de itens com novos IDs únicos.
    - Exclusão com confirmação explícita (`DeleteItemConfirmModal`), alertando sobre itens filhos quando existentes.
  - **Prévia Visual do Menu (`NavigationMenuPreview`):**
    - Renderização visual adaptada por localização (cabeçalho com logo fictício e dropdowns, rodapé, gaveta mobile com simulação de smartphone e sidebar).
- **Arquitetura & Segurança:**
  - Zero novos contratos ou modelos paralelos: autoridade canônica mantida estritamente em `NavigationMenu`, `NavigationItem`, `NavigationTarget` e `PageId`.
  - Zero router, renderizadores públicos externos, APIs de persistência real ou banco de dados.
  - Estado 100% mantido em memória durante a sessão.
- **Arquivos criados:**
  - `src/components/navigation/demoNavigationData.ts`
  - `src/components/navigation/NewMenuModal.tsx`
  - `src/components/navigation/ItemModal.tsx`
  - `src/components/navigation/DeleteItemConfirmModal.tsx`
  - `src/components/navigation/DeleteMenuConfirmModal.tsx`
  - `src/components/navigation/NavigationMenuPreview.tsx`
  - `src/components/navigation/ManageMenuView.tsx`
  - `src/components/navigation/NavigationView.tsx`
- **Arquivos modificados:**
  - `src/components/layout/AdminShell.tsx`
  - `CHANGELOG.md`
- **Validação Técnica:**
  - `npx tsc --noEmit` via `lint_applet`: 0 erros.
  - `npm run build` via `compile_applet`: Compilação com sucesso (Vite production build).
- **Status:** CONCLUÍDO.

---

## [Fase 30 — Sistema Visual de Seções e Layout]
- **Data:** 2026-09-07
- **Fase:** Fase 30 — Sistema Visual de Seções e Layout
- **Objetivo:**
  - Evoluir o Editor Visual para oferecer um sistema profissional de composição e layout de seções da página.
- **Funcionalidades Implementadas:**
  - Inspetor visual de seções (`SectionInspector.tsx`) controlando `containerWidth`, `paddingY`, `themeVariant`, `backgroundColor`, `textColor` e `title`.
  - Renderização dinâmica e preview no canvas (`EditorSection.tsx`) com remoção de controles de edição no modo preview.
  - Modal de confirmação para exclusão de seções com aviso de blocos afetados (`DeleteSectionConfirmModal.tsx`).
- **Arquivos criados:**
  - `src/components/editor/inspector/SectionInspector.tsx`
  - `src/components/editor/DeleteSectionConfirmModal.tsx`
- **Arquivos modificados:**
  - `src/components/editor/EditorSection.tsx`
  - `src/components/editor/EditorInspector.tsx`
  - `src/components/editor/PageEditorView.tsx`
- **Validação Técnica:**
  - `npx tsc --noEmit`: 0 erros.
  - `npm run build`: Compilação com sucesso.
- **Status:** CONCLUÍDO.

---

## [Fase 29 — Edição Visual de Conteúdo dos Blocos]
- **Data:** 2026-09-07
- **Fase:** Fase 29 — Edição Visual de Conteúdo dos Blocos
- **Objetivo:**
  - Evoluir o Editor Visual de Página para permitir a edição visual estruturada do conteúdo dos blocos, consumindo estritamente os contratos canônicos e schemas existentes (`BlockDefinition` -> `BlockDataSchema` -> `EditableField` -> `BlockInstance.data`).
- **Campos Suportados (Fase 4):**
  - `text`: campo de texto simples com suporte a label, placeholder, min/max length e contador em tempo real (`TextField.tsx`).
  - `textarea`: campo de texto multi-linha com rows configurável, helpText e contagem de caracteres (`TextareaField.tsx`).
  - `rich_text`: campo de conteúdo rico estruturado em parágrafos limpos sem interpretador HTML, proíbidos estritamente `dangerouslySetInnerHTML`, `innerHTML` e `execCommand` (`RichTextField.tsx`).
  - `image`: gerenciador de mídia com suporte a URL segura, texto alternativo acessível (`altText`) e prévia visual em tempo real (`ImageField.tsx`).
  - `url`: campo de endereço web com exibição dos protocolos seguros permitidos (`https`, `http`, etc.) (`UrlField.tsx`).
  - `button`: campo de ação estruturada com rótulo (`label`), destino (`url`) e opção de abertura em nova aba (`openInNewTab`) (`ButtonField.tsx`).
  - `boolean`: alternador switch visual com foco acessível e atualização reativa (`BooleanField.tsx`).
  - `number`: campo numérico com limites min/max, step e unidade eclesiástica (`NumberField.tsx`).
  - `list`: coleção repetível de itens baseados em schema com adição, edição e remoção estruturadas (`FieldRenderer.tsx`).
  - `group`: agrupamento coeso de subcampos aninhados (`FieldRenderer.tsx`).
- **Arquitetura & Integração:**
  - **Zero Schemas Duplicados:** Nenhuma nova autoridade de schema criada; consumo direto de `BLOCK_CATALOG[block.type]?.dataSchema`.
  - **Blocos Sem Schema:** Para blocos do catálogo ainda sem schema específico registrado, exibição de aviso amigável sem inventar campos arbitrários.
  - **Separação Canônica:** `BlockInstance.data` (conteúdo) mantido estritamente isolado de `BlockInstance.config` (apresentação/layout).
  - **Atualização em Tempo Real:** Canvas atualizado instantaneamente ao digitar ou alterar qualquer campo estruturado, afetando exclusivamente o bloco selecionado.
- **Limitações Mantidas:**
  - Não há persistência permanente em banco de dados, upload para CDN, APIs REST ou autenticação nesta fase (estado em memória/sessão local).
  - Proibição absoluta de campos arbitrários como `html`, `raw_html`, `script`, `javascript`, `css`, `custom_css`, `code`.
- **Arquivos criados:**
  - `src/components/editor/inspector/TextField.tsx`
  - `src/components/editor/inspector/TextareaField.tsx`
  - `src/components/editor/inspector/BooleanField.tsx`
  - `src/components/editor/inspector/ButtonField.tsx`
  - `src/components/editor/inspector/ImageField.tsx`
  - `src/components/editor/inspector/RichTextField.tsx`
  - `src/components/editor/inspector/UrlField.tsx`
  - `src/components/editor/inspector/NumberField.tsx`
  - `src/components/editor/inspector/FieldRenderer.tsx`
  - `src/components/editor/inspector/BlockContentInspector.tsx`
- **Arquivos modificados:**
  - `src/components/editor/EditorInspector.tsx`
  - `src/components/editor/EditorBlock.tsx`
  - `CHANGELOG.md`
- **Testes realizados:**
  - `tsc --noEmit` via `lint_applet`: 0 erros.
  - `npm run build` via `compile_applet`: compilação concluída com sucesso.
- **Status:** CONCLUÍDO.

---

## [Fase 28 — Biblioteca Visual de Blocos]
- **Data:** 2026-09-07
- **Fase:** Fase 28 — Biblioteca Visual de Blocos
- **Alteração:**
  - Transformação cirúrgica da inserção de blocos em uma **Biblioteca Visual de Blocos profissional, pesquisável, categorizada e integrada ao editor**:
    - **Única Fonte da Verdade (`BLOCK_CATALOG`):**
      - Consumo direto e estrito de `BLOCK_CATALOG` de `src/constants/index.ts`.
      - Proibição absoluta de duplicação de autoridade ou criação de catálogos paralelos.
      - Preservação integral dos 15 blocos canônicos: `header`, `hero`, `about`, `ministries`, `schedule`, `events`, `news`, `sermons`, `live_stream`, `prayer_request`, `donations`, `leadership`, `gallery`, `contact`, `footer`.
    - **Categorização Canônica & Contadores Dinâmicos:**
      - Categorias derivadas das definições: `church_specific` (Igreja - 8), `content` (Conteúdo - 4), `hero` (Destaque - 1), `navigation` (Navegação - 1), `footer` (Rodapé - 1), além da aba agregadora `all` (Todos os Blocos - 15).
    - **Wireframes Abstratos de Prévia (`BlockPreviewWireframe.tsx`):**
      - Renderização vetorial limpa em CSS/Tailwind do layout representativo de cada um dos 15 tipos de bloco (sem imagens pesadas ou scripts).
    - **Cards Visuais de Bloco (`BlockCard.tsx`):**
      - Ícone semântico via `getBlockIcon`, título, badge estilizado por categoria, miniatura gráfica embutida, descrição pastoral e botão rápido de adição (`+ Adicionar`).
    - **Painel de Inspeção e Prévia Detalhada (`BlockDetailInspector.tsx`):**
      - Visualização expandida do bloco selecionado com prévia maior, detalhamento da finalidade pastoral, lista de campos estruturados do schema, seletor de seção de destino e botão de inserção direta.
    - **Pesquisa em Tempo Real e Estados Vazios:**
      - Campo de busca instantânea com atalho para limpar pesquisa.
      - Estado vazio contextual com orientação e botão de reset de filtros.
    - **Inicialização Segura de Dados (`initialBlockData.ts`):**
      - Geração de dados iniciais estruturados para novos blocos, protegidos contra injeção de HTML/scripts.
    - **Integração Fluida no Editor (`PageEditorView.tsx` & `AddBlockModal.tsx`):**
      - Ao adicionar um bloco, fecha a biblioteca, posiciona o bloco no final da seção e o seleciona imediatamente no editor com notificação visual.
  - **Arquivos criados:**
    - `src/components/editor/library/BlockPreviewWireframe.tsx`
    - `src/components/editor/library/BlockCard.tsx`
    - `src/components/editor/library/BlockDetailInspector.tsx`
    - `src/components/editor/library/BlockLibraryModal.tsx`
    - `src/components/editor/library/initialBlockData.ts`
  - **Arquivos modificados:**
    - `src/components/editor/AddBlockModal.tsx`
    - `src/components/editor/PageEditorView.tsx`
    - `CHANGELOG.md`
  - **Testes realizados:**
    - `npx tsc --noEmit` via `lint_applet`: 0 erros.
    - `npm run build` via `compile_applet`: compilação concluída com sucesso.
- **Status:** CONCLUÍDO.

---

## [Fase 27 — Editor Visual de Página]
- **Data:** 2026-09-07
- **Fase:** Fase 27 — Editor Visual de Página
- **Alteração:**
  - Implementação cirúrgica do Editor Visual de Página (`PageEditorView`):
    - Toolbar superior com visualização responsiva (desktop, tablet, mobile), alternância de prévia/edição, indicador de status e salvamento.
    - Painel estrutural lateral (`EditorStructurePanel`) com árvore hierárquica `Página > Seções > Blocos`.
    - Canvas central de edição e prévia responsiva (`EditorCanvas`, `ResponsivePreview`, `EditorSection`, `EditorBlock`).
    - Painel inspetor de propriedades (`EditorInspector`) com edição de configurações e dados estruturados.
- **Status:** CONCLUÍDO.

---

## [Fase 26 — Gestão Visual de Páginas]
- **Data:** 2026-09-07
- **Fase:** Fase 26 — Gestão Visual de Páginas
- **Alteração:**
  - Implementação cirúrgica da tela visual de Gestão de Páginas do CMS (`PagesView`):
    - **Contratos e Arquitetura Canônica Rigorosamente Respeitados:**
      - Alinhado com a hierarquia canônica `Page └── sections[] └── blocks[]` de `src/types/index.ts`.
      - Uso estrito dos contratos existentes: `Page`, `PageStatus` (`published`, `draft`, `archived`), `PageSEO`, `SectionInstance`, `BlockInstance`.
      - Nenhum contrato das Fases 1 a 25 foi modificado ou reescrito.
    - **Cabeçalho e Ação Primária (`src/components/pages/PagesView.tsx`):**
      - Título "Páginas", contador consolidado de páginas, subtítulo descritivo ("Gerencie as páginas e a estrutura principal do seu site.") e botão destacado `+ Nova página`.
    - **Barra de Ferramentas, Busca e Filtros (`src/components/pages/PageFilters.tsx`):**
      - Campo de pesquisa em tempo real por título e slug (ex: `/quem-somos`).
      - Filtros de status canônicos com contadores integrados: Todas (12), Publicadas (9), Rascunhos (2), Arquivadas (1).
      - Filtros por tipo de rota: Todas, Página Inicial (`home`), Páginas Internas (`internal`).
      - Botão "Limpar filtros" quando há filtros ativos.
    - **Listagem e Linhas de Páginas (`src/components/pages/PageRow.tsx`):**
      - Visualização em tabela profissional no Desktop com colunas: Página & Rota, Status, Estrutura, Última Atualização e Ações.
      - Visualização adaptada em cards no Mobile com touch targets adequados (≥ 44px).
      - Destaque visual explícito para a Página Inicial (`isHome: true`), com badge exclusivo e ícone `Home`.
      - Controles sutis de ordenação com botões para mover página para cima ou para baixo.
      - Badges de status tipados (`PageStatusBadge.tsx`) para `published`, `draft` e `archived`.
    - **Menu de Ações por Página:**
      - **Editar:** Abre o modal de transição estrutural (`PageEditorTransitionModal.tsx`), permitindo gerenciar rota, título, status e SEO, enquanto orienta claramente que o editor visual interno de blocos pertence à Fase 27.
      - **Visualizar:** Abre a prévia demonstrativa (`PagePreviewModal.tsx`), exibindo simulação de snippet do Google (SEO), URL pública e árvore hierárquica das seções.
      - **Definir como Inicial:** Altera visualmente `isHome: true` para o item selecionado e desmarca a página inicial anterior garantindo unicidade.
      - **Duplicar:** Cria cópia local no estado da interface com sufixo "(Cópia)" e status como rascunho.
      - **Mudar Status:** Permite alternar diretamente entre Publicada, Rascunho e Arquivada.
      - **Excluir:** Abre o modal de confirmação (`DeleteConfirmModal.tsx`) e remove o registro do estado local.
    - **Criação de Páginas (`src/components/pages/NewPageModal.tsx`):**
      - Modal profissional com validação de título, geração automática de slug, seleção de template base inicial (Padrão, Institucional, Em branco), opção de definição como página inicial e campos de SEO.
    - **Estado Vazio e Rodapé Informativo:**
      - Estado vazio contextual para pesquisas sem resultados (com botão de limpar filtros) e para lista vazia (com botão de criar página).
      - Rodapé com totalizador, divisão por status e indicação da página inicial ativa.
    - **Integração no Shell Administrativo (`src/components/layout/AdminShell.tsx`):**
      - Renderização nativa da seção `pages` sem criação de segundo router ou duplicação de layout.
      - Integração com as ações do Dashboard (botão "Nova página" e card "Páginas").
  - **Limites e Diretrizes Rigorosamente Respeitados:**
    - Zero backend, zero banco de dados, zero APIs reais ou mockadas, zero autenticação.
    - Zero editor visual, drag-and-drop de blocos, inspector ou WYSIWYG (escopo exclusivo da Fase 27).
    - Zero injeção de scripts, código executável ou CSS arbitrário.
    - Nenhuma dependência foi adicionada, alterada ou removida.
    - Contratos das Fases 1 a 25 foram 100% preservados.
    - `src/App.tsx`, `Sidebar.tsx`, `Header.tsx` e `DashboardView.tsx` foram mantidos intactos.
- **Arquivos modificados:**
  - `src/components/layout/AdminShell.tsx`
  - `CHANGELOG.md`
- **Arquivos criados:**
  - `src/components/pages/PagesView.tsx`
  - `src/components/pages/PageFilters.tsx`
  - `src/components/pages/PageRow.tsx`
  - `src/components/pages/PageStatusBadge.tsx`
  - `src/components/pages/NewPageModal.tsx`
  - `src/components/pages/PagePreviewModal.tsx`
  - `src/components/pages/PageEditorTransitionModal.tsx`
  - `src/components/pages/DeleteConfirmModal.tsx`
  - `src/components/pages/demoPagesData.ts`
- **Testes realizados:**
  - `npx tsc --noEmit` via `lint_applet`: 0 erros.
  - `npm run build` via `compile_applet`: compilação concluída com sucesso.
- **Status:** CONCLUÍDO.

---

## [Fase 25 — Dashboard Administrativo Visual Avançado]
- **Data:** 2026-09-07
- **Fase:** Fase 25 — Dashboard Administrativo Visual Avançado
- **Alteração:**
  - Evolução cirúrgica da camada visual do Dashboard Administrativo como verdadeira central de controle visual do CMS (SaaS):
    - **Área de Boas-Vindas (`src/components/dashboard/DashboardView.tsx`):**
      - Saudação pastoral ("Olá, Pr. Alexandre"), identificação do tenant ("Igreja Batista Central"), resumo do estado atual do site ("Site publicado e 100% acessível no domínio principal"), botão "Visitar site público" e botão de ação rápida "Nova página" com navegação direta.
    - **Ações Rápidas Aprimoradas (`src/components/dashboard/QuickActions.tsx`):**
      - 6 atalhos organizados estritamente na ordem de prioridade solicitada:
        1. Nova página (`pages`)
        2. Novo evento (`events`)
        3. Nova notícia (`news`)
        4. Novo sermão (`sermons`)
        5. Adicionar mídia (`media`)
        6. Novo formulário (`forms`)
      - Integração total com `onNavigate` do `AdminShell`.
    - **Indicadores Principais (Overview Metrics):**
      - 6 cards métricos padronizados (`StatCard.tsx`): Páginas (12), Notícias (19), Eventos (8), Sermões (42), Mídia (156) e Formulários (24), com ícones semânticos, contadores, descrições e tendências locais.
    - **Visão Geral de Conteúdo (`src/components/dashboard/ContentOverview.tsx`):**
      - Componente visual com barra de distribuição proporcional multicor e cartões individuais de cada categoria (Páginas, Notícias, Eventos, Sermões, Mídia, Formulários), totalizador consolidado (261 itens) e porcentagens relativas usando exclusivamente Tailwind CSS sem bibliotecas externas pesadas.
    - **Atividade Recente (`src/components/dashboard/RecentActivity.tsx`):**
      - Exibição de tipos de conteúdo, títulos, horários relativos, autores, ícones e badges visuais de estado (Publicado, Atualizado, Agendado, Adicionado, Recebido, Otimizado).
    - **Status do Site (`src/components/dashboard/SiteStatusCard.tsx`):**
      - 6 itens de infraestrutura e serviços com indicadores pontuais (●) e badges de estado:
        - SITE: ● Online
        - DOMÍNIO: ● Configurado
        - SSL: ● Ativo
        - SEO: ● Configurado
        - TEMA: ● Ativo
        - ANALYTICS: ● Configurado
    - **Resumo Institucional (`src/components/dashboard/InstitutionalSummary.tsx`):**
      - Baseado estritamente nos conceitos dos contratos canônicos (`ChurchProfile`, `InstitutionalContent`, `ChurchAddress`, `ChurchContact`, `ChurchSocialLinks`), apresentando nome da igreja, ano de fundação, pastor titular ("Pr. Alexandre Mendes"), denominação, slogan, endereço físico completo, canais de contato (e-mail, telefone, WhatsApp) e redes oficiais (Instagram, YouTube, Facebook, Spotify).
    - **Configuração do Site / Pendências (`src/components/dashboard/GettingStartedCard.tsx`):**
      - Checklist com barra de progresso visual (67% concluído) contendo as 6 etapas estruturais:
        1. Configurar identidade da igreja (Concluído -> navega para `settings`)
        2. Criar primeira página (Concluído -> navega para `pages`)
        3. Escolher aparência (Concluído -> navega para `appearance`)
        4. Configurar navegação (Em andamento -> navega para `navigation`)
        5. Configurar domínio (Concluído -> navega para `domains`)
        6. Configurar SEO (Pendente -> navega para `seo`)
  - **Limites e Diretrizes Rigorosamente Respeitados:**
    - Zero backend, zero banco de dados, zero APIs reais ou mockadas, zero autenticação.
    - Zero editor visual, drag-and-drop ou WYSIWYG.
    - Zero injeção de scripts, código executável ou CSS arbitrário.
    - Nenhuma dependência foi adicionada, alterada ou removida.
    - Contratos das Fases 1 a 23 foram 100% preservados.
    - `src/App.tsx`, `AdminShell.tsx`, `Sidebar.tsx` e `Header.tsx` foram mantidos intactos.
- **Arquivos modificados:**
  - `src/components/dashboard/DashboardView.tsx`
  - `src/components/dashboard/QuickActions.tsx`
  - `src/components/dashboard/RecentActivity.tsx`
  - `src/components/dashboard/SiteStatusCard.tsx`
  - `CHANGELOG.md`
- **Arquivos criados:**
  - `src/components/dashboard/ContentOverview.tsx`
  - `src/components/dashboard/InstitutionalSummary.tsx`
  - `src/components/dashboard/GettingStartedCard.tsx`
- **Testes realizados:**
  - `npx tsc --noEmit` via `lint_applet`: 0 erros.
  - `npm run build` via `compile_applet`: compilação concluída com sucesso.
- **Status:** CONCLUÍDO.

---

## [Fase 24 — Fundação Visual do CMS e Dashboard Administrativo]
- **Data:** 2026-09-07
- **Fase:** Fase 24 — Fundação Visual do CMS e Dashboard Administrativo
- **Alteração:**
  - Criação da fundação visual da aplicação administrativa (SaaS) moderna, profissional e responsiva:
    - **AdminShell (`src/components/layout/AdminShell.tsx`):**
      - Contêiner de alto nível coordenando Sidebar, Header, área principal e navegação por seções.
      - Suporte a recolhimento (collapse) no desktop, navegação móvel e painel de auditoria técnica das Fases 0 a 23.
    - **Header (`src/components/layout/Header.tsx`):**
      - Identificação do Tenant ("Igreja Batista Central"), badge de status ("Site no ar"), botão "Visitar site", indicador de notificações, perfil do usuário administrativo ("Pr. Alexandre") e botão para acionar a Sidebar no mobile.
    - **Sidebar (`src/components/layout/Sidebar.tsx`):**
      - Navegação estruturada em grupos coerentes:
        - PRINCIPAL: Dashboard.
        - CONTEÚDO: Páginas, Mídia, Formulários.
        - IGREJA: Eventos, Notícias, Sermões, Ministérios, Pedidos de Oração, Galeria.
        - SITE: Aparência, Navegação, SEO, Domínios, Analytics.
        - SISTEMA: Configurações.
      - Ícones semânticos da biblioteca `lucide-react`, estado ativo com realce, badges numéricos, recolhimento para modo compacto no desktop e drawer com backdrop no mobile.
    - **Dashboard Administrativo (`src/components/dashboard/DashboardView.tsx`):**
      - Banner de boas-vindas com atalhos de visitação e criação de página.
      - Cards de indicadores/estatísticas (`StatCard.tsx`): Páginas, Eventos, Formulários, Mídia, Sermões e Notícias com contagens demonstrativas locais.
      - Painel de Ações Rápidas (`QuickActions.tsx`): atalhos para criação de novas entidades e navegação rápida.
      - Painel de Conteúdo Recente (`RecentActivity.tsx`): timeline demonstrativa das últimas atualizações eclesiásticas.
      - Painel de Status do Site (`SiteStatusCard.tsx`): indicadores visuais consolidados de publicação, domínio com SSL, SEO, Analytics e Tema.
      - Resumo Institucional da Congregação com dados gerais.
    - **Telas de Placeholder Controladas (`src/components/common/PlaceholderView.tsx`):**
      - Placeholders estruturados para todas as seções adicionais da Sidebar (Páginas, Mídia, Formulários, Eventos, Notícias, Sermões, Ministérios, Pedidos de Oração, Galeria, Aparência, Navegação, SEO, Domínios, Analytics, Configurações), indicando as respectivas fases contratuais sem simular CRUDs falsos ou serviços mockados.
    - **Integração no App (`src/App.tsx`):**
      - Atualizado cirurgicamente para instanciar o `AdminShell`.
  - **Proibições e Limites Arquiteturais Rigorosamente Mantidos:**
    - Zero CRUD real, zero backend, zero banco de dados, zero APIs falsas ou chamadas HTTP mockadas.
    - Zero autenticação em runtime (sessão, tokens, senhas, login).
    - Zero editor visual, drag-and-drop, canvas ou preview builder (reservados para fases futuras).
    - Zero injeção de scripts, HTML arbitrário ou CSS livre (`dangerouslySetInnerHTML`, `eval`, `Function`).
    - Todos os contratos das Fases 1 a 23 foram 100% preservados.
- **Arquivos modificados:**
  - `src/App.tsx`
  - `CHANGELOG.md`
- **Arquivos criados:**
  - `src/components/layout/Header.tsx`
  - `src/components/layout/Sidebar.tsx`
  - `src/components/layout/AdminShell.tsx`
  - `src/components/dashboard/StatCard.tsx`
  - `src/components/dashboard/QuickActions.tsx`
  - `src/components/dashboard/RecentActivity.tsx`
  - `src/components/dashboard/SiteStatusCard.tsx`
  - `src/components/dashboard/DashboardView.tsx`
  - `src/components/common/PlaceholderView.tsx`
- **Testes realizados:**
  - `npx tsc --noEmit` via `lint_applet`: 0 erros.
  - `npm run build` via `compile_applet`: compilação concluída com sucesso.
- **Status:** CONCLUÍDO.

---

## [Fase 23 — Contrato Canônico de Analytics, Tags e Métricas do Site]
- **Data:** 2026-09-07
- **Fase:** Fase 23 — Contrato Canônico de Analytics, Tags e Métricas do Site
- **Alteração:**
  - Formalização do contrato declarativo de configurações de analytics, tags de terceiros e preferências de privacidade por Tenant (`SiteAnalytics`):
    - **Definição de Provedores Suportados (`SiteAnalyticsProvider`):**
      - Provedores canônicos: `'google_analytics' | 'google_tag_manager' | 'meta_pixel'`.
    - **Contrato Canônico `SiteAnalytics`:**
      - Atributos estruturais: `tenantId: TenantId; googleAnalyticsId?: string; googleTagManagerId?: string; metaPixelId?: string; searchConsoleVerificationToken?: string; anonymizeIp?: boolean; consentRequired?: boolean; isActive?: boolean; updatedAt?: string;`.
    - **Relação com Tenant:**
      - Campo estrutural `analytics?: SiteAnalytics;` associado formalmente a `Tenant` em `src/types/index.ts`.
    - **Single Source of Truth e Ausência de Duplicações:**
      - `SiteAnalytics` é a única autoridade canônica para identificadores de medição e tags de rastreamento do site.
      - Alinhamento pleno com a ação de permissão `'view:analytics'` preexistente em RBAC (Fase 13).
      - Separação estrita em relação a `SiteSEO` (motores de busca e redes sociais) e `SiteSettings` (identidade e preferências operacionais gerais).
    - **Proibições Arquiteturais e Segurança Estritamente Respeitadas:**
      - Zero script loaders, tag injectors, `<script>` runtimes ou manipuladores de DOM.
      - Zero inserção de tags `<script>`, `gtag.js`, `fbq` ou código JavaScript na página.
      - Zero trackers operacionais, coletores de eventos, pixel emitters ou beacons.
      - Zero chamadas HTTP para o Google Analytics, Meta ou qualquer API externa.
      - Zero banners de cookies ou widgets visuais de consentimento.
      - Zero HTML livre, CSS arbitrário, scripts ou código executável (`dangerouslySetInnerHTML`, `eval()`, `Function()`).
      - Zero armazenamento ou coleta de dados pessoais sensíveis, sessões ou cookies de visitantes.
    - **Fronteira Declarativa no Core (`src/core/analytics.ts`):**
      - Criado o arquivo `src/core/analytics.ts` reexportando os tipos do domínio e atualizado `src/core/index.ts` com `AnalyticsDomain`, `export * from './analytics'` e os tipos canônicos.
  - `src/App.tsx` rigorosamente intocado; nenhuma dependência externa adicionada, modificada ou removida.
- **Arquivos modificados:**
  - `src/types/index.ts`
  - `src/core/index.ts`
  - `CHANGELOG.md`
- **Arquivos criados:**
  - `src/core/analytics.ts`
- **Testes realizados:**
  - `npx tsc --noEmit` via `lint_applet`: 0 erros.
  - `npm run build` via `compile_applet`: compilação bem-sucedida.
  - Verificação de integridade de todas as fases anteriores (1 a 22).
- **Status:** CONCLUÍDO.

---

## [Fase 22 — Contrato Canônico de Formulários e Submissões do Site]
- **Data:** 2026-09-06
- **Fase:** Fase 22 — Contrato Canônico de Formulários e Submissões do Site
- **Alteração:**
  - Formalização do contrato declarativo de formulários configuráveis do site e registros de submissões por Tenant:
    - **Definição Canônica de Formulário (`FormDefinition`):**
      - Atributos estruturais: `id: string; tenantId: TenantId; name: string; slug: string; description?: string; status: FormStatus; fields: FormFieldDefinition[]; createdAt: string; updatedAt: string;`.
      - `FormStatus`: `'draft' | 'active' | 'archived'`.
    - **Definição Canônica de Campos (`FormFieldDefinition`):**
      - `FormFieldType`: `'text' | 'textarea' | 'email' | 'tel' | 'number' | 'url' | 'date' | 'select' | 'radio' | 'checkbox' | 'boolean'` (destinados estritamente à entrada de dados de visitantes, separados semanticamente dos 10 tipos de `EditableFieldType` da Fase 4 destinados ao CMS).
      - `FormFieldOption`: `{ value: string; label: string; }`.
      - Atributos: `id: string; name: string; label: string; type: FormFieldType; required?: boolean; placeholder?: string; helpText?: string; options?: FormFieldOption[]; order: number;`.
    - **Contrato Canônico de Submissões (`FormSubmission`):**
      - Separação estrutural estrita: `FormDefinition` define a estrutura; `FormSubmission` armazena respostas desacompladas via `formId`.
      - Atributos: `id: string; tenantId: TenantId; formId: string; status: FormSubmissionStatus; values: Record<string, FormSubmissionValue>; submittedAt: string;`.
      - `FormSubmissionStatus`: `'received' | 'processed' | 'archived'`.
      - `FormSubmissionValue`: `string | number | boolean | null | string[]`.
    - **Relação com Tenant:**
      - Campo estrutural `forms?: FormDefinition[];` associado formalmente a `Tenant` em `src/types/index.ts`.
    - **Single Source of Truth e Ausência de Duplicações:**
      - Zero duplicações de campos editáveis (Fase 4 preservada intacta).
      - Zero formulários concorrentes ou específicos prematuros.
      - Módulos da Fase 12 (`ChurchPrayerRequest`, `ChurchEvent`, `ChurchDonationInfo`, `ChurchContact`) mantidos independentes.
    - **Proibições Arquiteturais Estritamente Respeitadas:**
      - Zero formulários visuais funcionando, renderers ou componentes React.
      - Zero validações executáveis, parsers, sanitizers ou event handlers (`onSubmit`, `onChange`).
      - Zero envio real, e-mail, WhatsApp, SMS, push, webhook ou automação.
      - Zero backend, APIs, endpoints, banco de dados, ORMs, controllers ou persistência.
      - Zero editor visual, drag-and-drop ou construtor de formulários.
    - **Fronteira Declarativa no Core (`src/core/forms.ts`):**
      - Criado o arquivo `src/core/forms.ts` reexportando o domínio e atualizado `src/core/index.ts` com `FormsDomain`, `export * from './forms'` e os tipos canônicos.
  - `src/App.tsx` rigorosamente intocado; nenhuma dependência externa adicionada, modificada ou removida.
- **Arquivos modificados:**
  - `src/types/index.ts`
  - `src/core/index.ts`
  - `CHANGELOG.md`
- **Arquivos criados:**
  - `src/core/forms.ts`
- **Testes realizados:**
  - `npx tsc --noEmit` via `lint_applet`: 0 erros.
  - `npm run build` via `compile_applet`: compilação bem-sucedida.
  - Verificação de integridade de todas as fases anteriores (1 a 21).
- **Status:** CONCLUÍDO.

---

## [Fase 21 — Contrato Canônico de Redirecionamentos e Aliases de URL]
- **Data:** 2026-09-06
- **Fase:** Fase 21 — Contrato Canônico de Redirecionamentos e Aliases de URL
- **Alteração:**
  - Formalização do contrato declarativo de regras de redirecionamento e aliases de URL do site por Tenant (`SiteRedirect`):
    - **Tipagem Canônica de Redirecionamento:**
      - `SiteRedirectType`: `'permanent' | 'temporary'` (intenção puramente declarativa de persistência ou transitoriedade da regra, sem códigos HTTP em runtime).
      - `SiteRedirectTargetType`: `'page' | 'external'` (classificação discriminada e estrita do tipo de destino).
    - **Contrato Canônico `SiteRedirect`:**
      - Atributos estruturais: `id: string; tenantId: TenantId; sourcePath: string; targetType: SiteRedirectTargetType; targetPageId?: PageId; targetUrl?: string; type: SiteRedirectType; isActive: boolean; createdAt: string; updatedAt: string;`.
    - **Relação com Tenant:**
      - Campo estrutural `redirects?: SiteRedirect[];` associado formalmente a `Tenant` em `src/types/index.ts`.
    - **Single Source of Truth e Ausência de Duplicações:**
      - `SiteRedirect` é a única autoridade canônica para redirecionamentos e aliases de URL.
      - Zero fontes paralelas de verdade (`RedirectRule`, `PageRedirect`, `URLRedirect`, `RouteRedirect`, `URLAlias`, `PageAlias`, `RouteAlias`).
    - **Separação Rigorosa de Responsabilidades:**
      - *Page:* Continua autoridade exclusiva de conteúdo, seções e `slug`.
      - *SiteDomain:* Continua autoridade exclusiva de hostnames e tipos de domínio.
      - *NavigationMenu:* Continua autoridade exclusiva de menus e itens de navegação.
      - *SiteSEO / PageSEO:* Mantêm metadados de motores de busca e tags canônicas sem mistura com regras de redirecionamento.
      - *SitePublicationSettings:* Mantém metadados de visibilidade e modo manutenção.
    - **Proibições Arquiteturais Estritamente Respeitadas:**
      - Zero routers, middlewares, URL matchers ou engines de redirecionamento.
      - Zero emissão de códigos HTTP (301, 302, 307, 308) ou configuração de Nginx/Apache/CDN.
      - Zero busca, hidratação ou carregamento automático de `targetPageId`.
      - Zero editores visuais, formulários, painéis administrativos ou CRUDs operacionais.
      - Zero APIs, backend, endpoints, banco de dados ou rotinas de persistência.
    - **Fronteira Declarativa no Core (`src/core/redirects.ts`):**
      - Criado o arquivo `src/core/redirects.ts` com re-exports declarativos do domínio e atualizado `src/core/index.ts` com `RedirectsDomain`, `export * from './redirects'` e os tipos associados.
  - `src/App.tsx` rigorosamente intocado; nenhuma dependência externa adicionada, modificada ou removida.
- **Arquivos modificados:**
  - `src/types/index.ts`
  - `src/core/index.ts`
  - `CHANGELOG.md`
- **Arquivos criados:**
  - `src/core/redirects.ts`
- **Testes realizados:**
  - `npx tsc --noEmit` via `lint_applet`: 0 erros.
  - `npm run build` via `compile_applet`: compilação bem-sucedida.
  - Verificação de integridade de todas as fases anteriores (1 a 20).
- **Status:** CONCLUÍDO.

---

## [Fase 20 — Contrato Canônico de Configuração de Publicação e Visibilidade do Site]
- **Data:** 2026-09-06
- **Fase:** Fase 20 — Contrato Canônico de Configuração de Publicação e Visibilidade do Site
- **Alteração:**
  - Formalização do contrato declarativo de metadados de disponibilidade pública e visibilidade do site por Tenant (`SitePublicationSettings`):
    - **Classificação Canônica de Visibilidade (`SiteVisibility`):**
      - `SiteVisibility = 'public' | 'private';` (intenção puramente declarativa de disponibilidade do site).
    - **Contrato Canônico `SitePublicationSettings`:**
      - Atributos estruturais: `tenantId: TenantId; visibility: SiteVisibility; maintenanceMode?: boolean; updatedAt?: string;`.
    - **Relação com Tenant:**
      - Campo estrutural `publication?: SitePublicationSettings;` associado formalmente a `Tenant` em `src/types/index.ts`.
    - **Separação Rigorosa de Estados e Domínios (Ausência de Duplicações):**
      - *TenantStatus:* Continua representando a situação administrativa da organização (`'active' | 'inactive' | 'suspended'`).
      - *ContentStatus / PageStatus:* Continua representando o ciclo de vida editorial de cada conteúdo ou página (`'draft' | 'published' | 'archived'`).
      - *SiteDomain.status:* Continua representando o estado cadastral do hostname (`'pending' | 'active' | 'inactive'`).
      - *SiteSettings:* Mantém com exclusividade as preferências técnicas (idioma, fuso horário, formatos de data/hora, favicon).
      - *SiteSEO / PageSEO:* Mantém metadados de motores de busca e indexação.
      - *Page:* Continua responsável pelo conteúdo das páginas, sem conter metadados globais de publicação do site.
    - **Proibições Arquiteturais Estritamente Respeitadas:**
      - Zero publicação operacional, pipelines, filas de publicação, agendadores ou publicação em lote.
      - Zero bloqueios de runtime, middlewares de manutenção, telas de manutenção, redirecionamentos HTTP ou respostas 503.
      - Zero editores visuais, pré-visualizações, formulários ou painéis de publicação.
      - Zero deploy, sincronização de arquivos, geração estática de HTML ou infraestrutura de servidor/VPS.
      - Zero APIs, backend, endpoints, banco de dados ou rotinas de persistência.
    - **Fronteira Declarativa no Core (`src/core/publication.ts`):**
      - Criado o arquivo `src/core/publication.ts` com re-exports declarativos do domínio e atualizado `src/core/index.ts` com `PublicationDomain`, `export * from './publication'` e os tipos associados.
  - `src/App.tsx` rigorosamente intocado; nenhuma dependência externa adicionada, modificada ou removida.
- **Arquivos modificados:**
  - `src/types/index.ts`
  - `src/core/index.ts`
  - `CHANGELOG.md`
- **Arquivos criados:**
  - `src/core/publication.ts`
- **Testes realizados:**
  - `npx tsc --noEmit` via `lint_applet`: 0 erros.
  - `npm run build` via `compile_applet`: compilação bem-sucedida.
  - Verificação de integridade de todas as fases anteriores (1 a 19).
- **Status:** CONCLUÍDO.

---

## [Fase 19 — Contrato Canônico de Páginas, Rotas e Estrutura Pública]
- **Data:** 2026-09-06
- **Fase:** Fase 19 — Contrato Canônico de Páginas, Rotas e Estrutura Pública
- **Alteração:**
  - Formalização e consolidação dos contratos declarativos da estrutura pública de páginas por Tenant:
    - **Autoridade e Identidade da Página (`Page`):**
      - `Page` mantida como autoridade canônica do conteúdo: `id`, `tenantId`, `title`, `slug`, `status`, `order`, `isHome`, `seo`, `sections[]`, `publishedAt`, `createdAt`, `updatedAt`.
      - Adicionado o campo declarativo `isHome?: boolean;` a `Page`, formalizando a intenção estrutural da página inicial da congregação sem mecanismos de resolução automática ou redirecionamentos de runtime.
      - `Page.slug` preservado como a autoridade exclusiva do identificador amigável de rota pública.
    - **Hierarquia Visual Canônica Rigorosamente Preservada:**
      - Composição estrita: `Tenant -> pages[] -> Page -> sections[] -> blocks[] -> BlockInstance.data`.
      - `Page.blocks` continua rigorosamente inexistente na raiz da página.
    - **Vínculo Estrutural com Tenant:**
      - Campo estrutural `pages?: Page[];` associado formalmente ao contrato `Tenant` em `src/types/index.ts`.
    - **Separação Rigorosa de Responsabilidades:**
      - *Navegação:* `NavigationItem` e `NavigationTarget` continuam como autoridade exclusiva de menus e links (`NavigationTarget -> PageId`).
      - *Domínios:* `SiteDomain` e `Tenant.domains[]` continuam como autoridade exclusiva dos hostnames públicos.
      - *SEO:* `PageSEO` permanece como metadado isolado em `Page.seo`.
      - *Status:* `PageStatus` (`ContentStatus`: `'draft' | 'published' | 'archived'`) mantido intacto.
      - *Templates:* `TemplateDefinition` e `TemplatePageDefinition` mantidos isolados como moldes declarativos.
    - **Proibições Arquiteturais Estritamente Respeitadas:**
      - Zero React Router, roteamento operacional ou histórico (`window.location`).
      - Zero resolvedores ou construtores de URL (`buildPageUrl`, `resolveRoute`).
      - Zero resolução automática de homepage ou fallbacks de `/`.
      - Zero implementações ou contratos para página 404/erro.
      - Zero editores visuais, renderers, page builders ou geradores de código (HTML/CSS/JS).
      - Zero APIs, backend, controllers, serviços ou persistência.
    - **Fronteira Declarativa no Core (`src/core/pages.ts`):**
      - Atualizado `src/core/pages.ts` com re-exports declarativos de `Page`, `PageId`, `PageTemplate`, `PageStatus` e `PageSEO`.
  - `src/App.tsx` rigorosamente intocado; nenhuma dependência externa adicionada, modificada ou removida.
- **Arquivos modificados:**
  - `src/types/index.ts`
  - `src/core/pages.ts`
  - `CHANGELOG.md`
- **Arquivos criados:**
  - Nenhum.
- **Testes realizados:**
  - `npx tsc --noEmit` via `lint_applet`: 0 erros.
  - `npm run build` via `compile_applet`: compilação bem-sucedida.
  - Verificação de integridade de todas as fases anteriores (1 a 18).
- **Status:** CONCLUÍDO.

---

## [Fase 18 — Contrato Canônico de Domínios e Endereços do Site]
- **Data:** 2026-09-06
- **Fase:** Fase 18 — Contrato Canônico de Domínios e Endereços do Site
- **Alteração:**
  - Formalização do contrato declarativo e canônico de domínios, subdomínios e endereços do site por Tenant (`SiteDomain`):
    - **Classificação e Estados Canônicos:**
      - `SiteDomainType`: `'subdomain' | 'custom_domain'`.
      - `SiteDomainStatus`: `'pending' | 'active' | 'inactive'` (puramente declarativo; sem modelagem de workflows operacionais de DNS/SSL).
    - **Contrato Canônico `SiteDomain`:**
      - Atributos estruturais: `id: string; tenantId: TenantId; hostname: string; type: SiteDomainType; status: SiteDomainStatus; isPrimary?: boolean; createdAt: string; updatedAt: string;`.
    - **Relação com Tenant:**
      - Campo estrutural `domains?: SiteDomain[];` associado diretamente a `Tenant` em `src/types/index.ts`.
      - Preservação retrocompatível de `customDomain?: string;` em `Tenant`, evitando qualquer breaking change desnecessária.
    - **Separação Rigorosa de Responsabilidades e Ausência de Duplicações:**
      - *Tenant:* Autoridade de identidade e agregação estrutural (`domains[]`).
      - *SiteSettings:* Configurações gerais e preferências técnicas (idioma, timezone, data/hora, favicon).
      - *SiteSEO / PageSEO:* Metadados de SEO, indexação e `canonicalBaseUrl`.
      - *NavigationMenu:* Estrutura de menus e links de navegação.
      - *Page:* Conteúdo e composição de seções e blocos visuais.
    - **Proibições Arquiteturais Estritamente Respeitadas:**
      - Zero resolução de domínio em tempo de execução (`window.location`, hostname matching).
      - Zero detecção de tenant por host ou middlewares de domínio.
      - Zero gestão ou automação de DNS, certificados SSL, proxies reversos ou regras de servidor.
      - Zero implementação de promoção automática, fallback, redirecionamento ou canonicalização automática de `isPrimary`.
      - Zero APIs, backend, banco de dados, autenticação, editor visual ou código executável (HTML/CSS/JS livre).
    - **Fronteira Declarativa no Core (`src/core/domains.ts`):**
      - Criado o arquivo `src/core/domains.ts` com os re-exports declarativos do domínio e atualizado `src/core/index.ts` com `DomainsDomain`, `export * from './domains'` e os tipos correspondentes.
  - `src/App.tsx` rigorosamente intocado; nenhuma dependência externa adicionada, modificada ou removida.
- **Arquivos modificados:**
  - `src/types/index.ts`
  - `src/core/index.ts`
  - `CHANGELOG.md`
- **Arquivos criados:**
  - `src/core/domains.ts`
- **Testes realizados:**
  - `npx tsc --noEmit` via `lint_applet`: 0 erros.
  - `npm run build` via `compile_applet`: compilação bem-sucedida.
  - Verificação de integridade das fases anteriores (1 a 17).
- **Status:** CONCLUÍDO.

---

## [Fase 17 — Contrato Canônico de Configuração e Identidade do Site]
- **Data:** 2026-09-06
- **Fase:** Fase 17 — Contrato Canônico de Configuração e Identidade do Site
- **Alteração:**
  - Formalização do contrato declarativo de configurações gerais e identidade operacional do site da igreja (`SiteSettings`):
    - **Contrato Canônico `SiteSettings`:**
      - Atributos puramente estruturais e declarativos:
        `tenantId`, `siteName`, `language`, `locale`, `timezone`, `dateFormat`, `timeFormat`, `faviconMediaId`, `faviconUrl`, `updatedAt`.
    - **Integração Declarativa com o Tenant:**
      - Campo estrutural `siteSettings?: SiteSettings;` integrado a `Tenant` em `src/types/index.ts`.
    - **Isolamento de Domínios e Ausência Total de Duplicações:**
      - *Institucional:* Dados de igreja, líderes, endereço, telefone e redes sociais continuam sob autoridade única de `InstitutionalContent` (`ChurchProfile`, `ChurchAddress`, `ChurchContact`, `ChurchSocialLinks`).
      - *SEO:* Títulos, descrições, tags, Open Graph, Twitter Cards e robôs continuam sob autoridade única de `SiteSEO` e `PageSEO`.
      - *Visual:* Cores, tipografia e tokens de design continuam sob autoridade única de `VisualTheme` e `DesignTokens`.
      - *Navegação:* Menus, links e locais de exibição continuam sob autoridade única de `NavigationMenu` e `NavigationTarget`.
      - *Módulos:* Entidades eclesiais específicas continuam sob autoridade dos contratos da Fase 12.
    - **Integração com Biblioteca de Mídia:**
      - O favicon referencia o ativo através do identificador canônico `MediaId` (`faviconMediaId?: MediaId;`), sem criar novas abstrações redundantes (`FaviconAsset`, `SiteIcon`).
    - **Proibições Arquiteturais Estritamente Respeitadas:**
      - Zero conversores de timezone, formatadores de data/hora ou utilitários (`formatDate()`, `convertTimezone()`).
      - Zero motores de internacionalização, dicionários de tradução, loaders i18n ou alternadores de idioma.
      - Zero interfaces de configuração, telas, formulários, modais ou painéis de preferências.
      - Zero APIs, endpoints, backends, bancos de dados, persistência ou rotinas de autosave.
      - Zero HTML livre, scripts ou CSS arbitrário.
    - **Fronteira Declarativa no Core (`src/core/settings.ts`):**
      - Criado o domínio canônico `src/core/settings.ts` e exposto em `src/core/index.ts` como `SettingsDomain` e exportação do tipo `SiteSettings`.
  - `src/App.tsx` rigorosamente intocado; nenhuma dependência externa adicionada, modificada ou removida.
- **Arquivos modificados:**
  - `src/types/index.ts`
  - `src/core/index.ts`
  - `CHANGELOG.md`
- **Arquivos criados:**
  - `src/core/settings.ts`
- **Testes realizados:**
  - `npx tsc --noEmit` via `lint_applet`: 0 erros.
  - `npm run build` via `compile_applet`: compilação bem-sucedida.
  - Verificação de preservação de todas as fases anteriores (1 a 16).
- **Status:** CONCLUÍDO.

---

## [Fase 16 — Contrato Canônico de SEO e Metadados do Site]
- **Data:** 2026-09-06
- **Fase:** Fase 16 — Contrato Canônico de SEO e Metadados do Site
- **Alteração:**
  - Formalização do contrato declarativo e canônico de SEO e metadados estruturais do CMS:
    - **SEO Global do Site (`SiteSEO`):**
      - Contrato canônico estrutural associado diretamente ao Tenant (`Tenant.seo`):
        `title`, `description`, `keywords`, `siteName`, `defaultImageMediaId`, `defaultImageUrl`, `canonicalBaseUrl`, `locale`, `robots`, `openGraph`, `twitter`.
    - **SEO Específico da Página (`PageSEO`):**
      - Auditado e complementado a partir do contrato preexistente, preservando 100% de retrocompatibilidade (`metaTitle`, `metaDescription`, `keywords`, `ogImage`, `noIndex`).
      - Adicionados campos opcionais canônicos: `canonicalUrl`, `imageMediaId`, `robots`, `openGraph`, `twitter`.
    - **Diretivas de Robôs (`RobotsDirective`):**
      - Contrato puramente declarativo para controle de indexação e rastreamento (`index?: boolean; follow?: boolean; archive?: boolean;`).
    - **Open Graph Metadata (`OpenGraphMetadata`):**
      - Metadados estruturados para compartilhamento social (`title`, `description`, `imageMediaId`, `imageUrl`, `type`).
    - **Twitter / X Cards (`TwitterCardMetadata`):**
      - Metadados estruturados para cartões do Twitter/X (`card`, `title`, `description`, `imageMediaId`, `imageUrl`).
    - **Integração com a Biblioteca de Mídia:**
      - Referências a imagens sociais utilizam exclusivamente o identificador canônico `MediaId` (`imageMediaId`, `defaultImageMediaId`), preservando a biblioteca de mídia da Fase 10 sem abstrações redundantes.
    - **Isolamento Arquitetural Estrito:**
      - SEO permanece como metadado de topo (`Tenant.seo` e `Page.seo`), fora da árvore visual (`Page -> sections[] -> blocks[]`).
      - Zero duplicação de dados institucionais (`InstitutionalContent` permanece fonte única) ou visuais (`VisualTheme` permanece fonte única).
    - **Proibição Absoluta de Mecanismos e Execução:**
      - Zero SEO engines, geradores de HTML (<Helmet>, <meta>, <title>), geradores de sitemap ou robots.txt, crawlers, analíticos ou integrações com redes sociais.
      - Zero HTML livre, CSS arbitrário ou JavaScript executável.
    - **Fronteira no Core (`src/core/seo.ts`):**
      - Criado domínio canônico `src/core/seo.ts` e exposto em `src/core/index.ts` como `SeoDomain` e re-exports de tipos.
  - `src/App.tsx` rigorosamente intocado; nenhuma dependência externa adicionada, modificada ou removida.
- **Arquivos modificados:**
  - `src/types/index.ts`
  - `src/core/index.ts`
  - `CHANGELOG.md`
- **Arquivos criados:**
  - `src/core/seo.ts`
- **Testes realizados:**
  - `npx tsc --noEmit` via `lint_applet`: 0 erros.
  - `npm run build` via `compile_applet`: compilação bem-sucedida.
  - Verificação de preservação de todas as fases anteriores (4 a 15).
- **Status:** CONCLUÍDO.

---

## [Fase 15 — Contrato Canônico de Estados e Ciclo de Vida do Conteúdo]
- **Data:** 2026-09-06
- **Fase:** Fase 15 — Contrato Canônico de Estados e Ciclo de Vida do Conteúdo
- **Alteração:**
  - Formalização declarativa dos estados e ciclo de vida conceitual dos conteúdos existentes no projeto, sem criar sistemas paralelos ou concorrentes:
    - **Ciclo de Vida Editorial Canônico (`ContentStatus`):**
      - Definido o tipo canônico `ContentStatus = 'draft' | 'published' | 'archived'` para conteúdo editorial.
      - Alinhamento de `PageStatus`, `EventStatus`, `NewsStatus` e `SermonStatus` com `ContentStatus`, eliminando duplicações reais e preservando total retrocompatibilidade.
    - **Preservação Semântica dos Estados Existentes:**
      - `TenantStatus`: `'active' | 'inactive' | 'suspended'` (preservado).
      - `NavigationMenuStatus`: `'active' | 'draft' | 'archived'` (preservado).
      - `MediaStatus`: `'active' | 'archived'` (preservado).
      - `UserStatus`: `'active' | 'inactive' | 'suspended'` (preservado).
      - `TemplateStatus`: `'draft' | 'active' | 'archived'` (formalizado como tipo explícito em `TemplateDefinition`).
      - `ThemeStatus`: `'active' | 'draft' | 'archived'` (formalizado como tipo explícito em `VisualTheme`).
      - `ModuleDefinitionStatus`: `'planned' | 'in_development' | 'active'` (formalizado como tipo explícito em `ChurchModuleDefinition`).
      - Módulos Eclesiais de Conteúdo:
        - `ScheduleStatus`: `'active' | 'inactive'` (preservado).
        - `MinistryStatus`: `'active' | 'inactive'` (preservado).
        - `LeaderStatus`: `'active' | 'inactive'` (preservado).
        - `GalleryStatus`: `'active' | 'archived'` (preservado).
        - `PrayerRequestStatus`: `'pending' | 'praying' | 'answered' | 'archived'` (preservado).
        - `DonationStatus`: `'active' | 'inactive'` (preservado).
        - `LiveStreamStatus`: `'live' | 'scheduled' | 'offline'` (preservado).
    - **Separação Rigorosa de Conceitos:**
      - Estados são exclusivamente metadados de ciclo de vida declarativos; nenhum estado foi incluído em `BlockInstance.data`.
      - `BlockConfig` mantido estritamente isolado de `BlockInstance.data`.
    - **Proibições Rigorosamente Respeitadas:**
      - Ausência total de máquinas de estados (`StateMachine`, `WorkflowEngine`, `LifecycleEngine`).
      - Ausência total de métodos ou transições automáticas (`publish()`, `archive()`, `restore()`, `changeStatus()`).
      - Ausência de engines de publicação, publicadores em background, filas ou agendamentos (`scheduledAt`, `publishAt`).
      - Ausência de versionamento de conteúdo (`ContentVersion`, `RevisionHistory`, `RollbackService`).
      - Ausência de exclusão física ou lógica (`deleted`, `soft_deleted`, `trash`).
      - Ausência de runtime de resolução ou lifecycle (`UniversalStatus`, `StatusManager`, `StatusResolver`).
  - `src/App.tsx` rigorosamente intocado; nenhuma dependência externa adicionada, modificada ou removida.
- **Arquivos modificados:**
  - `src/types/index.ts`
  - `src/core/content.ts`
  - `src/core/templates.ts`
  - `src/core/theme.ts`
  - `src/core/modules.ts`
  - `src/core/index.ts`
  - `CHANGELOG.md`
- **Arquivos criados:**
  - Nenhum
- **Testes realizados:**
  - `npx tsc --noEmit` via `lint_applet`: 0 erros.
  - `npm run build` via `compile_applet`: compilação bem-sucedida.
  - Verificação de integridade das fases anteriores (4 a 14).
- **Status:** CONCLUÍDO.

---

## [Fase 14 — Contrato Canônico de Relacionamentos e Referências do CMS]
- **Data:** 2026-09-06
- **Fase:** Fase 14 — Contrato Canônico de Relacionamentos e Referências do CMS
- **Alteração:**
  - Estabelecimento e consolidação do contrato canônico declarativo de relacionamentos e referências entre entidades do CMS:
    - **Cadeia Arquitetural Oficial:**
      `Entidade de Origem -> ContentReference -> Entidade de Destino (via identificador canônico)`.
    - **Tipos de Referência Canônicos (`ContentReferenceType`):**
      - Tipado para distinguir as entidades declaradas no ecossistema: `'page' | 'media' | 'event' | 'news' | 'sermon' | 'schedule' | 'ministry' | 'leader' | 'gallery_album' | 'prayer_request' | 'donation_info' | 'live_stream'`.
    - **Contrato Canônico de Referência (`ContentReference`):**
      - Interface tipada `ContentReference { type: ContentReferenceType; id: string; }`.
      - Reutiliza exclusivamente identificadores canônicos existentes (`PageId` para páginas, `MediaId` para mídias, `id: string` para registros de módulos eclesiais).
      - Proibida a criação de IDs universais ou artificiais concorrentes (`UniversalId`, `EntityId`, `ReferenceId`).
    - **Integração com o Modelo de Dados dos Blocos:**
      - Adicionado `ContentReference` aos tipos aceitos em `BlockDataValue` (`BlockDataRecord`), permitindo que blocos declarem referências estruturadas dentro de `BlockInstance.data` sem transformá-los em entidades de negócio.
      - Preservada a estrita separação entre `BlockInstance.config` e `BlockInstance.data`.
    - **Preservação da Autoridade de Navegação:**
      - `NavigationTarget` permanece como autoridade exclusiva para itens de menu e links de navegação (`NavigationItem -> NavigationTarget -> PageId | external URL`), sem sobreposição ou duplicação.
    - **Preservação da Biblioteca de Mídia:**
      - Reutiliza `MediaId` e `MediaItem`. `ImageFieldData` preservado intacto.
    - **Fronteira de Domínio no Core (`src/core/references.ts`):**
      - Criado `src/core/references.ts` como boundary/re-export declarativo e integrado à raiz estrutural `src/core/index.ts`.
    - **Proibição Absoluta de Runtime de Resolução:**
      - Zero resolvers, loaders, providers, registries, factories, query engines, cache ou hidratação automática.
      - Zero banco de dados, API, backend, editores, renderizadores ou escape hatches (HTML/CSS/JS livres).
  - `src/App.tsx` rigorosamente intocado; nenhuma dependência externa adicionada, modificada ou removida.
- **Arquivos modificados:**
  - `src/types/index.ts`
  - `src/core/index.ts`
  - `CHANGELOG.md`
- **Arquivos criados:**
  - `src/core/references.ts`
- **Testes realizados:**
  - `npx tsc --noEmit` via `lint_applet`: 0 erros.
  - `npm run build` via `compile_applet`: compilação bem-sucedida.
  - Verificação de preservação de todas as fases anteriores (4 a 13).
- **Status:** CONCLUÍDO.

---

## [Fase 13 — Contrato Canônico de Usuários, Papéis e Permissões do CMS]
- **Data:** 2026-09-06
- **Fase:** Fase 13 — Contrato Canônico de Usuários, Papéis e Permissões do CMS
- **Alteração:**
  - Estabelecimento e consolidação dos contratos canônicos e estritamente declarativos de identidade, vínculo de tenant, papéis e permissões conceituais:
    - **Cadeia Arquitetural Oficial:**
      `Tenant -> Usuários vinculados ao Tenant (User.tenantId) -> Papéis (UserRole) -> Permissões conceituais (PermissionAction)`.
    - **Contrato Canônico de Usuário (`User`):**
      - Contém exclusivamente informações de identidade e estado necessárias: `id: UserId`, `tenantId: TenantId`, `name: string`, `email: string`, `role: UserRole`, `status: UserStatus`, `isActive?: boolean` (preservado para compatibilidade retroativa), `customPermissions?: PermissionAction[]`, `createdAt: string` e `updatedAt: string`.
      - **Zero Credenciais:** Não contém e proíbe terminantemente campos como `password`, `passwordHash`, `token`, `refreshToken`, `sessionToken`, `secret`, `apiKey` ou `credential`.
    - **Status de Usuário (`UserStatus`):**
      - Definido como `'active' | 'inactive' | 'suspended'`, sem lifecycle engine ou estados excessivos.
    - **Papéis Canônicos (`UserRole`):**
      - Preservado o conjunto conceitual integrado ao catálogo CMS: `'superadmin' | 'tenant_admin' | 'pastor' | 'editor' | 'media_volunteer'`.
    - **Definição Declarativa de Papel (`RoleDefinition`):**
      - Introduzido contrato declarativo tipado `RoleDefinition` contendo `id: UserRole`, `name: string`, `description: string` e `permissions: PermissionAction[]`.
      - Proibido qualquer runtime loader, registrador dinâmico ou resolver.
    - **Permissões Conceituais (`PermissionAction`):**
      - Expandido e consolidado para cobrir as ações conceituais do CMS (`'manage:tenant'`, `'manage:users'`, `'manage:pages'`, `'publish:pages'`, `'manage:blocks'`, `'manage:media'`, `'manage:navigation'`, `'manage:themes'`, `'manage:modules'`, `'manage:sermons'`, `'manage:events'`, `'manage:prayer_requests'`, `'view:analytics'`).
      - Nenhuma permissão vinculada a endpoints, URLs ou implementações técnicas de backend.
    - **Single Source of Truth para Multi-Tenancy:**
      - O vínculo canônico e estrutural entre Usuário e Tenant é exclusivamente `User.tenantId: TenantId`. Evitada a criação de fontes conflitantes (como `TenantMembership`, `Tenant.users` ou `User.memberships`).
      - O `tenantId` permanece puramente estrutural, sem middleware, resolvers de domínio ou isolamento de banco em tempo de execução.
    - **Fronteira de Domínio no Core (`src/core/users.ts`):**
      - Criado `src/core/users.ts` puramente como boundary/re-export e integrado a `src/core/index.ts`.
    - **Proibição Absoluta de Runtime de Segurança:**
      - Zero autenticação (login, logout, sessão, cookies, JWT, OAuth).
      - Zero autorização executável (`hasPermission`, `canUser`, `authorize`, guards, middleware, ACL/RBAC runtime, `PermissionService`, `RoleService`).
      - Zero backend, banco de dados, API ou telas administrativas.
  - `src/App.tsx` rigorosamente intocado; nenhuma dependência externa adicionada, modificada ou removida.
- **Arquivos modificados:**
  - `src/types/index.ts`
  - `src/core/index.ts`
  - `CHANGELOG.md`
- **Arquivos criados:**
  - `src/core/users.ts`
- **Testes realizados:**
  - `npx tsc --noEmit` via `lint_applet`: 0 erros.
  - `npm run build` via `compile_applet`: compilação bem-sucedida.
  - Verificação de ausência de credenciais, fontes duplicadas e integridade de tipos.
- **Status:** CONCLUÍDO.

---

## [Fase 12 — Contrato Canônico de Módulos e Domínios de Conteúdo da Igreja]
- **Data:** 2026-09-06
- **Fase:** Fase 12 — Contrato Canônico de Módulos e Domínios de Conteúdo da Igreja
- **Alteração:**
  - Estabelecimento e consolidação do contrato canônico declarativo dos módulos e domínios de conteúdo da igreja:
    - **Cadeia Arquitetural Oficial:**
      `Tenant -> InstitutionalContent -> Church Modules -> Module Content Contracts`, mantendo rigorosa separação da hierarquia de composição de páginas (`Page -> Sections -> Blocks -> BlockDefinition -> BlockDataSchema -> BlockInstance.data`).
    - **Preservação de Módulos Estruturais:** Preservados `ChurchModuleType` (13 tipos canônicos) e `ChurchModuleDefinition`, além de `CHURCH_MODULES_CATALOG`.
    - **Contratos dos Domínios de Conteúdo dos Módulos:**
      1. **Eventos (`ChurchEvent`, `EventStatus`):** Dados estruturados contendo `id`, `tenantId: TenantId`, `title`, `slug`, `description?`, `startDate`, `endDate?`, `time?`, `location?`, `imageMediaId?: MediaId`, `status: EventStatus ('draft' | 'published' | 'archived')`, `createdAt` e `updatedAt`.
      2. **Notícias e Avisos (`ChurchNews`, `NewsStatus`):** Informativos contendo `id`, `tenantId: TenantId`, `title`, `slug`, `summary?`, `content` (texto estruturado seguro), `imageMediaId?: MediaId`, `author?`, `publishedAt?`, `status: NewsStatus`, `createdAt` e `updatedAt`.
      3. **Sermões e Mensagens (`ChurchSermon`, `SermonStatus`):** Acervo contendo `id`, `tenantId: TenantId`, `title`, `slug`, `description?`, `preacher`, `date`, `scriptureReference?`, `videoUrl?`, `audioMediaId?: MediaId`, `thumbnailMediaId?: MediaId`, `status: SermonStatus`, `createdAt` e `updatedAt`.
      4. **Programação / Horários (`ChurchSchedule`, `ScheduleStatus`):** Agenda regular contendo `id`, `tenantId: TenantId`, `title`, `dayOfWeek?`, `time`, `description?`, `location?`, `status: ScheduleStatus ('active' | 'inactive')`, `createdAt?` e `updatedAt?`.
      5. **Ministérios (`ChurchMinistry`, `MinistryStatus`):** Departamentos contendo `id`, `tenantId: TenantId`, `name`, `slug`, `description?`, `leaderName?`, `imageMediaId?: MediaId`, `status: MinistryStatus`, `createdAt?` e `updatedAt?`.
      6. **Liderança (`ChurchLeader`, `LeaderStatus`):** Apresentação pastoral contendo `id`, `tenantId: TenantId`, `name`, `role`, `description?`, `photoMediaId?: MediaId`, `order: number`, `status: LeaderStatus`, `createdAt?` e `updatedAt?`.
      7. **Galeria (`ChurchGalleryAlbum`, `GalleryStatus`):** Álbuns contendo `id`, `tenantId: TenantId`, `title`, `slug?`, `description?`, `coverMediaId?: MediaId`, `mediaIds: MediaId[]`, `status: GalleryStatus ('active' | 'archived')`, `createdAt` e `updatedAt`.
      8. **Pedidos de Oração (`ChurchPrayerRequest`, `PrayerRequestStatus`):** Pedidos contendo `id`, `tenantId: TenantId`, `title?`, `requesterName?`, `requestText`, `isAnonymous?: boolean`, `status: PrayerRequestStatus ('pending' | 'praying' | 'answered' | 'archived')`, `createdAt` e `updatedAt?`.
      9. **Doações (`ChurchDonationInfo`, `DonationStatus`):** Orientações contendo `id`, `tenantId: TenantId`, `title`, `description?`, `bankAccountInfo?`, `pixKey?`, `instructions?`, `status: DonationStatus`, `updatedAt?`.
      10. **Transmissão ao Vivo (`ChurchLiveStreamInfo`, `LiveStreamStatus`):** Transmissões contendo `id`, `tenantId: TenantId`, `title`, `description?`, `streamUrl?`, `status: LiveStreamStatus ('live' | 'scheduled' | 'offline')`, `scheduledAt?` e `updatedAt?`.
    - **Reutilização de Contratos Canônicos de Mídia (Fase 10):** Todos os módulos reutilizam estritamente `MediaId` e `MediaItem`, sem criar sistemas de mídia próprios ou paralelos.
    - **Separação Rigorosa de Apresentação:** Os módulos de conteúdo são domínios de dados; os 15 `BlockType` da Fase 5 (`header`, `hero`, `about`, `ministries`, `schedule`, `events`, `news`, `sermons`, `live_stream`, `prayer_request`, `donations`, `leadership`, `gallery`, `contact`, `footer`) permanecem sendo blocos de apresentação de páginas. Os blocos não foram convertidos em entidades de negócio.
    - **Isolamento no Core:** Fronteira de domínio `src/core/modules.ts` atualizada para reexportar os novos contratos tipados.
    - **Proibição Absoluta de Runtime:** Zero banco de dados, ORM, APIs, backend, formulários, players de streaming, gateways de pagamento, calendários funcionais, automações, editores, renderizadores, HTML livre, CSS ou JavaScript.
  - `src/App.tsx` rigorosamente intocado; nenhuma dependência externa adicionada, modificada ou removida.
- **Arquivos modificados:**
  - `src/types/index.ts`
  - `src/core/modules.ts`
  - `CHANGELOG.md`
- **Arquivos criados:**
  - *Nenhum arquivo foi criado.*
- **Testes realizados:**
  - `npx tsc --noEmit` via `lint_applet`: 0 erros.
  - `npm run build` via `compile_applet`: compilação bem-sucedida.
  - Verificação de ausência de duplicidades e integridade de fronteiras.
- **Status:** CONCLUÍDO.

---

## [Fase 11 — Contrato Canônico de Conteúdo Institucional da Igreja]
- **Data:** 2026-09-06
- **Fase:** Fase 11 — Contrato Canônico de Conteúdo Institucional da Igreja (com Correção Cirúrgica de Fonte Única de Verdade)
- **Alteração:**
  - Consolidação e formalização do contrato canônico declarativo dos dados institucionais da igreja:
    - **Cadeia Arquitetural Oficial e Fonte Canônica Única:**
      `Tenant -> InstitutionalContent (profile, address, contact, socialLinks) -> BlockData`.
    - **Eliminação Rigorosa de Duplicação:**
      - Removidos de `ChurchProfile` os campos redundantes `address?: ChurchAddress`, `contact?: ChurchContact` e `socialLinks?: ChurchSocialLinks`. Tais dados pertencem e residem estrita e exclusivamente no agrupador `InstitutionalContent`.
      - Removida de `Tenant` a propriedade redundante `profile?: ChurchProfile`. O `Tenant` aponta exclusivamente para `institutionalContent?: InstitutionalContent`.
    - **Contrato Agrupador Único (`InstitutionalContent`):** Única fonte agrupadora canônica de dados institucionais do Tenant contendo `tenantId: TenantId`, `profile: ChurchProfile`, `address?: ChurchAddress`, `contact?: ChurchContact`, `socialLinks?: ChurchSocialLinks` e `updatedAt?: string`.
    - **Perfil Básico da Igreja (`ChurchProfile`):** Informações essenciais da congregação consolidadas (`name?`, `shortName?`, `description?`, `tagline?`, `slogan?`, `denomination?`, `leadPastor?`, `foundingYear?`, `logoMediaId?: MediaId`, `logoUrl?: string`).
    - **Endereço Eclesiástico (`ChurchAddress`):** Dados estruturados de localização física (`street`, `number?`, `complement?`, `neighborhood?`, `city`, `state`, `postalCode?`, `country?`), sem integração com Google Maps, GPS ou geocodificação.
    - **Canais de Contato (`ChurchContact`):** Canais institucionais declarativos (`email`, `phone?`, `whatsapp?`), sem disparadores de mensagens, SMTP ou rotinas automáticas de envio.
    - **Redes Sociais (`ChurchSocialLinks`):** Links declarativos para canais oficiais (`instagram?`, `youtube?`, `facebook?`, `spotify?`), sem integrações de API de terceiros ou login social.
    - **Mídia Institucional e Compatibilidade com Fase 10:** Referência direta a `logoMediaId?: MediaId` preservando a relação canônica com o domínio de mídia sem criar tipos de ativos paralelos.
    - **Independência Rigorosa de Páginas:** O conteúdo institucional é um domínio de dados; não contém `sections[]`, `blocks[]`, nem HTML/CSS. A hierarquia `Page -> sections[] -> blocks[] -> data` permanece 100% preservada e intacta.
    - **Isolamento no Core:** Fronteira de domínio `src/core/content.ts` e exportação central em `src/core/index.ts` atualizadas para disponibilizar os contratos de conteúdo institucional.
    - **Proibição Absoluta de Runtime:** Zero formulários, zero telas, zero editor, zero CRUD, zero banco de dados, zero APIs, zero envio de e-mails/WhatsApp, zero HTML livre, CSS ou JavaScript.
  - `src/App.tsx` rigorosamente intocado; nenhuma dependência externa adicionada, modificada ou removida.
- **Arquivos modificados:**
  - `src/types/index.ts`
  - `src/core/content.ts`
  - `src/core/index.ts`
  - `CHANGELOG.md`
- **Arquivos criados:**
  - *Nenhum arquivo foi criado.*
- **Testes realizados:**
  - `npx tsc --noEmit` via `lint_applet`: 0 erros.
  - `npm run build` via `compile_applet`: compilação bem-sucedida.
  - Verificação de eliminação de dupla fonte de verdade em Tenant e ChurchProfile.
- **Status:** CONCLUÍDO (CORREÇÃO CIRÚRGICA HOMOLOGADA).

---

## [Fase 10 — Contrato Canônico de Mídia e Biblioteca de Ativos]
- **Data:** 2026-09-06
- **Fase:** Fase 10 — Contrato Canônico de Mídia e Biblioteca de Ativos
- **Alteração:**
  - Consolidação e formalização do contrato canônico declarativo de mídia e ativos do CMS:
    - **Cadeia Arquitetural Oficial:**
      `Tenant -> Media Library -> MediaItem -> BlockData (ex: ImageFieldData.mediaId)`.
    - **Contrato Canônico de Ativo (`MediaItem`):** Tipagem estrutural unificada contendo `id: MediaId`, `tenantId: TenantId`, `title?: string`, `filename: string`, `originalName: string`, `mimeType: string`, `type: MediaType`, `sizeBytes: number`, `url: string`, `altText?: string`, `dimensions?: MediaDimensions`, `folder?: string`, `status?: MediaStatus`, `uploadedBy?: UserId`, `createdAt: string` e `updatedAt: string`.
    - **Tipos de Mídia (`MediaType`):** Categorias essenciais preservadas: `'image' | 'video' | 'audio' | 'document'`, sem proliferação desnecessária de formatos ou acoplamento a processamento.
    - **Dimensões Declarativas (`MediaDimensions`):** Metadados visuais declarativos (`width: number`, `height: number`), sem rotinas de redimensionamento ou processamento.
    - **Status Canônico (`MediaStatus`):** Status declarativo `'active' | 'archived'` para governança de ativos.
    - **Relação com Campos de Imagem:** Preservação da referência tipada em `ImageFieldData` (`mediaId?: MediaId`), permitindo a vinculação estrita entre o dado do bloco e o ativo na biblioteca de mídia sem necessitar de resolvedores ou carregadores funcionais.
    - **Separação Rigorosa de Dados e Configuração:** A mídia pertence estritamente ao domínio de dados (`BlockInstance.data`), sem migrar para configurações de layout (`BlockInstance.config`) ou tokens visuais.
    - **Isolamento no Core:** Fronteira de domínio `src/core/media.ts` atualizada para reexportar os tipos consolidados de mídia.
    - **Proibição Absoluta de Runtime:** Zero upload, zero storage (S3, local, etc.), zero processamento/crop/compressão de imagem, zero CDN, zero componentes React de mídia, zero HTML livre, CSS ou JavaScript.
  - `src/App.tsx` rigorosamente intocado; nenhuma dependência externa adicionada, modificada ou removida.
- **Arquivos modificados:**
  - `src/types/index.ts`
  - `src/core/media.ts`
  - `CHANGELOG.md`
- **Arquivos criados:**
  - *Nenhum arquivo foi criado.*
- **Testes realizados:**
  - `npx tsc --noEmit` via `lint_applet`: 0 erros.
  - `npm run build` via `compile_applet`: compilação bem-sucedida.
  - Verificação de ausência de storage, uploaders ou processadores de mídia.
- **Status:** CONCLUÍDO.

---

## [Fase 9 — Contrato Canônico de Navegação e Estrutura do Site]
- **Data:** 2026-09-06
- **Fase:** Fase 9 — Contrato Canônico de Navegação e Estrutura do Site
- **Alteração:**
  - Consolidação e formalização do contrato canônico declarativo de navegação e estrutura de links do CMS:
    - **Cadeia Arquitetural Oficial:**
      `Tenant -> NavigationMenu -> NavigationItem -> Target (PageId | URL externa)`.
    - **Contrato de Menu de Navegação (`NavigationMenu`):** Tipagem estrutural unificada contendo `id: NavigationMenuId`, `tenantId: TenantId`, `name: string`, `location: MenuLocation`, `items: NavigationItem[]`, `status?: NavigationMenuStatus ('active' | 'draft' | 'archived')`, `createdAt: string` e `updatedAt: string`.
    - **Localização de Menus (`MenuLocation`):** Posições conceituais consolidadas: `'header' | 'footer' | 'mobile' | 'mobile_drawer' | 'sidebar'`.
    - **Contrato de Itens de Navegação (`NavigationItem`):** Item declarativo contendo `id: string`, `label: string`, `order: number`, `isVisible: boolean`, `parentId?: string` (para árvore hierárquica pai/filho), `target?: NavigationTarget`, com compatibilidade retroativa para `url?`, `isExternal?`, `openInNewTab?` e `children?`.
    - **Destino Tipado e Controlado (`NavigationTarget`):** União discriminada `NavigationPageTarget` (`type: 'page'`, `pageId: PageId`, `openInNewTab?`) e `NavigationExternalTarget` (`type: 'external'`, `url: string`, `openInNewTab?`), eliminando strings soltas e garantindo vínculo seguro com páginas do CMS sem acoplamento a rotas ou código executável.
    - **Isolamento de Domínio e Independência da Composição:** A árvore de navegação permanece estritamente separada da hierarquia de conteúdo das páginas (`Page -> sections[] -> blocks[] -> data`). `Page` não contém menus e `Page.blocks` permanece inexistente.
    - **Isolamento no Core:** Fronteira de domínio `src/core/navigation.ts` atualizada para reexportar os novos tipos canônicos de navegação.
    - **Proibição Absoluta de Runtime/Roteamento:** Zero componentes React de menu, zero roteadores (React Router), zero manipuladores de clique/navegação dinâmica, zero HTML livre, CSS ou JavaScript.
  - `src/App.tsx` rigorosamente intocado; nenhuma dependência externa adicionada, modificada ou removida.
- **Arquivos modificados:**
  - `src/types/index.ts`
  - `src/core/navigation.ts`
  - `CHANGELOG.md`
- **Arquivos criados:**
  - *Nenhum arquivo foi criado.*
- **Testes realizados:**
  - `npx tsc --noEmit` via `lint_applet`: 0 erros.
  - `npm run build` via `compile_applet`: compilação bem-sucedida.
  - Verificação de ausência de router, componentes de menu ou manipuladores funcionais.
- **Status:** CONCLUÍDO.

---

## [Fase 8 — Contrato Canônico de Sistema Visual e Design Tokens]
- **Data:** 2026-09-06
- **Fase:** Fase 8 — Contrato Canônico de Sistema Visual e Design Tokens
- **Alteração:**
  - Estabelecimento do contrato canônico e declarativo do sistema visual e design tokens do CMS:
    - **Contrato Canônico de Tema Visual (`VisualTheme`):** Tipagem estrutural declarativa de identidade visual contendo `id`, `name`, `description`, `version: string`, `tokens: DesignTokens`, `isDefault?: boolean`, `status?: 'active' | 'draft' | 'archived'`, `createdAt?: string` e `updatedAt?: string`.
    - **Design Tokens Canônicos (`DesignTokens`):** Agrupamento tipado e declarativo contendo tokens de cores (`ColorTokens`), tipografia (`TypographyTokens`), espaçamento (`SpacingTokens`), bordas (`BorderTokens`) e elevações (`ElevationTokens`).
    - **Tokens de Cores Estruturados (`ColorTokens`):** Paleta tipada e segura (`primary`, `secondary`, `accent`, `background`, `surface`, `text`, `muted`, `border`, `success?`, `warning?`, `error?`), eliminando strings arbitrárias de CSS espalhadas.
    - **Tokens de Tipografia (`TypographyTokens`):** Metadados puramente estruturais (`fontFamilyHeading`, `fontFamilyBody`, `fontSizeBase`, `fontSizeHeading`, `fontWeightNormal`, `fontWeightBold`, `lineHeightBase?`, `letterSpacingBase?`) sem injeção de fontes ou runtime.
    - **Tokens de Espaçamento e Bordas (`SpacingTokens`, `BorderTokens`, `ElevationTokens`):** Dimensões, padding e raios declarativos padronizados.
    - **Relação com Templates:** `TemplateDefinition` associado opcionalmente a `themeId?: string` e `theme?: VisualTheme`, mantendo a relação puramente estrutural e declarativa.
    - **Preservação Canônica de Blocos e Seções:** `BlockConfig` e `SectionConfig` rigorosamente preservados em sua integridade; separação estrita entre `BlockInstance.data` e `BlockInstance.config` mantida inviolável.
    - **Isolamento de Domínio no Core:** Criação do módulo declarativo `src/core/theme.ts` e exportação unificada no `src/core/index.ts`.
    - **Proibição Absoluta de Runtime/Executáveis:** Ausência completa de `ThemeEngine`, `ThemeProvider`, `ThemeResolver`, `ThemeLoader`, `ThemeRegistry`, `ThemeRuntime`, `ThemeFactory`, geradores de CSS, CSS livre, HTML livre, JavaScript, scripts ou qualquer código executável.
  - `src/App.tsx` rigorosamente intocado; nenhuma dependência externa adicionada, modificada ou removida.
- **Arquivos modificados:**
  - `src/types/index.ts`
  - `src/core/index.ts`
  - `CHANGELOG.md`
- **Arquivos criados:**
  - `src/core/theme.ts`
- **Testes realizados:**
  - `npx tsc --noEmit` via `lint_applet`: 0 erros.
  - `npm run build` via `compile_applet`: compilação bem-sucedida.
  - Verificação de ausência de geradores de CSS, componentes React ou engines.
- **Status:** CONCLUÍDO.

---

## [Fase 7 — Contrato Canônico de Templates e Estrutura Visual do CMS]
- **Data:** 2026-09-06
- **Fase:** Fase 7 — Contrato Canônico de Templates e Estrutura Visual do CMS
- **Alteração:**
  - Estabelecimento do contrato declarativo e canônico de templates do CMS:
    - **Contrato Canônico (`TemplateDefinition`):** Tipagem estrutural declarativa de um template contendo `id`, `name`, `description`, `category: TemplateCategory`, `version: string`, `thumbnailUrl?: string`, `pages: TemplatePageDefinition[]`, `status?: 'draft' | 'active' | 'archived'`, `createdAt?: string` e `updatedAt?: string`.
    - **Categorias Declarativas (`TemplateCategory`):** Categorias canônicas definidas como `'traditional' | 'contemporary' | 'revival' | 'minimalist' | 'community'`.
    - **Composição de Páginas (`TemplatePageDefinition`):** Representação estrutural de cada página (`id`, `slug`, `title`, `description?`, `isHome?`, `sections: SectionInstance[]`), preservando integralmente e reutilizando sem duplicação a hierarquia canônica existente: `sections[] -> blocks[] -> data`.
    - **Cadeia Arquitetural Oficial:**
      `Template -> Page Composition (pages[]) -> Sections -> Blocks -> BlockDefinition -> BlockDataSchema -> BlockInstance.data`.
    - **Isolamento de Domínio no Core:** Criação do módulo declarativo `src/core/templates.ts` e exportação unificada em `src/core/index.ts`.
    - **Preservação Canônica de Blocos e Dados:** Zero duplicações de `BlockType`, `BLOCK_CATALOG`, `BlockDefinition` ou `Page`. Separação estrita de `BlockInstance.data` vs `BlockInstance.config` mantida intacta.
    - **Proibição Absoluta de Runtime/Executáveis:** Ausência completa de `TemplateEngine`, `TemplateRenderer`, `TemplateLoader`, `TemplateResolver`, componentes React, HTML livre, CSS livre, JavaScript ou banco de dados/APIs.
  - `src/App.tsx` rigorosamente intocado, nenhuma dependência externa adicionada ou modificada.
- **Arquivos modificados:**
  - `src/types/index.ts`
  - `src/core/index.ts`
  - `CHANGELOG.md`
- **Arquivos criados:**
  - `src/core/templates.ts`
- **Testes realizados:**
  - `npx tsc --noEmit` via `lint_applet`: 0 erros.
  - `npm run build` via `compile_applet`: compilação bem-sucedida.
  - Verificação de ausência de componentes funcionais ou engines.
- **Status:** CONCLUÍDO.

---

## [Fase 6 — Contrato Canônico de Composição e Estrutura das Páginas]
- **Data:** 2026-09-06
- **Fase:** Fase 6 — Contrato Canônico de Composição e Estrutura das Páginas
- **Alteração:**
  - Consolidação e validação formal do contrato canônico de composição estrutural das páginas do CMS:
    - **Hierarquia Canônica Imutável:** Reafirmação estrita da única composição estrutural válida:
      `Page └── sections: SectionInstance[] └── blocks: BlockInstance[] └── data: BlockDataRecord`.
    - **Contrato de Page:** Preservação estrita dos metadados estruturais essenciais (`id`, `tenantId`, `title`, `slug`, `status`, `order`, `seo`, `sections`, `publishedAt`, `createdAt`, `updatedAt`) sem acoplamento a renderizadores, editores ou HTML.
    - **Contrato de SectionInstance:** Preservação da unidade intermediária entre Page e Block (`id`, `title`, `order`, `isVisible`, `backgroundColor`, `config: SectionConfig`, `blocks: BlockInstance[]`), com `blocks` exclusivamente contidos na seção.
    - **Contrato de BlockInstance:** Preservação estrita da separação entre `config: BlockConfig` (apresentação permitida) e `data: BlockDataRecord` (dados editáveis baseados em `BlockDataSchema`), com `order` e `isVisible`.
    - **Ordem Determinística:** Garantida formalmente pela indexação sequencial nativa dos arrays estruturais (`sections[]` e `blocks[]`) combinada com o atributo `order: number`, sem necessidade de posições redundantes ou ordenadores executáveis.
    - **Contrato Conceitual de Template (`PageTemplate`):** Definição tipada de `PageTemplate` como estrutura inicial para criação de páginas (`sections: SectionInstance[]`), sem substituir a hierarquia canônica e sem motores/renderizadores de template.
    - **Proibição Absoluta de Código Executável:** Ausência de `html`, `css`, `javascript`, scripts, `customClasses`, `renderer` ou componentes React para Page, Section, Block ou Template.
  - Re-exportação na fronteira de domínio em `src/core/pages.ts` e acesso unificado via `src/core/index.ts`.
  - Preservação estrita de `src/App.tsx`, dependências intocadas e ausência de qualquer camada de execução ou banco de dados.
- **Arquivos modificados:**
  - `src/types/index.ts`
  - `src/core/pages.ts`
  - `CHANGELOG.md`
- **Arquivos criados:**
  - *Nenhum arquivo foi criado.*
- **Testes realizados:**
  - `npx tsc --noEmit` via `lint_applet`: 0 erros.
  - `npm run build` via `compile_applet`: compilação com sucesso.
  - Auditoria completa da árvore `Page → sections[] → blocks[] → data`.
- **Status:** CONCLUÍDO.

---

## [Fase 5 — Definição Canônica dos Blocos do CMS]
- **Data:** 2026-09-06
- **Fase:** Fase 5 — Definição Canônica dos Blocos do CMS
- **Alteração:**
  - Estabelecimento da definição canônica e declarativa dos 15 blocos estruturais do CMS:
    - **Contrato Canônico (`BlockDefinition`):** Tipagem estrita de cada bloco contendo `type: BlockType`, `name: string`, `description: string`, `category: BlockCategory` e `dataSchema?: BlockDataSchema`.
    - **Categorias Canônicas (`BlockCategory`):** Preservadas as categorias declaradas no catálogo original: `'navigation'`, `'hero'`, `'content'`, `'church_specific'`, `'footer'`.
    - **Relação Arquitetural Oficial:** `BLOCK TYPE -> BLOCK DEFINITION -> DATA SCHEMA -> BLOCK DATA`.
    - **Fonte Única da Verdade:** `BLOCK_CATALOG` tipado como `Record<BlockType, BlockDefinition>`, com `BLOCK_DEFINITIONS` como alias canônico, eliminando qualquer duplicação manual ou divergência entre tipos.
    - **Associação de Schemas Genéricos Seguros:** Schemas genéricos definidos para blocos de layout e conteúdo (`HERO_DATA_SCHEMA`, `ABOUT_DATA_SCHEMA`, `CONTACT_DATA_SCHEMA`, `FOOTER_DATA_SCHEMA`) utilizando exclusivamente os campos tipados da Fase 4.
    - **Adiamento Deliberado de Schemas de Módulos Futuros:** Schemas de módulos específicos (doações, cultos, sermões, transmissão ao vivo, pedidos de oração, eventos, notícias, ministérios, liderança, galeria) mantidos deliberadamente opcionais/ausentes para não antecipar contratos de regras de negócio futuras.
    - **Proibição de Componentes e Runtime:** `BlockDefinition` é 100% livre de referências a React, JSX, métodos render/renderer, classes, CSS ou funções operacionais.
  - Re-exportação na fronteira arquitetural `src/core/blocks.ts` e acesso unificado via `src/core/index.ts`.
  - Preservação estrita de `src/App.tsx`, ausência de banco de dados, APIs, backend, renderizadores ou dependências novas.
- **Arquivos modificados:**
  - `src/types/index.ts`
  - `src/constants/index.ts`
  - `src/core/blocks.ts`
  - `CHANGELOG.md`
- **Arquivos criados:**
  - *Nenhum arquivo foi criado.*
- **Testes realizados:**
  - `npx tsc --noEmit` via `lint_applet`: 0 erros.
  - `npm run build` via `compile_applet`: compilação com sucesso.
  - Auditoria dos 15 blocos canônicos e ausência de componentes funcionais.
- **Status:** CONCLUÍDO.

---

## [Fase 4 — Contrato do Sistema de Blocos e Dados Editáveis]
- **Data:** 2026-09-06
- **Fase:** Fase 4 — Contrato do Sistema de Blocos e Dados Editáveis
- **Alteração:**
  - Estabelecimento de contratos conceituais e tipados para representação e controle de dados editáveis dos blocos do CMS:
    - **Tipos de Campos Permitidos (`EditableFieldType`):** `text`, `textarea`, `rich_text`, `image`, `url`, `button`, `boolean`, `number`, `list`, `group`.
    - **Proteção Absoluta contra Código Arbitrário:** Ausência total de `html`, `raw_html`, `javascript`, `script`, `css`, `custom_css`, `custom_class` ou `code`.
    - **Rich Text Seguro:** O tipo `rich_text` foi documentado e estruturado exclusivamente como representação conceitual de conteúdo rico seguro e validado, nunca como HTML livre ou tags arbitrárias.
    - **Contrato Base de Campo (`EditableFieldBase`):** Padronização de `id`, `type`, `label`, `description`, `required` e `defaultValue`.
    - **Contratos Específicos:** Definição tipada para campos de texto simples e longo com limites, URL com protocolos permitidos (`https`, `http`, `mailto`, `tel`), imagem com requisitos de acessibilidade (`altTextRequired`), número com limites e passos, booleano, repetição estruturada (`list`) e agrupamentos conceituais (`group`).
    - **Button como Dados:** `button` estruturado exclusivamente como dados conceituais de botão (`label`, `url`, `openInNewTab`), sem componente React ou renderização funcional.
    - **Schema de Dados do Bloco (`BlockDataSchema`):** Contrato descritivo que define quais campos permitidos cada bloco pode editar (`Block Type -> Data Schema -> Typed Data`).
    - **Redução de 'any'/'unknown':** Introdução de `BlockDataValue` e `BlockDataRecord`, tipando com segurança o generic `BlockInstance<TData = BlockDataRecord>` e separando formalmente a definição do schema dos dados reais do usuário.
  - Re-exportação dos novos contratos na fronteira de domínio em `src/core/blocks.ts` e acesso unificado via `src/core/index.ts`.
  - Preservação estrita da arquitetura oficial (`Page └── sections[] └── blocks[] └── config/data`), ausência de `Page.blocks`, ausência de `customClasses`, integridade de `src/App.tsx` e ausência de validadores operacionais, APIs ou bibliotecas adicionais.
- **Arquivos modificados:**
  - `src/types/index.ts`
  - `src/core/blocks.ts`
  - `CHANGELOG.md`
- **Arquivos criados:**
  - *Nenhum arquivo foi criado.*
- **Testes realizados:**
  - `npx tsc --noEmit` via `lint_applet`: 0 erros.
  - `npm run build` via `compile_applet`: compilação com sucesso.
  - Auditoria de segurança de tipos proibidos e integridade estrutural.
- **Status:** CONCLUÍDO.

---

## [Fase 3 — Núcleo Estrutural e Organização Interna do CMS]
- **Data:** 2026-09-06
- **Fase:** Fase 3 — Núcleo Estrutural e Organização Interna do CMS
- **Alteração:**
  - Estabelecimento da organização interna declarativa e das fronteiras arquiteturais do CMS Core:
    - **Content (`src/core/content.ts`):** Fronteira estrutural do conteúdo geral e regras de composição hierárquica imutável (`Tenant └── Pages └── Sections └── Blocks └── Config/Data`).
    - **Pages (`src/core/pages.ts`):** Fronteira arquitetural das páginas estruturadas do CMS, reforçando a regra de que blocos pertencem exclusivamente a seções (`Page.blocks` ausente).
    - **Sections (`src/core/sections.ts`):** Fronteira de seções de agrupamento na página, atuando estritamente como contêineres estruturais de blocos.
    - **Blocks (`src/core/blocks.ts`):** Fronteira de blocos atômicos protegidos contra injeções de código ou CSS livre (`customClasses` ausente), independente de Page ou Section.
    - **Navigation (`src/core/navigation.ts`):** Fronteira de menus e navegação institucional (header, footer, mobile drawer).
    - **Media (`src/core/media.ts`):** Fronteira da biblioteca de arquivos e mídias vinculadas ao tenantId proprietário.
    - **Modules (`src/core/modules.ts`):** Fronteira de integração declarativa do Core com os módulos eclesiais específicos e o catálogo conceituado.
  - Reorganização do ponto central `src/core/index.ts` para expor organizadamente cada domínio arquitetural sem duplicar contratos com `src/types/index.ts`.
  - Documentação reforçada em `src/modules/index.ts` assegurando a total ausência de registro dinâmico, hooks operacionais ou ativadores em tempo de execução.
  - Preservação estrita da arquitetura oficial, integridade de `src/App.tsx`, ausência de banco de dados, APIs, backend, engines ou dependências novas.
- **Arquivos criados:**
  - `src/core/content.ts`
  - `src/core/pages.ts`
  - `src/core/sections.ts`
  - `src/core/blocks.ts`
  - `src/core/navigation.ts`
  - `src/core/media.ts`
  - `src/core/modules.ts`
- **Arquivos modificados:**
  - `src/core/index.ts`
  - `src/modules/index.ts`
  - `CHANGELOG.md`
- **Testes realizados:**
  - `npx tsc --noEmit` via `lint_applet`: 0 erros.
  - `npm run build` via `compile_applet`: compilação com sucesso.
  - Auditoria completa de não-duplicação e ausência de lógica operacional.
- **Status:** CONCLUÍDO.

---

## [Fase 2 — Modelo de Dados e Contratos do CMS]
- **Data:** 2026-09-05
- **Fase:** Fase 2 — Modelo de Dados e Contratos do CMS
- **Alteração:**
  - Estabelecimento sólido e tipado dos contratos conceituais para as entidades fundamentais do CMS:
    - **Identidade / Base:** Identificadores tipados (`TenantId`, `BlockId`, `SectionId`, `PageId`, `UserId`, `MediaId`, `NavigationMenuId`) e timestamps padronizados (`createdAt`, `updatedAt` em formato ISO 8601).
    - **Status Conceituais:** Tipagens estritas de estado (`TenantStatus`, `PageStatus`).
    - **Igreja / Tenant & Conteúdo Institucional:** Contrato de `Tenant` enriquecido com status e `ChurchProfile` tipado (endereço estruturado, contatos e links de redes sociais).
    - **Navegação:** Novos contratos conceituais para menus e itens de navegação com suporte a hierarquia de submenus (`NavigationMenu`, `NavigationItem`, `MenuLocation`).
    - **Biblioteca de Mídia:** Contrato conceitual enriquecido para arquivos vinculados por tenant (`MediaItem`, `MediaType`, `MediaDimensions`).
    - **Motor Estrutural de Conteúdo:** Preservação estrita da hierarquia `Page └── sections[] └── blocks[] └── config/data`, mantendo `Page.blocks` ausente e `BlockConfig` sem `customClasses`.
    - **Separação Modelo vs. Implementação:** Contratos 100% livres de funções operacionais, chamadas de API, acessos a banco de dados ou lógica de negócio.
  - Atualização dos pontos de entrada estruturais em `src/core/index.ts` e `src/modules/index.ts`.
  - Preservação integral de `src/App.tsx`, dependências, design e da ausência de banco de dados, APIs ou lógica funcional.
- **Arquivos modificados:**
  - `src/types/index.ts`
  - `src/core/index.ts`
  - `src/modules/index.ts`
  - `CHANGELOG.md`
- **Testes realizados:**
  - `npx tsc --noEmit` via `lint_applet`: 0 erros.
  - `npm run build` via `compile_applet`: compilação com sucesso.
  - Auditoria estrutural das entidades e contratos.
- **Status:** CONCLUÍDO.

---

## [Fase 1 — Auditoria e Correção Arquitetural]
- **Data:** 2026-09-05
- **Fase:** Fase 1 — Fundação Técnica e Modular (Auditoria Cirúrgica)
- **Alteração:**
  - Correção rigorosa da hierarquia de conteúdo na interface `Page`: eliminada a redundância de blocos diretos na página; `Page` agora contém exclusivamente `sections: SectionInstance[]`, com os blocos pertencendo estruturalmente a cada seção (`Page └── sections[] └── blocks[]`).
  - Remoção de `customClasses?: string` da interface `BlockConfig`, eliminando qualquer via de CSS livre e assegurando apenas configurações tipadas e seguras.
  - Transformação de `src/modules/index.ts` em ponto de entrada estrutural puramente declarativo, removendo funções operacionais prematuras (`getAvailableChurchModules`, `isModuleEnabledForTenant`) e evitando qualquer lógica funcional multi-tenant.
  - Alinhamento de `src/core/index.ts` para documentar explicitamente seu papel como baseline estrutural de contratos da Fase 1, sem sugerir núcleo funcional em execução.
  - Revisão de `BLOCK_CATALOG` em `src/constants/index.ts`, mantendo-o estritamente em nível conceitual (nome, descrição e categoria) e removendo especificações prematuras de configurações de módulos futuros (`pixKey`, `chatEnabled`, `embedUrl`, etc.).
  - Correção no `CHANGELOG.md` garantindo a demarcação explícita entre Fase 0 (Inicialização, Arquitetura e Proteção) e Fase 1 (Fundação Técnica e Modular).
  - Preservação total de `src/App.tsx`, dependências e integridade da aplicação.
- **Arquivos modificados:**
  - `src/types/index.ts`
  - `src/modules/index.ts`
  - `src/core/index.ts`
  - `src/constants/index.ts`
  - `CHANGELOG.md`
- **Testes realizados:**
  - `tsc --noEmit` via `lint_applet`: 0 erros.
  - `compile_applet` (`npm run build`): compilação com sucesso.
  - Verificação de não-regressão e conformidade estrutural.
- **Status:** CONCLUÍDO.

---

## [Utilitário — Recurso de Exportação Direta em ZIP]
- **Data:** 2026-09-05
- **Fase:** Utilitário de Exportação e Portabilidade (Independente das Fases)
- **Alteração:**
  - Criação de endpoint dedicado `/api/download-project-zip` via plugin Vite para geração em tempo real do arquivo `.zip` com compressão Deflate.
  - Inclusão de botões diretos de download com atributo `download="cms-visual-igrejas.zip"` na barra superior e no banner principal de `src/App.tsx`.
  - Exclusão automática de pastas geradas/pesadas (`node_modules`, `dist`, `.git`), entregando um zip leve e completo de código-fonte e documentação.
- **Arquivos modificados:**
  - `vite.config.ts` (adicionado `zipDownloadPlugin` com middleware `/api/download-project-zip`)
  - `package.json` (adicionado `jszip`)
  - `src/App.tsx` (adicionados botões de download)
  - `CHANGELOG.md` (atualizado)
- **Testes realizados:**
  - Teste automatizado de download com curl (`curl -s -I http://localhost:3000/api/download-project-zip`): status 200 OK e content-type `application/zip`.
  - Teste de integridade de descompactação (`unzip -l`): 31 arquivos presentes, incluindo todos os documentos Markdown e o código TypeScript.
  - `lint_applet` (`tsc --noEmit`) e `compile_applet`: aprovados com 0 erros.
- **Status:** CONCLUÍDO E TESTADO.

---

## [Fase 1 — Fundação Técnica e Modular]
- **Data:** 2026-09-05
- **Fase:** Fase 1 — Fundação Técnica e Modular
- **Alteração:**
  - Preservação integral da interface do usuário existente em `src/App.tsx`.
  - Preparação e enriquecimento dos tipos centrais em `src/types/index.ts` com a hierarquia `Páginas → Seções → Blocos → Configurações → Dados`, ações granulares de RBAC (`PermissionAction`) e entidade protegida de mídia (`MediaItem`).
  - Criação do catálogo oficial de constantes em `src/constants/index.ts` (papéis e níveis de usuários, catálogo de módulos eclesiais, catálogo de 15 blocos estruturais suportados e variantes permitidas de layout/tema).
  - Organização da estrutura modular com pontos de entrada em `src/core/index.ts` e `src/modules/index.ts`.
  - Verificação e complementação de `.env.example` com variáveis operacionais de runtime (`PORT`, `NODE_ENV`) sem expor credenciais.
- **Arquivos criados:**
  - `src/constants/index.ts`
  - `src/core/index.ts`
  - `src/modules/index.ts`
- **Arquivos modificados:**
  - `src/types/index.ts`
  - `/.env.example`
  - `CHANGELOG.md`
- **Testes realizados:**
  - Verificação de tipos estáticos TypeScript (`tsc --noEmit` via `lint_applet`): 0 erros.
  - Compilação completa da aplicação (`compile_applet`): build bem-sucedido.
  - Verificação de não-regressão na interface existente.
- **Status:** CONCLUÍDO.

---

## [Fase 0 — Auditoria e Validação Física] — Conclusão Formal da Fase 0
- **Data:** 2026-09-05
- **Fase:** Fase 0 — Inicialização, Arquitetura e Proteção (Auditoria Cirúrgica)
- **Alteração:**
  - Auditoria física da árvore de arquivos na raiz do projeto.
  - Confirmação da existência independente dos 7 arquivos Markdown essenciais.
  - Expansão de `ARCHITECTURE.md` para detalhar formalmente as 11 camadas (CMS Core, Multi-Tenant, Users, Roles, Permissions, Pages, Blocks, Media, Templates, Public Site, Modules), o princípio vertical `PÁGINAS ↓ SEÇÕES ↓ BLOCOS ↓ CONFIGURAÇÕES ↓ DADOS` e o princípio de imutabilidade de HTML livre.
  - Atualização de `PROJECT_GUARD.md` garantindo menção explícita a análises de impacto e testes de regressão em cada uma das 9 áreas críticas.
  - Alinhamento da checklist de 8 itens em `TESTING.md`.
  - Inclusão formal de "Tecnologias Utilizadas" e "Desenvolvimento por Fases" no `README.md`.
- **Arquivos modificados:**
  - `ARCHITECTURE.md` (corrigido/expandido)
  - `PROJECT_GUARD.md` (corrigido/detalhado)
  - `TESTING.md` (corrigido/alinhado)
  - `README.md` (corrigido/expandido)
  - `CHANGELOG.md` (atualizado)
- **Testes realizados:**
  - Inspeção física via sistema de arquivos (`list_dir`).
  - Verificação de integridade e conteúdo (`view_file`).
  - Verificação de compilação sem erros (`compile_applet`).
  - Verificação de tipagem estática TypeScript (`lint_applet` / `tsc --noEmit`).
- **Status:** FASE 0 CONCLUÍDA E AUDITADA (Pronto para aguardar autorização para a Fase 1).

---

## [Fase 0] — Fundação Documental, Arquitetural e Estrutural
- **Data:** 2026-09-04
- **Fase:** Fase 0 — Inicialização, Arquitetura e Proteção
- **Funcionalidade:**
  - Definição formal das diretrizes para agentes e Modo Cirúrgico (`AGENTS.md`).
  - Estabelecimento do guardião de áreas críticas do sistema (`PROJECT_GUARD.md`).
  - Documentação da arquitetura oficial em camadas e modelo de blocos (`ARCHITECTURE.md`).
  - Definição do fluxo de 8 etapas obrigatórias de desenvolvimento (`DEVELOPMENT_RULES.md`).
  - Criação do protocolo e checklist mínimo de testes (`TESTING.md`).
  - Criação do manual do projeto (`README.md`).
  - Criação dos contratos essenciais de tipos TypeScript para Tenant, Páginas, Blocos e Módulos (`src/types/index.ts`).
  - Atualização do painel base da Fase 0 com monitor de prontidão e conformidade (`src/App.tsx`).
- **Arquivos principais alterados / criados:**
  - `metadata.json` (atualizado com nome e descrição oficial)
  - `index.html` (sincronizado com metadados)
  - `AGENTS.md` (criado)
  - `PROJECT_GUARD.md` (criado)
  - `ARCHITECTURE.md` (criado)
  - `DEVELOPMENT_RULES.md` (criado)
  - `TESTING.md` (criado)
  - `CHANGELOG.md` (criado)
  - `README.md` (criado)
  - `src/types/index.ts` (criado)
  - `src/App.tsx` (atualizado com visualização de status da Fase 0)
- **Testes realizados:**
  - Validação estática de tipos TypeScript.
  - Verificação de compilação sem erros (`compile_applet`).
  - Confirmação de checklist de testes de não-regressão.
- **Status:** CONCLUÍDO (Pronto para solicitação da Fase 1).
