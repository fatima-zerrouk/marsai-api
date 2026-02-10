import { Router } from 'express';
import cors from 'cors';

import {
  findAllUsers,
  findUserById,
  register,
  login,
  updateUser,
  deleteUser,
} from '../controllers/auth.controller.js';

const router = Router();
router.use(cors());

router.get('/', findAllUsers);
router.get('/:id', findUserById);

router.post('/register', register);
router.post('/login', login);

router.put('/:id', updateUser);
router.delete('/:id', deleteUser);

export default router;
