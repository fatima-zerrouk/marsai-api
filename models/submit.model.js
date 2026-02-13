import db from '../config/database.config.js';

export const Form = {
  async create(data) {
    if (!data || !data.formData) {
      throw new Error('Les données du formulaire (formData) sont manquantes');
    }

    const { formData, collaborateurs } = data;

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
      images = []
    } = formData;

    // 🔹 Validation améliorée : indique exactement quels champs sont manquants
    const missingFields = [];
    if (!original_title || original_title.trim() === '') missingFields.push('original_title');
    if (!english_title || english_title.trim() === '') missingFields.push('english_title');
    if (!youtube_url || youtube_url.trim() === '') missingFields.push('youtube_url');
    if (!duration) missingFields.push('duration');
    if (!language || language.trim() === '') missingFields.push('language');

    if (missingFields.length > 0) {
      throw new Error(`Champs obligatoires manquants : ${missingFields.join(', ')}`);
    }

    const coverImage = images.length > 0 ? images[0] : null;

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
        has_subs,
        cover_image
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        original_title,
        english_title,
        youtube_url,
        parseInt(duration),
        is_hybrid ? 1 : 0,
        language,
        original_synopsis,
        english_synopsis,
        creative_process,
        ia_tools,
        has_subs ? 1 : 0,
        coverImage
      ]
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
  }
};
