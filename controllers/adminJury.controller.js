import bcrypt from 'bcrypt';
import { AdminJuryModel } from '../models/adminJury.model.js';
import { sendMail } from '../utils/mailer.js';

export const AdminJuryController = {
  async getAllJury(req, res) {
    try {
      const jury = await AdminJuryModel.getAllJury();
      res.json(jury);
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Erreur serveur' });
    }
  },

  async createJury(req, res) {
    try {
      const { firstname, lastname, email, password } = req.body;
      if (!firstname || !lastname || !email || !password) {
        return res.status(400).json({ error: 'Tous les champs sont requis' });
      }

      const hashedPassword = await bcrypt.hash(password, 10);
      const newJury = await AdminJuryModel.createJury({
        firstname,
        lastname,
        email,
        password: hashedPassword,
      });

      // Générer un code temporaire pour le mail (exemple : 6 chiffres)
      const code = Math.floor(100000 + Math.random() * 900000);

      // Envoyer le mail au juré
      await sendMail({
        to: email,
        subject: 'Votre code pour accéder à MarsAI',
        html: `<p>Bonjour ${firstname},</p>
               <p>Voici votre code : <strong>${code}</strong></p>`,
      });

      res.status(201).json({ ...newJury, code });
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Impossible de créer le juré' });
    }
  },

  async deleteJury(req, res) {
    try {
      await AdminJuryModel.deleteJury(req.params.id);
      res.json({ message: 'Juré supprimé' });
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Impossible de supprimer le juré' });
    }
  },

  async updateJury(req, res) {
    try {
      const { firstname, lastname, email } = req.body;
      const id = req.params.id;

      if (!firstname || !lastname || !email) {
        return res.status(400).json({ error: 'Champs manquants' });
      }

      await AdminJuryModel.updateJury(id, firstname, lastname, email);

      res.json({
        id: Number(id),
        firstname,
        lastname,
        email,
      });
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Impossible de mettre à jour le juré' });
    }
  },

  async sendCodeJury(req, res) {
    const { email, firstname, lastname, code } = req.body;

    try {
      await sendMail({
        toEmail: email,
        toName: `${firstname} ${lastname}`,
        code,
      });
      res.json({ message: 'Mail envoyé avec succès' });
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Erreur envoi email' });
    }
  },
};
