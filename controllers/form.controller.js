import { Form } from '../models/form.model.js';

export const createForm = async (req, res) => {
  try {
    const data = req.body; // Contient { formData, collaborateurs }

    // On attend le résultat du modèle (qui contient directorId)
    const result = await Form.create(data);

    console.log('--- INSERTION RÉUSSIE ---');
    console.log('Nouvel ID Réalisateur:', result.directorId);

    // On renvoie une réponse claire au frontend
    res.status(201).json({
      success: true,
      message: 'Formulaire enregistré avec succès',
      id: result.directorId, // On utilise directorId du modèle et on le nomme 'id' pour le front
    });

  } catch (error) {
    console.log('🔥 ERREUR DANS LE CONTRÔLEUR :');
    console.log('Message:', error.message);

    // Gestion détaillée pour le debug
    if (error.sql) {
      console.log('SQL Fautif:', error.sql);
      console.log('Message SQL:', error.sqlMessage);
    }

    res.status(500).json({ 
      success: false,
      error: error.message || 'Erreur interne du serveur' 
    });
  }
};