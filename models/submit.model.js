import db from '../config/database.config.js';

export const Form = {
  async create(data, directorId) {
    if (!data || !data.formData) {
      throw new Error('Les données du formulaire (formData) sont manquantes');
    }

    // ✅ ON REND L'ID OPTIONNEL
    // Si pas d'ID, on met null (ou 1 si tu veux qu'il appartienne à l'admin par défaut)
    const finalDirectorId = directorId || null; 

    const { formData, collaborateurs } = data;
    const {
      original_title, english_title, youtube_url, duration,
      is_hybrid = false, language, original_synopsis = '',
      english_synopsis = '', creative_process = '', ia_tools = '',
      has_subs = false, thumbnail, gallery = []
    } = formData;

    // (Garder la vérification des champs obligatoires titre, durée, etc.)
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

      // ➤ Insertion avec le finalDirectorId (qui peut être NULL)
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

      // ... (Reste du code pour collaborateurs et galerie identique)
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