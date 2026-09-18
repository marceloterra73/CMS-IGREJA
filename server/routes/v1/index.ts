import { Router } from 'express';
import { healthRouter } from './health.js';
import { authRouter } from './auth.js';
import { resourcesRouter } from './resources.js';
import { churchRouter } from './church.js';
import { usersRouter } from './users.js';

const router = Router();

// Montagem das rotas base da versão 1
router.use('/', healthRouter);
router.use('/auth', authRouter);
router.use('/resources', resourcesRouter);
router.use('/church', churchRouter);
router.use('/users', usersRouter);

export const v1Router = router;
