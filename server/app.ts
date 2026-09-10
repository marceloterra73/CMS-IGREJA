import express, { type Express, type Request, type Response, type NextFunction } from 'express';
import cookieParser from 'cookie-parser';
import { apiRouter } from './routes/index.js';
import { requestIdMiddleware } from './middleware/requestId.js';
import { loggerMiddleware } from './middleware/logger.js';
import { errorHandlerMiddleware } from './middleware/errorHandler.js';
import { csrfProtectionMiddleware } from './middleware/csrf.js';
import { ApiError } from './errors/apiError.js';
import { config } from './config/index.js';

export interface CreateAppOptions {
  configureRoutes?: (app: Express) => void;
}

/**
 * Cria e configura a aplicação Express do CMS Visual para Igrejas.
 * Fundação do backend estabelecida nas Fases 56-58. Hardening na Fase 62.
 */
export function createApp(options?: CreateAppOptions): Express {
  const app = express();

  // Desabilita identificador de tecnologia nos headers por segurança (OWASP)
  app.disable('x-powered-by');

  // Habilita trust proxy para suporte a proxy reverso em produção (Nginx, Cloud Run)
  app.set('trust proxy', 1);

  // Headers fundamentais de segurança para a API (OWASP Hardening - Fase 62)
  app.use((_req: Request, res: Response, next: NextFunction) => {
    res.setHeader('X-Content-Type-Options', 'nosniff');
    res.setHeader('X-Frame-Options', 'SAMEORIGIN');
    res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
    res.setHeader('Permissions-Policy', 'camera=(), microphone=(), geolocation=()');
    res.setHeader('Cross-Origin-Opener-Policy', 'same-origin');

    // HSTS ativado estritamente em ambiente de produção
    if (config.isProduction) {
      res.setHeader('Strict-Transport-Security', 'max-age=31536000; includeSubDomains');
    }

    next();
  });

  // Controle Seguro de CORS (Fase 62 - Hardening)
  app.use((req: Request, res: Response, next: NextFunction) => {
    const origin = req.headers.origin;
    if (origin) {
      // Em produção, restringir ou validar origem. Não usar '*' com credenciais
      res.setHeader('Access-Control-Allow-Origin', origin);
      res.setHeader('Access-Control-Allow-Credentials', 'true');
      res.setHeader(
        'Access-Control-Allow-Methods',
        'GET, POST, PUT, DELETE, PATCH, OPTIONS, HEAD'
      );
      res.setHeader(
        'Access-Control-Allow-Headers',
        'Content-Type, Authorization, X-Requested-With, X-CSRF-Token, X-Tenant-Id, Accept'
      );
      res.setHeader('Access-Control-Max-Age', '86400');
    }

    if (req.method === 'OPTIONS') {
      res.sendStatus(204);
      return;
    }

    next();
  });

  // Middlewares essenciais de parsing e ciclo de vida
  app.use(express.json({ limit: '1mb', strict: false }));
  app.use(express.urlencoded({ extended: true, limit: '1mb' }));
  app.use(cookieParser());
  app.use(requestIdMiddleware);
  app.use(loggerMiddleware);
  app.use(csrfProtectionMiddleware);

  // Montagem das rotas da API sob /api
  app.use('/api', apiRouter);

  // Permite extensão pontual para testes
  if (options?.configureRoutes) {
    options.configureRoutes(app);
  }

  // Rota 404 para rotas não mapeadas sob /api
  app.use('/api/*', (req: Request, _res: Response, next: NextFunction) => {
    next(
      ApiError.notFound(
        `Rota "${req.method} ${req.originalUrl}" não encontrada na API do CMS.`
      )
    );
  });

  // Middleware global de tratamento de erros
  app.use(errorHandlerMiddleware);

  return app;
}

export const app = createApp();
