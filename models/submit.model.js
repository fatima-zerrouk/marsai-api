import db from '../config/database.config.js';

export const Form = {
  async create(data, directorId) {
    if (!data || !data.formData) {
      throw new Error('Les données du formulaire (formData) sont manquantes');
    }

    const finalDirectorId = directorId || null; 
    const { formData, collaborateurs } = data;
    
    // Extraction des données (destructuring)
    const {
      original_title, english_title, youtube_url, duration,
      is_hybrid = false, language, original_synopsis = '',
      english_synopsis = '', creative_process = '', ia_tools = '',
      has_subs = false, thumbnail, gallery = []
    } = formData;

    // Validation des champs
    const missingFields = [];
    if (!original_title?.trim()) missingFields.push('original_title');
    if (!english_title?.trim()) missingFields.push('english_title');
    if (!youtube_url?.trim()) missingFields.push('youtube_url');
    if (!Number.isInteger(parseInt(duration))) missingFields.push('duration');
    if (!language?.trim()) missingFields.push('language');

    if (missingFields.length > 0) {
      throw new Error(`Champs obligatoires manquants : ${missingFields.join(', ')}`);
    }

    const cover_image = thumbnail?.url || null;
    const connection = await db.getConnection();
    
    try {
      await connection.beginTransaction();

      // 1. On insère le film avec le director_id
      const [movieResult] = await connection.query(
        `INSERT INTO movies (
          original_title, english_title, youtube_url, duration, 
          is_hybrid, language, original_synopsis, english_synopsis, 
          creative_process, ia_tools, has_subs, cover_image, director_id
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          original_title, english_title, youtube_url, parseInt(duration),
          is_hybrid ? 1 : 0, language, original_synopsis, english_synopsis,
          creative_process, ia_tools, has_subs ? 1 : 0, cover_image, finalDirectorId
        ]
      );

      const movieId = movieResult.insertId;

      // 2. ✅ CRUCIAL : On met à jour le réalisateur pour pointer vers ce nouveau film
      if (finalDirectorId) {
        await connection.query(
          `UPDATE directors SET movie_id = ? WHERE id = ?`,
          [movieId, finalDirectorId]
        );
      }

      // 3. Insertion des collaborateurs
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

      // 4. Insertion de la galerie d'images
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
      throw err;
    } finally {
      connection.release();
    }
  }
};