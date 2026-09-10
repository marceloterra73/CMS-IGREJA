/**
 * Exportação consolidada dos Schemas Canônicos do Banco de Dados
 * CMS Visual para Igrejas — Fundação de Persistência (Fase 57)
 *
 * Todas as tabelas vinculadas a congregações possuem isolamento estrito por tenant_id,
 * integridade referencial em cascata com a tabela tenants e índices compostos.
 */

// 1. Núcleo Multi-tenant & Usuários
export * from './tenants.js';
export * from './users.js';

// 2. Configurações Globais & Institucionais
export * from './settings.js';

// 3. Identidade Visual & Design Tokens
export * from './themes.js';

// 4. Motor de Conteúdo Estruturado (Páginas, Seções, Blocos)
export * from './pages.js';

// 5. Navegação & Mídia
export * from './navigation.js';
export * from './media.js';

// 6. Módulos Eclesiais de Conteúdo
export * from './modules.js';

// 7. Domínios, Endereços e Redirecionamentos
export * from './domains.js';

// 8. Formulários do Site e Submissões
export * from './forms.js';
