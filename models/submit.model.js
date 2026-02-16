import db from '../config/database.config.js';

export const Form = {
  async create(data) {
    const { formData, collaborateurs } = data;

    const {
      original_title,
      english_title,
      youtube_url,
      duration,
      is_hybrid,
      language,
      original_synopsis,
      english_synopsis,
      creative_process,
      ia_tools,
      has_subs,
    } = formData;

    if (
      !original_title ||
      !english_title ||
      !youtube_url ||
      !duration ||
      !language ||
      !original_synopsis ||
      !english_synopsis ||
      !creative_process ||
      !ia_tools ||
      has_subs === undefined
    ) {
      throw new Error('Les champs obligatoires ne peuvent pas être vides');
    }

    const [movieResult] = await db.query(
      `INSERT INTO movies (
        original_title,
        english_title,
        youtube_url,
        duration,
        is_hybrid,
        language,
        original_synopsis,
        english_synopsis,
        creative_process,
        ia_tools,
        has_subs
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        original_title,
        english_title,
        youtube_url,
        duration,
        is_hybrid,
        language,
        original_synopsis,
        english_synopsis,
        creative_process,
        ia_tools,
        has_subs,
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
  },
};
