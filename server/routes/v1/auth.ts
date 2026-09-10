import { Router, type Request, type Response, type NextFunction } from 'express';
import { authenticate, refreshSessionToken, revokeSession } from '../../auth/service.js';
import {
  setAuthCookies,
  clearAuthCookies,
  extractRefreshToken,
} from '../../auth/cookies.js';
import { setCsrfCookie } from '../../middleware/csrf.js';
import { authenticateMiddleware } from '../../middleware/authenticate.js';
import { loginRateLimiterMiddleware, recordFailedAttempt, clearAttempts } from '../../middleware/rateLimiter.js';
import { ApiError } from '../../errors/apiError.js';

const router = Router();

/**
 * POST /api/v1/auth/login
 * Autenticação de usuário com emissão de token JWT e Cookies HTTP-Only
 */
router.post(
  '/login',
  loginRateLimiterMiddleware,
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { email, password } = req.body || {};

      if (!email || !password) {
        throw ApiError.badRequest('Credenciais incompletas: email e senha são obrigatórios.');
      }

      const clientIp =
        (req.headers['x-forwarded-for'] as string) || req.socket.remoteAddress || 'unknown';
      const userAgent = req.headers['user-agent'] || 'unknown';

      try {
        const result = await authenticate({
          email,
          password,
          ipAddress: clientIp,
          userAgent,
        });

        // Limpa tentativas de rate limiting em caso de sucesso
        clearAttempts(`${clientIp}:${email.toLowerCase().trim()}`);

        // Define cookies HTTP-Only seguros
        setAuthCookies(res, result.accessToken, result.refreshToken);

        // Define cookie CSRF para o frontend
        const csrfToken = setCsrfCookie(res);

        res.status(200).json({
          success: true,
          message: 'Autenticação realizada com sucesso.',
          user: result.user,
          accessToken: result.accessToken,
          refreshToken: result.refreshToken,
          csrfToken,
        });
      } catch (authError) {
        // Registra tentativa falha para proteção contra força bruta
        recordFailedAttempt(`${clientIp}:${email.toLowerCase().trim()}`);
        throw authError;
      }
    } catch (error) {
      next(error);
    }
  }
);

/**
 * POST /api/v1/auth/logout
 * Encerramento de sessão, revogação de tokens e limpeza de cookies
 */
router.post('/logout', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const refreshToken = extractRefreshToken(req);
    if (refreshToken) {
      try {
        // Extrai payload para revogação da sessão
        const { verifyRefreshToken } = await import('../../auth/tokens.js');
        const payload = verifyRefreshToken(refreshToken);
        if (payload.sessionId) {
          await revokeSession(payload.sessionId);
        }
      } catch {
        // Continua com a limpeza de cookies mesmo se o token já estiver expirado
      }
    }

    // Remove cookies HTTP-Only e de sessão
    clearAuthCookies(res);

    res.status(200).json({
      success: true,
      message: 'Sessão encerrada com sucesso.',
    });
  } catch (error) {
    next(error);
  }
});

/**
 * GET /api/v1/auth/me
 * Retorna os dados do usuário autenticado no contexto atual
 */
router.get(
  '/me',
  authenticateMiddleware,
  (req: Request, res: Response, next: NextFunction) => {
    try {
      if (!req.user) {
        throw ApiError.unauthorized('Usuário não autenticado.');
      }

      // Retorna identidade limpa e segura (nunca expõe hash ou segredos)
      res.status(200).json({
        success: true,
        user: req.user,
      });
    } catch (error) {
      next(error);
    }
  }
);

/**
 * POST /api/v1/auth/refresh
 * Rotação de Refresh Token e renovação de Access Token
 */
router.post('/refresh', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const refreshToken = extractRefreshToken(req);

    if (!refreshToken) {
      throw ApiError.unauthorized('Token de renovação não fornecido.');
    }

    const result = await refreshSessionToken(refreshToken);

    // Atualiza cookies
    setAuthCookies(res, result.accessToken, result.refreshToken);

    res.status(200).json({
      success: true,
      message: 'Sessão renovada com sucesso.',
      accessToken: result.accessToken,
      refreshToken: result.refreshToken,
      user: result.user,
    });
  } catch (error) {
    next(error);
  }
});

export const authRouter = router;
