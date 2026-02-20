import { Form } from '../models/submit.model.js';
export const createForm = async (req, res) => {
  try {
    // 🔹 Logs détaillés pour debug
    console.log('💡 REQ.BODY RAW:', req.body);
    console.log('💡 REQ.BODY FIELDS:', req.body.formData);
    const data = req.body; // doit contenir { formData, collaborateurs }
    if (!data || !data.formData) {
      return res
        .status(400)
        .json({ error: 'formData manquant dans la requête' });
    }
    const result = await Form.create(data);
    console.log('INSERT RESULT:', result);
    res.status(201).json({
      message: 'Formulaire enregistré',
      id: result.insertId,
    });
  } catch (error) {
    console.log('🔥 MYSQL ERROR MESSAGE:', error.message);
    console.log('🔥 MYSQL SQL:', error.sql);
    console.log('🔥 MYSQL SQL MESSAGE:', error.sqlMessage);
    console.log('🔥 FULL ERROR:', error);
    res
      .status(500)
      .json({ error: error.sqlMessage || error.message || 'Erreur serveur' });
  }
};