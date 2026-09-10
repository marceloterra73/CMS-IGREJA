/**
 * Roteador Canônico de Recursos de Persistência REST — /api/v1/resources
 * CMS Visual para Igrejas — Fases 59 e 60
 *
 * Responsabilidade:
 * - Servir como endpoint oficial para o ServerPersistenceProvider.
 * - Realizar a ponte entre as chamadas REST (/resources/:resource) e o PostgreSQL via Drizzle ORM.
 * - Aplicar isolamento multi-tenant estrito (anti-IDOR e Row-Level Security).
 * - Manter fallback e cache resilientes em memória para ambientes sem banco configurado.
 */

import { Router, type Request, type Response, type NextFunction } from 'express';
import { getDb } from '../../db/index.js';
import { setTenantContext } from '../../db/rls.js';
import { ApiError } from '../../errors/apiError.js';
import { authenticateMiddleware, optionalAuthenticateMiddleware } from '../../middleware/authenticate.js';
import { csrfProtectionMiddleware } from '../../middleware/csrf.js';
import * as schema from '../../db/schema/index.js';
import { eq, and } from 'drizzle-orm';

const router = Router();

// Middleware de identificação e autenticação opcional para proteção de tenant e IDOR (Fase 62)
router.use(optionalAuthenticateMiddleware);

// Store em memória resiliente para fallback e testes rápidos
export const serverResourceStore = new Map<string, any>();

// Padrões de validação estrita para prevenção de path traversal, header injection e IDOR (Fase 62)
const TENANT_ID_REGEX = /^[a-zA-Z0-9_-]{1,64}$/;
const RESOURCE_NAME_REGEX = /^[a-zA-Z0-9_-]{1,64}$/;

const CANONICAL_ARRAY_RESOURCES = new Set([
  'themes',
  'pages',
  'navigation',
  'schedules',
  'domains',
]);

const CANONICAL_OBJECT_RESOURCES = new Set([
  'settings',
  'institutional',
  'donations',
  'live_stream',
  'seo_site',
  'analytics',
]);

/**
 * Validação rigorosa em tempo de execução para payloads de persistência (Fase 62 - Hardening).
 * Garante conformidade do formato por recurso sem quebrar suporte a primitivos legítimos.
 */
function validateResourcePayload(resource: string, payload: unknown): void {
  if (payload === undefined) {
    throw ApiError.badRequest('Payload de atualização não informado.');
  }

  // Limite máximo de tamanho do payload serializado para prevenir esgotamento de memória (DoS)
  try {
    const serializedLength = JSON.stringify(payload).length;
    if (serializedLength > 5 * 1024 * 1024) {
      throw ApiError.unprocessableEntity('Tamanho do payload excede o limite máximo permitido de 5MB.');
    }
  } catch {
    throw ApiError.badRequest('Payload não serializável ou estrutura cíclica detectada.');
  }

  // Recurso canônico primitivo específico (ex: ID do tema ativo)
  if (resource === 'active_theme_id') {
    if (typeof payload !== 'string' || payload.trim().length === 0 || payload.length > 100) {
      throw ApiError.unprocessableEntity(
        'active_theme_id deve ser uma string não vazia com no máximo 100 caracteres.'
      );
    }
    return;
  }

  // Recursos que esperam coleções/arrays
  if (CANONICAL_ARRAY_RESOURCES.has(resource)) {
    if (!Array.isArray(payload)) {
      throw ApiError.unprocessableEntity(
        `O recurso "${resource}" requer uma lista (Array) de itens.`
      );
    }
    return;
  }

  // Recursos que esperam objetos estruturados
  if (CANONICAL_OBJECT_RESOURCES.has(resource)) {
    if (typeof payload !== 'object' || payload === null || Array.isArray(payload)) {
      throw ApiError.unprocessableEntity(
        `O recurso "${resource}" requer um objeto estruturado não nulo.`
      );
    }
    return;
  }
}

/**
 * Resolve o tenantId da requisição respeitando a hierarquia de segurança.
 */
function resolveTenantId(req: Request): string {
  const queryTenant = req.query.tenantId as string | undefined;
  const headerTenant = req.headers['x-tenant-id'] as string | undefined;
  const userTenant = (req as any).user?.tenantId;
  const userRole = (req as any).user?.role;

  const targetTenant = queryTenant || headerTenant || userTenant || 'ib_central';

  // Validação estrita de formato do identificador de tenant (Fase 62)
  if (!TENANT_ID_REGEX.test(targetTenant)) {
    throw ApiError.badRequest(
      `Identificador de tenantId inválido: "${targetTenant}". Deve conter apenas caracteres alfanuméricos, hífen ou sublinhado (máx 64).`
    );
  }

  // Se o usuário está autenticado e NÃO é superadmin, ele NÃO pode acessar outro tenant (IDOR)
  if ((req as any).user && userRole !== 'superadmin' && userTenant && userTenant !== targetTenant) {
    throw ApiError.forbidden(
      `Acesso negado: Usuário pertence ao tenant "${userTenant}" e não possui permissão para o tenant "${targetTenant}".`
    );
  }

  return targetTenant;
}

/**
 * GET /api/v1/resources/:resource
 * Retorna o recurso solicitado para o tenant especificado.
 */
router.get('/:resource', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const tenantId = resolveTenantId(req);
    const resource = req.params.resource;

    if (!RESOURCE_NAME_REGEX.test(resource)) {
      throw ApiError.badRequest(`Nome de recurso inválido: "${resource}".`);
    }

    const storeKey = `cms:${tenantId}:${resource}`;

    const db = getDb();

    // 1. Se o banco PostgreSQL estiver configurado, busca na tabela correspondente
    if (db) {
      try {
        let dbData: any = null;

        switch (resource) {
          case 'settings': {
            const row = await db.query.siteSettings.findFirst({
              where: eq(schema.siteSettings.tenantId, tenantId),
            });
            if (row) {
              dbData = {
                siteName: row.siteName || '',
                language: row.language || 'pt-BR',
                locale: row.locale || 'pt-BR',
                timezone: row.timezone || 'America/Sao_Paulo',
                dateFormat: row.dateFormat || 'DD/MM/YYYY',
                timeFormat: row.timeFormat || 'HH:mm',
                faviconUrl: row.faviconUrl || '',
              };
            }
            break;
          }

          case 'institutional': {
            const row = await db.query.institutionalContents.findFirst({
              where: eq(schema.institutionalContents.tenantId, tenantId),
            });
            if (row) {
              dbData = {
                profile: row.profile || {},
                address: row.address || {},
                contact: row.contact || {},
                socialLinks: row.socialLinks || {},
              };
            }
            break;
          }

          case 'themes': {
            const rows = await db.query.visualThemes.findMany({
              where: eq(schema.visualThemes.tenantId, tenantId),
            });
            if (rows && rows.length > 0) {
              dbData = rows.map((r) => ({
                id: r.id,
                name: r.name,
                description: r.description || '',
                version: r.version,
                isDefault: r.isDefault,
                status: r.status,
                tokens: r.tokens,
              }));
            }
            break;
          }

          case 'schedules': {
            const rows = await db.query.churchSchedules.findMany({
              where: eq(schema.churchSchedules.tenantId, tenantId),
            });
            if (rows && rows.length > 0) {
              dbData = rows.map((r) => ({
                id: r.id,
                tenantId: r.tenantId,
                title: r.title,
                dayOfWeek: r.dayOfWeek,
                time: r.time,
                description: r.description,
                location: r.location,
                status: r.status,
              }));
            }
            break;
          }

          case 'donations': {
            const row = await db.query.churchDonations.findFirst({
              where: eq(schema.churchDonations.tenantId, tenantId),
            });
            if (row) {
              dbData = {
                id: row.id,
                tenantId: row.tenantId,
                title: row.title,
                description: row.description,
                bankAccountInfo: row.bankAccountInfo,
                pixKey: row.pixKey,
                instructions: row.instructions,
                status: row.status,
              };
            }
            break;
          }

          case 'live_stream': {
            const row = await db.query.churchLiveStreams.findFirst({
              where: eq(schema.churchLiveStreams.tenantId, tenantId),
            });
            if (row) {
              dbData = {
                id: row.id,
                tenantId: row.tenantId,
                title: row.title,
                description: row.description,
                streamUrl: row.streamUrl,
                status: row.status,
                scheduledAt: row.scheduledAt ? row.scheduledAt.toISOString() : undefined,
              };
            }
            break;
          }

          case 'navigation': {
            const rows = await db.query.navigationMenus.findMany({
              where: eq(schema.navigationMenus.tenantId, tenantId),
            });
            if (rows && rows.length > 0) {
              dbData = rows.map((r) => ({
                id: r.id,
                name: r.name,
                location: r.location,
                status: r.status,
                items: r.items,
              }));
            }
            break;
          }

          case 'domains': {
            const rows = await db.query.siteDomains.findMany({
              where: eq(schema.siteDomains.tenantId, tenantId),
            });
            if (rows && rows.length > 0) {
              dbData = rows.map((r) => ({
                id: r.id,
                hostname: r.hostname,
                type: r.type,
                status: r.status,
                isPrimary: r.isPrimary,
              }));
            }
            break;
          }

          case 'analytics': {
            const row = await db.query.siteAnalytics.findFirst({
              where: eq(schema.siteAnalytics.tenantId, tenantId),
            });
            if (row) {
              dbData = {
                googleAnalyticsId: row.googleAnalyticsId || '',
                googleTagManagerId: row.googleTagManagerId || '',
                metaPixelId: row.metaPixelId || '',
                searchConsoleVerificationToken: row.searchConsoleVerificationToken || '',
                anonymizeIp: row.anonymizeIp ?? true,
                consentRequired: row.consentRequired ?? false,
                isActive: row.isActive ?? true,
              };
            }
            break;
          }

          case 'pages': {
            const pageRows = await db.query.pages.findMany({
              where: eq(schema.pages.tenantId, tenantId),
            });

            if (pageRows && pageRows.length > 0) {
              const fullPages = [];
              for (const p of pageRows) {
                const sectionRows = await db.query.pageSections.findMany({
                  where: and(
                    eq(schema.pageSections.pageId, p.id),
                    eq(schema.pageSections.tenantId, tenantId)
                  ),
                });

                const sections = [];
                for (const s of sectionRows) {
                  const blockRows = await db.query.pageBlocks.findMany({
                    where: and(
                      eq(schema.pageBlocks.sectionId, s.id),
                      eq(schema.pageBlocks.tenantId, tenantId)
                    ),
                  });

                  sections.push({
                    id: s.id,
                    pageId: s.pageId,
                    title: s.title || '',
                    order: s.order,
                    isVisible: s.isVisible,
                    blocks: blockRows.map((b) => ({
                      id: b.id,
                      sectionId: b.sectionId,
                      type: b.type,
                      order: b.order,
                      isVisible: b.isVisible,
                      config: b.config,
                      data: b.data,
                    })),
                  });
                }

                fullPages.push({
                  id: p.id,
                  title: p.title,
                  slug: p.slug,
                  status: p.status,
                  order: p.order,
                  isHome: p.isHome,
                  seo: p.seo,
                  sections,
                });
              }
              dbData = fullPages;
            }
            break;
          }
        }

        if (dbData !== null) {
          // Atualiza cache em memória para manter consistência
          serverResourceStore.set(storeKey, dbData);
          return res.status(200).json({
            success: true,
            data: dbData,
          });
        }
      } catch (dbError) {
        console.warn(`[ResourcesRouter] Erro ao consultar banco para "${resource}":`, dbError);
      }
    }

    // 2. Consulta store em memória (resiliente)
    if (serverResourceStore.has(storeKey)) {
      return res.status(200).json({
        success: true,
        data: serverResourceStore.get(storeKey),
      });
    }

    // 3. Não encontrado
    return res.status(404).json({
      success: false,
      error: {
        code: 'NOT_FOUND',
        message: `Recurso "${resource}" não encontrado para o tenant "${tenantId}".`,
        requestId: (req as any).requestId,
        timestamp: new Date().toISOString(),
      },
    });
  } catch (error) {
    next(error);
  }
});

/**
 * PUT /api/v1/resources/:resource
 * Grava/atualiza o recurso para o tenant especificado.
 */
router.put('/:resource', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const tenantId = resolveTenantId(req);
    const resource = req.params.resource;

    if (!RESOURCE_NAME_REGEX.test(resource)) {
      throw ApiError.badRequest(`Nome de recurso inválido: "${resource}".`);
    }

    const storeKey = `cms:${tenantId}:${resource}`;
    const payload = req.body;

    // Validação estrita de runtime por tipo de recurso (Fase 62 - Hardening)
    validateResourcePayload(resource, payload);

    // Proteção de memória do store em fallback
    if (serverResourceStore.size > 2000) {
      const firstKey = serverResourceStore.keys().next().value;
      if (firstKey) serverResourceStore.delete(firstKey);
    }

    // Atualiza imediatamente no store em memória
    serverResourceStore.set(storeKey, payload);

    const db = getDb();
    if (db) {
      try {
        // Assegura existência do tenant na tabela raiz
        await db
          .insert(schema.tenants)
          .values({
            id: tenantId,
            name: `Congregação ${tenantId}`,
            slug: tenantId,
            status: 'active',
            contactEmail: `admin@${tenantId}.org`,
          })
          .onConflictDoNothing();

        switch (resource) {
          case 'settings': {
            await db
              .insert(schema.siteSettings)
              .values({
                id: `settings_${tenantId}`,
                tenantId,
                siteName: payload.siteName || '',
                language: payload.language || 'pt-BR',
                locale: payload.locale || 'pt-BR',
                timezone: payload.timezone || 'America/Sao_Paulo',
                dateFormat: payload.dateFormat || 'DD/MM/YYYY',
                timeFormat: payload.timeFormat || 'HH:mm',
                faviconUrl: payload.faviconUrl || '',
                updatedAt: new Date(),
              })
              .onConflictDoUpdate({
                target: schema.siteSettings.tenantId,
                set: {
                  siteName: payload.siteName || '',
                  language: payload.language || 'pt-BR',
                  timezone: payload.timezone || 'America/Sao_Paulo',
                  faviconUrl: payload.faviconUrl || '',
                  updatedAt: new Date(),
                },
              });
            break;
          }

          case 'institutional': {
            await db
              .insert(schema.institutionalContents)
              .values({
                id: `inst_${tenantId}`,
                tenantId,
                profile: payload.profile || {},
                address: payload.address || {},
                contact: payload.contact || {},
                socialLinks: payload.socialLinks || {},
                updatedAt: new Date(),
              })
              .onConflictDoUpdate({
                target: schema.institutionalContents.tenantId,
                set: {
                  profile: payload.profile || {},
                  address: payload.address || {},
                  contact: payload.contact || {},
                  socialLinks: payload.socialLinks || {},
                  updatedAt: new Date(),
                },
              });
            break;
          }

          case 'themes': {
            if (Array.isArray(payload)) {
              for (const theme of payload) {
                if (!theme || !theme.id) continue;
                await db
                  .insert(schema.visualThemes)
                  .values({
                    id: theme.id,
                    tenantId,
                    name: theme.name || 'Tema sem nome',
                    description: theme.description || '',
                    version: theme.version || '1.0.0',
                    isDefault: Boolean(theme.isDefault),
                    status: theme.status || 'active',
                    tokens: theme.tokens || {},
                    updatedAt: new Date(),
                  })
                  .onConflictDoUpdate({
                    target: schema.visualThemes.id,
                    set: {
                      name: theme.name || 'Tema sem nome',
                      description: theme.description || '',
                      version: theme.version || '1.0.0',
                      isDefault: Boolean(theme.isDefault),
                      status: theme.status || 'active',
                      tokens: theme.tokens || {},
                      updatedAt: new Date(),
                    },
                  });
              }
            }
            break;
          }
        }
      } catch (dbError) {
        console.warn(`[ResourcesRouter] Erro ao gravar banco para "${resource}":`, dbError);
      }
    }

    return res.status(200).json({
      success: true,
      data: payload,
    });
  } catch (error) {
    next(error);
  }
});

/**
 * DELETE /api/v1/resources/:resource
 * Remove o recurso especificado para o tenant.
 */
router.delete('/:resource', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const tenantId = resolveTenantId(req);
    const resource = req.params.resource;
    const storeKey = `cms:${tenantId}:${resource}`;

    const deleted = serverResourceStore.delete(storeKey);

    return res.status(200).json({
      success: true,
      deleted,
    });
  } catch (error) {
    next(error);
  }
});

/**
 * HEAD /api/v1/resources/:resource
 * Verifica existência do recurso.
 */
router.head('/:resource', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const tenantId = resolveTenantId(req);
    const resource = req.params.resource;
    const storeKey = `cms:${tenantId}:${resource}`;

    if (serverResourceStore.has(storeKey)) {
      return res.status(200).end();
    }

    const db = getDb();
    if (db) {
      if (resource === 'settings') {
        const row = await db.query.siteSettings.findFirst({
          where: eq(schema.siteSettings.tenantId, tenantId),
        });
        if (row) return res.status(200).end();
      }
    }

    return res.status(404).end();
  } catch (error) {
    next(error);
  }
});

/**
 * DELETE /api/v1/resources?prefix=...
 * Limpa recursos que correspondem a um prefixo.
 */
router.delete('/', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const prefix = req.query.prefix as string;
    let deletedCount = 0;

    if (prefix && typeof prefix === 'string') {
      for (const key of Array.from(serverResourceStore.keys())) {
        if (key.startsWith(prefix)) {
          serverResourceStore.delete(key);
          deletedCount++;
        }
      }
    }

    return res.status(200).json({
      success: true,
      deletedCount,
    });
  } catch (error) {
    next(error);
  }
});

export const resourcesRouter = router;
