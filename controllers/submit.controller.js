import { Form } from '../models/submit.model.js';

export const createForm = async (req, res) => {
  try {
    const { formData, collaborateurs, directorId } = req.body;

    // ✅ On a enlevé le "if (!directorId) return res.status(400)..."
    // Si directorId est absent, il sera juste "undefined"

    if (!formData) {
      return res.status(400).json({ error: 'Données du film manquantes.' });
    }

    const result = await Form.create({ formData, collaborateurs }, directorId);

    res.status(201).json({
      message: 'Formulaire enregistré avec succès',
      id: result.insertId,
    });
  } catch (error) {
    console.error('🔥 Erreur Controller:', error.message);
    res.status(500).json({ error: error.message || 'Erreur serveur' });
  }
};
