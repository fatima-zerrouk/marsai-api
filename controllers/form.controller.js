import { Form } from '../models/form.model.js';
import { uploadToScaleway } from '../services/uploadService.js';

// On supprime l'import inexistant de createTest/getAllTests
// Si tu as besoin de fonctions SQL directes, elles sont dans ton modèle

export const createForm = async (req, res) => {
  try {
    const data = req.body;

    // On appelle le modèle pour créer le réalisateur
    const result = await Form.create(data);

    res.status(201).json({
      success: true,
      message: 'Réalisateur enregistré avec succès',
      id: result.directorId,
    });
  } catch (error) {
    console.error('🔥 ERREUR DANS LE CONTRÔLEUR FORM :', error.message);
    res.status(500).json({
      success: false,
      error: error.message || 'Erreur interne du serveur',
    });
  }
};

// Si tu avais besoin de "create" pour des tests S3 rapides :
export const create = async (req, res) => {
  try {
    const { firstname, lastname } = req.body;
    const imageFile = req.files.image[0];
    const videoFile = req.files.video[0];

    const image_url = await uploadToScaleway(imageFile, 'images');
    const video_url = await uploadToScaleway(videoFile, 'videos');

    // NOTE: Ici, au lieu de createTest, tu devrais utiliser une fonction de ton modèle
    res.status(201).json({ image_url, video_url });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
