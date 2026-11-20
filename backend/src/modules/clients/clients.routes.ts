import { Router } from 'express';
import { clientsController } from './clients.controller';
import { jwtAuthMiddleware } from '../../common/middleware/jwt-auth.middleware';

const router = Router();

// All client routes require authentication
router.use(jwtAuthMiddleware);

// GET /api/clients (List clients with role filter & phone masking)
router.get('/', (req, res) => clientsController.getAll(req, res));

// GET /api/clients/:id (Client details, preferences & matching properties)
router.get('/:id', (req, res) => clientsController.getOne(req, res));

// POST /api/clients (Create new buyer or seller client)
router.post('/', (req, res) => clientsController.create(req, res));

export default router;
