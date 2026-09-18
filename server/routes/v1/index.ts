import { Router } from 'express';
import { healthRouter } from './health.js';
import { authRouter } from './auth.js';
import { resourcesRouter } from './resources.js';
import { churchRouter } from './church.js';

const router = Router();

// Montagem das rotas base da versão 1
router.use('/', healthRouter);
router.use('/auth', authRouter);
router.use('/resources', resourcesRouter);
router.use('/church', churchRouter);

export const v1Router = router;
