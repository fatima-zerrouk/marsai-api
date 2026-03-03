import { db } from '../config/database.config.js';

export const Form = {
  create: async ({
    formData,
    directorId,
    thumbnailUrl,
    videoUrl,
    galleryUrls,
  }) => {
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
          creative_process, 
          ia_tools, 
          has_subs, 
          cover_image, 
          director_id
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `;

      const params = [
        formData.original_title || '',
        formData.english_title || '',
        videoUrl, // L'URL Scaleway du fichier vidéo
        formData.duration || 0,
        formData.is_hybrid ? 1 : 0,
        formData.language || 'FRENCH',
        formData.original_synopsis || '',
        formData.english_synopsis || '',
        formData.creative_process || '',
        formData.ia_tools || '',
        formData.has_subs ? 1 : 0,
        thumbnailUrl, // URL de la vignette
        directorId,
      ];

      const [result] = await db.query(query, params);
      const movieId = result.insertId;

      // 2. Insertion des images dans la table 'images' (id, url, movie_id)
      if (galleryUrls && movieId) {
        // On s'assure que galleryUrls est un tableau utilisable
        const urls =
          typeof galleryUrls === 'string'
            ? JSON.parse(galleryUrls)
            : galleryUrls;

        if (Array.isArray(urls) && urls.length > 0) {
          // Requête spécifique pour ta table 'images'
          const imageQuery = 'INSERT INTO images (url, movie_id) VALUES (?, ?)';

          for (const imageUrl of urls) {
            await db.query(imageQuery, [imageUrl, movieId]);
          }
          console.log(
            `✅ ${urls.length} images enregistrées dans la table 'images'.`
          );
        }
      }

      return result;
    } catch (error) {
      console.error('🔥 Erreur MySQL dans le modèle:', error.message);
      throw error;
    }
  },
};
