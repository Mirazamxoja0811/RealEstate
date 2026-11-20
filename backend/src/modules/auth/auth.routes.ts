import { Router } from 'express';
import { authController } from './auth.controller';
import { jwtAuthMiddleware } from '../../common/middleware/jwt-auth.middleware';

const router = Router();

// POST /api/auth/login (Password)
router.post('/login', (req, res) => authController.login(req, res));

// POST /api/auth/telegram (Telegram Mini App initData)
router.post('/telegram', (req, res) => authController.loginTelegram(req, res));

// GET /api/auth/me (Current authenticated user profile)
router.get('/me', jwtAuthMiddleware, (req, res) => authController.me(req, res));

export default router;
