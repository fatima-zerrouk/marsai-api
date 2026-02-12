import { Form } from '../models/submit.model.js';

export const createForm = async (req, res) => {
  try {
    console.log('--- DONNÉES REÇUES DU FRONT ---');
    console.log(JSON.stringify(req.body, null, 2));

    const result = await Form.create(req.body);

    res.status(201).json({
      message: 'Formulaire enregistré',
      id: result.insertId,
    });
  } catch (error) {
    console.error('🔥 ERREUR LORS DE LA CRÉATION :');
    console.error('Message:', error.message);

    res.status(500).json({ 
      error: error.message,
      details: error.sqlMessage || 'Vérifiez la console serveur'
    });
  }
};
