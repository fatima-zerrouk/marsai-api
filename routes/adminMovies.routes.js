import express from 'express';
import * as MovieController from '../controllers/adminMovies.controller.js';
import cors from 'cors';
import { authenticate } from '../middlewares/auth.middleware.js';
import { authorizeRoles } from '../middlewares/role.middleware.js';

const router = express.Router();

router.use(cors());

router.get(
  '/',
  authenticate,
  authorizeRoles('Admin'),
  MovieController.getMovies
);
router.get(
  '/:id',
  authenticate,
  authorizeRoles('Admin'),
  MovieController.getMovie
);
router.post(
  '/',
  authenticate,
  authorizeRoles('Admin'),
  MovieController.createMovie
);
router.put(
  '/:id',
  authenticate,
  authorizeRoles('Admin'),
  MovieController.updateMovie
);
router.delete(
  '/:id',
  authenticate,
  authorizeRoles('Admin'),
  MovieController.deleteMovie
);

router.put(
  '/:id/visibility',
  authenticate,
  authorizeRoles('Admin'),
  MovieController.toggleMovieVisibility
);

router.get('/movies/public', MovieController.getPublicMovies);

export default router;
