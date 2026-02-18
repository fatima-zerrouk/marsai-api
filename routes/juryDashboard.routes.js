import { Router } from 'express';
import { authenticate } from '../middlewares/auth.middleware.js';
import { authorizeRoles } from '../middlewares/role.middleware.js';
import { juryDashboard } from '../controllers/juryDashboard.controller.js';

const router = Router();

// authenticate vérifie qu’il est connecté
// authorizeRoles vérifie qu’il a le bon rôle
// si c'est bon affiche le dashboard
router.get('/', authenticate, authorizeRoles('Jury'), juryDashboard);

// les routes dans ce fichier sont accessibles avec /jury-dashboard

export default router;
