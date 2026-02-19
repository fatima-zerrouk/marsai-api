import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { User } from '../models/User.model.js';

/*
|--------------------------------------------------------------------------
| GET /auth
|--------------------------------------------------------------------------
| Récupérer tous les utilisateurs
| (à protéger plus tard avec JWT)
*/
export const findAllUsers = async (req, res) => {
  try {
    const users = await User.findAll();
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: 'Erreur serveur' });
  }
};

/*
|--------------------------------------------------------------------------
| GET /auth/:id
|--------------------------------------------------------------------------
| Récupérer un utilisateur par ID
*/
export const findUserById = async (req, res) => {
  const { id } = req.params;

  try {
    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({ message: 'Utilisateur introuvable' });
    }

    res.json(user);
  } catch (err) {
    res.status(500).json({ message: 'Erreur serveur' });
  }
};

/*
|--------------------------------------------------------------------------
| POST /auth/register
|--------------------------------------------------------------------------
| Inscription
*/
export const register = async (req, res) => {
  let { email, password, firstname, lastname } = req.body;

  // Normalisation
  email = email?.trim().toLowerCase();
  firstname = firstname?.trim();
  lastname = lastname?.trim();

  // Validation présence
  if (!email || !password || !firstname || !lastname) {
    return res.status(400).json({
      message: 'Tous les champs sont obligatoires',
    });
  }

  // Validation email (simple et efficace)
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return res.status(400).json({
      message: 'Email invalide',
    });
  }

  // Longueurs
  if (password.length < 8 || password.length > 64) {
    return res.status(400).json({
      message: 'Mot de passe invalide (8 à 64 caractères)',
    });
  }

  if (firstname.length < 2 || firstname.length > 50) {
    return res.status(400).json({
      message: 'Prénom invalide',
    });
  }

  if (lastname.length < 2 || lastname.length > 50) {
    return res.status(400).json({
      message: 'Nom invalide',
    });
  }

  try {
    const existingUser = await User.findByEmail(email);
    if (existingUser) {
      return res.status(409).json({
        message: 'Email déjà utilisé',
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await User.create({
      email,
      password: hashedPassword,
      firstname,
      lastname,
    });

    // ATTRIBUTION DU RÔLE PAR DÉFAUT
    await User.addRoleByName(newUser.insertId, 'Jury');

    res.status(201).json({
      message: 'Utilisateur créé avec succès',
      id: newUser.insertId,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      message: 'Erreur serveur',
    });
  }
};

/*
|--------------------------------------------------------------------------
| POST /auth/login
|--------------------------------------------------------------------------
| Connexion
*/
export const login = async (req, res) => {
  try {
    let { email, password } = req.body;

    // Vérification présence champs
    if (!email || !password) {
      return res.status(400).json({
        message: 'Email et mot de passe requis',
      });
    }

    // Normalisation email
    email = email.trim().toLowerCase();

    // Validation format email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(401).json({
        message: 'Identifiants invalides',
      });
    }

    // Recherche utilisateur
    const user = await User.findByEmail(email);

    if (!user) {
      return res.status(401).json({
        message: 'Identifiants invalides',
      });
    }

    // Vérification mot de passe
    const isValidPassword = await bcrypt.compare(password, user.password);

    if (!isValidPassword) {
      return res.status(401).json({
        message: 'Identifiants invalides',
      });
    }

    // Vérification obligation changement mot de passe
    if (user.must_change_password) {
      return res.status(200).json({
        mustChangePassword: true,
        userId: user.id,
      });
    }

    // Génération du token JWT
    const token = jwt.sign(
      {
        id: user.id,
        email: user.email,
        roles: user.roles,
      },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );

    return res.status(200).json({
      token,
    });
  } catch (error) {
    console.error('Erreur login :', error);
    return res.status(500).json({
      message: 'Erreur serveur',
    });
  }
};

/*
|--------------------------------------------------------------------------
| PUT /auth/:id
|--------------------------------------------------------------------------
| Mise à jour utilisateur
*/
export const updateUser = async (req, res) => {
  const { id } = req.params;
  const { email, password, firstname, lastname } = req.body;

  if (!email && !password && !firstname && !lastname) {
    return res.status(400).json({
      message: 'Aucune donnée à mettre à jour',
    });
  }

  try {
    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({ message: 'Utilisateur introuvable' });
    }

    const updatedData = {
      email: email || user.email,
      firstname: firstname || user.firstname,
      lastname: lastname || user.lastname,
    };

    if (password) {
      if (password.length < 8) {
        return res.status(400).json({
          message: 'Mot de passe trop court (min 8 caractères)',
        });
      }
      updatedData.password = await bcrypt.hash(password, 10);
    }

    await User.update(id, updatedData);

    res.json({ message: 'Utilisateur mis à jour' });
  } catch (err) {
    res.status(500).json({ message: 'Erreur serveur' });
  }
};

// Route dédiée pour le changement de mot de passe obligatoire

export const changePassword = async (req, res) => {
  try {
    const { userId, newPassword } = req.body;

    if (!userId || !newPassword) {
      return res.status(400).json({
        message: 'Données manquantes',
      });
    }

    if (newPassword.length < 8) {
      return res.status(400).json({
        message: 'Mot de passe trop court (min 8 caractères)',
      });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({
        message: 'Utilisateur introuvable',
      });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);

    await User.update(userId, {
      password: hashedPassword,
      must_change_password: false,
    });

    // Génération du token après changement
    const token = jwt.sign(
      {
        id: user.id,
        email: user.email,
        roles: user.roles,
      },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );

    res.json({ token });
  } catch (error) {
    res.status(500).json({
      message: 'Erreur serveur',
    });
  }
};

/*
|--------------------------------------------------------------------------
| DELETE /auth/:id
|--------------------------------------------------------------------------
*/
export const deleteUser = async (req, res) => {
  const { id } = req.params;

  try {
    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({ message: 'Utilisateur introuvable' });
    }

    await User.delete(id);
    res.json({ message: 'Utilisateur supprimé' });
  } catch (err) {
    res.status(500).json({ message: 'Erreur serveur' });
  }
};
