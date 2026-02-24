import { Form } from '../models/submit.model.js';

export const createForm = async (req, res) => {
  try {
    console.log('💡 DONNÉES REÇUES :', req.body);
    
    // On extrait formData, collaborateurs ET le fameux directorId
    const { formData, collaborateurs, directorId } = req.body;

    if (!formData) {
      return res.status(400).json({ error: 'formData manquant' });
    }

    // On passe tout au modèle, y compris l'ID du réalisateur
    const result = await Form.create({ formData, collaborateurs, directorId });

    console.log('✅ FILM ENREGISTRÉ AVEC ID RÉALISATEUR:', directorId);

    res.status(201).json({
      success: true,
      message: 'Film enregistré et lié au réalisateur',
      id: result.insertId,
    });
  } catch (error) {
    console.log('🔥 ERREUR:', error.message);
    res.status(500).json({ error: error.message });
  }
};