import bcrypt from 'bcrypt';
import { AdminJuryModel } from '../models/adminJury.model.js';
import { sendMail } from '../utils/mailer.js';
import crypto from 'crypto';

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
      const { firstname, lastname, email } = req.body;

      if (!firstname || !lastname || !email) {
        return res.status(400).json({ error: 'Tous les champs sont requis' });
      }

      // Générer code temporaire
      const code = crypto.randomInt(10000000, 100000000).toString();

      // Hasher le code
      const hashedPassword = await bcrypt.hash(code, 10);

      // Créer le jury avec le code hashé
      const newJury = await AdminJuryModel.createJury({
        firstname,
        lastname,
        email,
        password: hashedPassword,
      });

      // Envoyer le mail avec le code en clair
      await sendMail({
        toEmail: email,
        toName: `${firstname} ${lastname}`,
        code,
      });

      return res.status(201).json(newJury);
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: 'Erreur création jury' });
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
