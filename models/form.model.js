import db from '../config/database.config.js';

export const Form = {
  async create(data) {
    const { formData, collaborateurs } = data;
    const {
      nom,
      prenom,
      email,
      genre,
      cp,
      ville,
      biographie,
      region,
      pays,
      telephone,
      metier,
      facebook,
      twitter,
      linkedin,
      instagram,
    } = formData;

    // Vérification des champs obligatoires
    if (
      !nom ||
      !prenom ||
      !email ||
      !cp ||
      !genre ||
      !ville ||
      !biographie ||
      !region ||
      !pays ||
      !telephone ||
      !metier
    ) {
      throw new Error('Tous les champs obligatoires sont requis');
    }

    // 1. Insertion du réalisateur (Director)
    const [directorResult] = await db.query(
      `INSERT INTO directors (
        firstname,
        lastname,
        email,
        gender,
        zipcode,
        city,
        biographie,
        region,
        country,
        phone,
        job,
        facebook_url,
        twitter_url,
        linkedin_url,
        instagram_url
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        prenom,
        nom,
        email,
        genre,
        cp,
        ville,
        biographie,
        region,
        pays,
        telephone,
        metier,
        facebook,
        twitter,
        linkedin,
        instagram,
      ]
    );

    const directorId = directorResult.insertId;

    // 2. Insertion et liaison des collaborateurs
    if (Array.isArray(collaborateurs) && collaborateurs.length > 0) {
      for (const collaborateur of collaborateurs) {
        const { nom: lastname, role: contribution } = collaborateur;

        // On n'insère que si les champs ne sont pas vides
        if (lastname.trim() !== '' || contribution.trim() !== '') {
          await db.query(
            `INSERT INTO collaborators (lastname, contribution, director_id)
             VALUES (?, ?, ?)`,
            [lastname, contribution, directorId] // <-- Liaison établie ici
          );
        }
      }
    }

    // On retourne l'ID pour que le contrôleur puisse le récupérer
    return { directorId };
  },
};
