import db from '../config/database.config.js';

export const Form = {
  async create(data) {
    if (!data || !data.formData) {
      throw new Error('Les données du formulaire (formData) sont manquantes');
    }

    const { formData, collaborateurs } = data;

    // 🔥 Prend la première image pour cover_image
    const coverImage = (formData.images && formData.images.length > 0)
      ? formData.images[0]
      : null;

    const params = [
      formData.original_title || 'Sans titre',
      formData.english_title || 'No title',
      formData.youtube_url || '',
      formData.duration && formData.duration !== "" ? parseInt(formData.duration) : null,
      formData.is_hybrid ? 1 : 0,
      formData.language || null,
      formData.original_synopsis || '',
      formData.english_synopsis || '',
      formData.creative_process || '',
      formData.ia_tools || '',
      formData.has_subs ? 1 : 0,
      coverImage // 🔥 cover_image
    ];

    try {
      const [movieResult] = await db.query(
        `INSERT INTO movies (
          original_title, english_title, youtube_url, duration,
          is_hybrid, language, original_synopsis, english_synopsis,
          creative_process, ia_tools, has_subs, cover_image
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        params
      );

      const movieId = movieResult.insertId;

      if (Array.isArray(collaborateurs) && collaborateurs.length > 0) {
        for (const collab of collaborateurs) {
          if (collab.nom && collab.nom.trim() !== '') {
            await db.query(
              `INSERT INTO collaborators (lastname, contribution, movie_id)
               VALUES (?, ?, ?)`,
              [collab.nom, collab.role || 'Non défini', movieId]
            );
          }
        }
      }

      return { insertId: movieId };
    } catch (dbError) {
      console.error('Erreur SQL détaillée:', dbError.sqlMessage);
      throw dbError;
    }
  }
};
