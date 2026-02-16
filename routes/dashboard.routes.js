import { Router } from 'express';
import { getAdminDashboard } from '../controllers/dashboard.controller.js';
import { authenticate } from '../middlewares/auth.middleware.js';
import { authorizeRoles } from '../middlewares/role.middleware.js';
import cors from 'cors';

const router = Router();

// Middleware CORS spécifique à ce routeur (optionnel si déjà global dans server.js)
router.use(cors());

// Dashboard admin : accessible uniquement aux Admins
router.get('/', authenticate, authorizeRoles('Admin'), getAdminDashboard);

export default router;
