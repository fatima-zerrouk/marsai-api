import db from '../config/database.config.js';

export const Form = {
  async create(data) {
    // On extrait tout de "data" (envoyé par le contrôleur)
    const { formData, collaborateurs, directorId } = data;

    if (!formData) {
      throw new Error('Les données du formulaire (formData) sont manquantes');
    }

    const {
      original_title,
      english_title,
      youtube_url,
      duration,
      is_hybrid = false,
      language,
      original_synopsis = '',
      english_synopsis = '',
      creative_process = '',
      ia_tools = '',
      has_subs = false,
      thumbnail,
      gallery = []
    } = formData;

    // ✅ Validation des champs obligatoires
    const missingFields = [];
    if (!original_title?.trim()) missingFields.push('original_title');
    if (!english_title?.trim()) missingFields.push('english_title');
    if (!youtube_url?.trim()) missingFields.push('youtube_url');
    if (!language?.trim()) missingFields.push('language');

    if (missingFields.length > 0) {
      throw new Error(`Champs obligatoires manquants : ${missingFields.join(', ')}`);
    }

    const cover_image = thumbnail?.url || null;
    const connection = await db.getConnection();

    try {
      await connection.beginTransaction();

      // 1️⃣ Insertion du film (avec la colonne director_id)
      const [movieResult] = await connection.query(
        `INSERT INTO movies (
          original_title, english_title, youtube_url, duration,
          is_hybrid, language, original_synopsis, english_synopsis,
          creative_process, ia_tools, has_subs, cover_image, director_id
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          original_title,
          english_title,
          youtube_url,
          parseInt(duration) || 0,
          is_hybrid ? 1 : 0,
          language,
          original_synopsis,
          english_synopsis,
          creative_process,
          ia_tools,
          has_subs ? 1 : 0,
          cover_image,
          directorId || null // L'ID 50 (ou autre) arrive ici
        ]
      );

      const movieId = movieResult.insertId;

      // 2️⃣ Mise à jour du réalisateur (Liaison inverse si nécessaire)
      if (directorId) {
        await connection.query(
          `UPDATE directors SET movie_id = ? WHERE id = ?`,
          [movieId, directorId]
        );
      }

      // 3️⃣ Insertion des collaborateurs
      if (Array.isArray(collaborateurs)) {
        for (const collab of collaborateurs) {
          if (collab.nom?.trim()) {
            await connection.query(
              `INSERT INTO collaborators (lastname, contribution, movie_id)
               VALUES (?, ?, ?)`,
              [collab.nom, collab.role || 'Non défini', movieId]
            );
          }
        }
      }

      // 4️⃣ Insertion de la galerie d'images
      if (Array.isArray(gallery) && gallery.length > 0) {
        for (const img of gallery) {
          const imageUrl = typeof img === 'string' ? img : img?.url;
          if (imageUrl?.trim()) {
            await connection.query(
              `INSERT INTO images (url, movie_id) VALUES (?, ?)`,
              [imageUrl, movieId]
            );
          }
        }
      }

      await connection.commit();
      return { insertId: movieId };

    } catch (err) {
      await connection.rollback();
      console.error("🔥 Erreur MySQL dans le modèle:", err.message);
      throw err;
    } finally {
      connection.release();
    }
  }
};