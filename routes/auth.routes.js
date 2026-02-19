import { Router } from 'express';
import cors from 'cors';
import { authenticate } from '../middlewares/auth.middleware.js';
import {
  findAllUsers,
  findUserById,
  register,
  login,
  updateUser,
  changePassword,
  deleteUser,
} from '../controllers/auth.controller.js';
import { User } from '../models/User.model.js';

const router = Router();
router.use(cors());

// ───────────────────────────────────────────────
// Users management
// ───────────────────────────────────────────────

router.post('/register', register);
router.post('/login', login);

router.put('/:id', updateUser);
router.delete('/:id', deleteUser);

router.post('/change-password', changePassword);

// Route pour récupérer l'utilisateur connecté
router.get('/me', authenticate, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user)
      return res.status(404).json({ message: 'Utilisateur introuvable' });

    res.json(user);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Erreur serveur' });
  }
});

router.get('/', findAllUsers);
router.get('/:id', findUserById);

export default router;
