import { db } from '../config/database.config.js';

export const Form = {
<<<<<<< feat/form-director
  create: async ({ formData, directorId, thumbnailUrl, videoUrl, galleryUrls }) => {
=======
  async create(data, directorId) {
    if (!data || !data.formData) {
      throw new Error('Les données du formulaire (formData) sont manquantes');
    }

    const finalDirectorId = directorId || null;
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

    // ✅ Validation
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
    const connection = await db.getConnection();

>>>>>>> dev
    try {
      // 1. Insertion du film dans la table 'movies'
      const query = `
        INSERT INTO movies (
          original_title, 
          english_title, 
          video_url, 
          duration,
          is_hybrid, 
          language, 
          original_synopsis, 
          english_synopsis,
<<<<<<< feat/form-director
          creative_process, 
          ia_tools, 
          has_subs, 
          cover_image, 
          director_id
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `;
=======
          creative_process,
          ia_tools,
          has_subs ? 1 : 0,
          cover_image,
          finalDirectorId,
        ]
      );

      const movieId = movieResult.insertId;

      // 2️⃣ Update director
      if (finalDirectorId) {
        await connection.query(
          `UPDATE directors SET movie_id = ? WHERE id = ?`,
          [movieId, finalDirectorId]
        );
      }
>>>>>>> dev

      const params = [
        formData.original_title || '',
        formData.english_title || '',
        videoUrl,         // L'URL Scaleway du fichier vidéo
        formData.duration || 0,
        formData.is_hybrid ? 1 : 0,
        formData.language || 'FRENCH',
        formData.original_synopsis || '',
        formData.english_synopsis || '',
        formData.creative_process || '',
        formData.ia_tools || '',
        formData.has_subs ? 1 : 0,
        thumbnailUrl,     // URL de la vignette
        directorId
      ];

<<<<<<< feat/form-director
      const [result] = await db.query(query, params);
      const movieId = result.insertId;
=======
      // 4️⃣ Insertion galerie (UNE SEULE FOIS)
      if (Array.isArray(gallery) && gallery.length > 0) {
        for (const img of gallery) {
          const imageUrl = typeof img === 'string' ? img : img?.url;
>>>>>>> dev

      // 2. Insertion des images dans la table 'images' (id, url, movie_id)
      if (galleryUrls && movieId) {
        // On s'assure que galleryUrls est un tableau utilisable
        const urls = typeof galleryUrls === 'string' ? JSON.parse(galleryUrls) : galleryUrls;
        
        if (Array.isArray(urls) && urls.length > 0) {
          // Requête spécifique pour ta table 'images'
          const imageQuery = 'INSERT INTO images (url, movie_id) VALUES (?, ?)';
          
          for (const imageUrl of urls) {
            await db.query(imageQuery, [imageUrl, movieId]);
          }
          console.log(`✅ ${urls.length} images enregistrées dans la table 'images'.`);
        }
      }

<<<<<<< feat/form-director
      return result;
    } catch (error) {
      console.error("🔥 Erreur MySQL dans le modèle:", error.message);
      throw error;
=======
      await connection.commit();
      return { insertId: movieId };
    } catch (err) {
      await connection.rollback();
      throw err;
    } finally {
      connection.release();
>>>>>>> dev
    }
  },
};
