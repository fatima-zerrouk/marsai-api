import { Router } from 'express';
import { AdminJuryController } from '../controllers/adminJury.controller.js';
import cors from 'cors';
import { authenticate } from '../middlewares/auth.middleware.js';
import { authorizeRoles } from '../middlewares/role.middleware.js';

const router = Router();

router.use(cors());

router.get(
  '/',
  authenticate,
  authorizeRoles('Admin'),
  AdminJuryController.getAllJury
);
router.delete(
  '/:id',
  authenticate,
  authorizeRoles('Admin'),
  AdminJuryController.deleteJury
);
router.put(
  '/:id',
  authenticate,
  authorizeRoles('Admin'),
  AdminJuryController.updateJury
);
router.post(
  '/',
  authenticate,
  authorizeRoles('Admin'),
  AdminJuryController.createJury
);
router.post(
  '/distribute-movies',
  authenticate,
  authorizeRoles('Admin'),
  AdminJuryController.distributeMovies
);
// Backend
router.get(
  '/distributions',
  authenticate,
  authorizeRoles('Admin'),
  AdminJuryController.getDistributions
);

export default router;
