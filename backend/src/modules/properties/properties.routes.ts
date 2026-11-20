import { Router } from 'express';
import { propertiesController } from './properties.controller';
import { jwtAuthMiddleware } from '../../common/middleware/jwt-auth.middleware';

const router = Router();

// GET /api/properties (Public catalog for Mini App & Realtor search)
router.get('/', (req, res) => propertiesController.getAll(req, res));

// GET /api/properties/:id (Property details)
router.get('/:id', (req, res) => propertiesController.getOne(req, res));

// POST /api/properties (Protected: Create new property)
router.post('/', jwtAuthMiddleware, (req, res) => propertiesController.create(req, res));

export default router;
