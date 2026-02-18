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
      thumbnail,
      gallery = [],
    } = formData;

    // ✅ Vérification des champs obligatoires
    const missingFields = [];
    if (!original_title?.trim()) missingFields.push('original_title');
    if (!english_title?.trim()) missingFields.push('english_title');
    if (!youtube_url?.trim()) missingFields.push('youtube_url');
    if (!Number.isInteger(parseInt(duration))) missingFields.push('duration');
    if (!language?.trim()) missingFields.push('language');

    if (missingFields.length > 0) {
      throw new Error(
        `Champs obligatoires manquants : ${missingFields.join(', ')}`
      );
    }

    const cover_image = thumbnail?.url || null;

    // ✅ Insertion du film
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
        cover_image,
      ]
    );

    const movieId = movieResult.insertId;

    // ✅ Insertion des collaborateurs
    if (Array.isArray(collaborateurs)) {
      for (const collab of collaborateurs) {
        if (collab.nom?.trim()) {
          try {
            await db.query(
              `INSERT INTO collaborators (lastname, contribution, movie_id)
               VALUES (?, ?, ?)`,
              [collab.nom, collab.role || 'Non défini', movieId]
            );
          } catch (err) {
            console.error('Erreur insertion collaborateur:', err.message);
          }
        }
      }
    }

    // ✅ Insertion des images de la galerie (robuste)
    if (Array.isArray(gallery) && gallery.length > 0) {
      for (const img of gallery) {
        const imageUrl = typeof img === 'string' ? img : img?.url;

        if (imageUrl && imageUrl.trim() !== '') {
          try {
            await db.query(
              `INSERT INTO images (url, movie_id)
               VALUES (?, ?)`,
              [imageUrl, movieId]
            );
          } catch (err) {
            console.error('Erreur insertion image:', err.message);
          }
        }
      }
    }

    return { insertId: movieId };
  },
};
