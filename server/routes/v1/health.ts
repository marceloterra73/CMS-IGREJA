import { Router, type Request, type Response } from 'express';
import { config } from '../../config/index.js';
import { checkDatabaseHealth } from '../../db/index.js';

const router = Router();

/**
 * GET /api/v1/health
 * Endpoint de monitoramento de saúde do servidor HTTP e da persistência
 */
router.get('/health', async (_req: Request, res: Response) => {
  const dbHealth = await checkDatabaseHealth();

  res.status(200).json({
    success: true,
    status: dbHealth.status === 'error' ? 'degraded' : 'healthy',
    timestamp: new Date().toISOString(),
    uptime: Math.floor(process.uptime()),
    environment: config.nodeEnv,
    version: config.apiVersion,
    database: {
      status: dbHealth.status,
      ...(dbHealth.latencyMs !== undefined ? { latencyMs: dbHealth.latencyMs } : {}),
      ...(dbHealth.message ? { message: dbHealth.message } : {}),
    },
  });
});

/**
 * GET /api/v1/status
 * Informações técnicas sobre a fundação da API e persistência (Fase 57)
 */
router.get('/status', async (_req: Request, res: Response) => {
  const dbHealth = await checkDatabaseHealth();

  res.status(200).json({
    success: true,
    api: 'CMS Visual para Igrejas — API Base',
    version: config.apiVersion,
    phase: 'Fase 57 — PostgreSQL, ORM e Fundação da Persistência de Dados',
    status: 'operational',
    persistence: {
      engine: 'PostgreSQL 15+',
      orm: 'Drizzle ORM',
      rlsEnabled: true,
      status: dbHealth.status,
    },
    auth: {
      status: 'operational',
      jwtAlgorithm: 'HS256',
      rbacEnabled: true,
      roles: ['superadmin', 'tenant_admin', 'pastor', 'editor', 'media_volunteer'],
    },
    timestamp: new Date().toISOString(),
  });
});

export const healthRouter = router;

