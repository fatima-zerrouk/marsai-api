import db from '../config/database.config.js';

export const Form = {
  async create(data) {
    const {
      nom,
      prenom,
      email,
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
      role,
    } = data;

    if (
      !nom ||
      !prenom ||
      !email ||
      !cp ||
      !ville ||
      !biographie ||
      !region ||
      !pays ||
      !telephone ||
      !metier ||
      !facebook ||
      !twitter ||
      !linkedin ||
      !instagram ||
      !role
    ) {
      throw new Error('Tous les champs sont requis');
    }

    const [movieResult] = await db.query(
      `INSERT INTO movies (firstname, lastname, email, zipcode, city, biographie, region, country, phone, job, facebook_url, twitter_url, linkedin_url, instagram_url)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        prenom,
        nom,
        email,
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

    const [collabResult] = await db.query(
      `INSERT INTO collaborators (lastname, role, movie_id) 
       VALUES (?, ?, ?)`,
      [nom, role, movie_id]
    );

    return { insertId: movieResult.insertId };
  },
};
