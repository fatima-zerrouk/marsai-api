import { Form } from '../models/submit.model.js';

import { uploadToScaleway } from '../services/uploadService.js';
// Importe ton modèle de base de données (ex: Movie)
// import Movie from '../models/movie.model.js';

export const submitMovieController = async (req, res) => {
  try {
    const { original_title, directorId, collaborateurs } = req.body;
    const files = req.files; // Contient les fichiers traités par Multer

    let thumbnailUrl = null;
    let videoUrl = null;
    let galleryUrls = [];

    // 1. Upload de la vignette (thumbnail)
    if (files.thumbnail) {
      thumbnailUrl = await uploadToScaleway(files.thumbnail[0], 'thumbnails');
    }

    // 2. Upload de la vidéo
    if (files.video) {
      videoUrl = await uploadToScaleway(files.video[0], 'videos');
    }

    // 3. Upload de la galerie (plusieurs fichiers)
    if (files.gallery) {
      const uploadPromises = files.gallery.map(file =>
        uploadToScaleway(file, 'gallery')
      );
      galleryUrls = await Promise.all(uploadPromises);
    }

    // 4. Sauvegarde dans la base de données
    // Ici, tu adaptes selon ton modèle de BDD
    /* const newMovie = await Movie.create({
      title: original_title,
      director: directorId,
      thumbnail: thumbnailUrl,
      video: videoUrl,
      gallery: galleryUrls,
      collaborators: JSON.parse(collaborateurs)
    });
    */

    console.log('Upload réussi :', { thumbnailUrl, videoUrl, galleryUrls });

    res.status(201).json({
      message: 'Film enregistré avec succès sur Scaleway',
      data: { thumbnailUrl, videoUrl, galleryUrls },
    });
  } catch (error) {
    console.error('Erreur Controller SubmitMovie:', error);
    res.status(500).json({ error: "Erreur lors de l'enregistrement du film" });
  }
};

export const createForm = async (req, res) => {
  try {
    console.log('💡 DONNÉES REÇUES :', req.body);

    // On extrait formData, collaborateurs ET le fameux directorId
    const { formData, collaborateurs, directorId } = req.body;

    if (!formData) {
      return res.status(400).json({ error: 'formData manquant' });
    }

    // On passe tout au modèle, y compris l'ID du réalisateur
    const result = await Form.create({ formData, collaborateurs, directorId });

    console.log('✅ FILM ENREGISTRÉ AVEC ID RÉALISATEUR:', directorId);

    res.status(201).json({
      success: true,
      message: 'Film enregistré et lié au réalisateur',
      id: result.insertId,
    });
  } catch (error) {
    console.log('🔥 ERREUR:', error.message);
    res.status(500).json({ error: error.message });
  }
};
