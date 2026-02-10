import { Form } from '../models/form.model.js';

export const createForm = async (req, res) => {
  try {
    const data = req.body; // contient { formData, collaborateurs } sinon ca marche pas!!!

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

    res.status(500).json({ error: error.sqlMessage || 'Erreur serveur' });
  }
};