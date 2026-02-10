import bcrypt from "bcrypt";
import { AdminJuryModel } from "../models/adminJury.model.js";

export const AdminJuryController = {
  async getAllJury(req, res) {
    try {
      const jury = await AdminJuryModel.getAllJury();
      
      res.json(jury);
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: "Erreur serveur" });
    }
  },

  // Création d'un juré
  async createJury(req, res) {
    try {
        const { firstname, lastname, email, password } = req.body;
        if (!firstname || !lastname || !email || !password) {
            return res.status(400).json({ error: "Tous les champs sont requis" });
        }
        const hashedPassword = await bcrypt.hash(password, 10);
        const newJury = await AdminJuryModel.createJury({ 
            firstname, lastname, email, password: hashedPassword
        });
        res.status(201).json(newJury);
    }   catch (err) {   
        console.error(err);
        res.status(500).json({ error: "Impossible de créer le juré" });
    }
    },

  async deleteJury(req, res) {
    try {
      await AdminJuryModel.deleteJury(req.params.id);
      res.json({ message: "Juré supprimé" });
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: "Impossible de supprimer le juré" });
    }
  },

    async updateJury(req, res) {
      try {
        const { firstname, lastname, email } = req.body;
        const id = req.params.id;

        if (!firstname || !lastname || !email) {
          return res.status(400).json({ error: "Champs manquants" });
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
        res.status(500).json({ error: "Impossible de mettre à jour le juré" });
      }
    }

};
