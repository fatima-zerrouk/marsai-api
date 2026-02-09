import db from '../config/database.config.js';

export const Form = {
  async create(data) {
    const { formData, collaborateurs } = data;
    const {
      nom, prenom, email, genre, cp, ville, biographie,
      region, pays, telephone, metier,
      facebook, twitter, linkedin, instagram,
    } = formData;

    if (!nom || !prenom || !email || !cp || !genre ||
        !ville || !biographie || !region ||
        !pays || !telephone || !metier) {
      throw new Error('Tous les champs obligatoires sont requis');
    }

    const [movieResult] = await db.query(
      `INSERT INTO movies
        (firstname, lastname, email, gender, zipcode, city, biographie, region, country, phone, job, facebook_url, twitter_url, linkedin_url, instagram_url)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        prenom, nom, email, genre, cp, ville, biographie, region, pays, telephone,
        metier, facebook , twitter, linkedin , instagram 
      ]
    );

    const movieId = movieResult.insertId;

    if (Array.isArray(collaborateurs) && collaborateurs.length > 0) {
      for (const collaborateur of collaborateurs) {
        const { nom: lastname, role: contribution } = collaborateur;
        await db.query(
          `INSERT INTO collaborators (lastname, contribution, movie_id)
           VALUES (?, ?, ?)`,
          [lastname, contribution || 'Non défini', movieId]
        );
      }
    }

    return { insertId: movieId };
  }
};