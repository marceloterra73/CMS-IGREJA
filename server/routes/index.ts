import { Router, type Request, type Response } from 'express';
import { v1Router } from './v1/index.js';

const router = Router();

// Rota raiz da API: /api
router.get('/', (_req: Request, res: Response) => {
  res.status(200).json({
    success: true,
    message: 'CMS Visual para Igrejas — API Gateway',
    activeVersions: ['v1'],
    endpoints: {
      health: '/api/v1/health',
      status: '/api/v1/status',
    },
  });
});

// Montagem do roteador v1 sob /v1
router.use('/v1', v1Router);

export const apiRouter = router;
