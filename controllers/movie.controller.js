import { db } from '../config/database.config.js';
import { Form } from '../models/submit.model.js';
import { uploadToScaleway } from '../services/uploadService.js';
import { getAllMoviesWithDirector } from '../models/movies.model.js';

export const getAllMovies = async (req, res) => {
  try {
    const movies = await getAllMoviesWithDirector();
    res.json(movies);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Impossible de récupérer les movies' });
  }
};

// Ajouter autres méthodes du CRUD

// --- FONCTION 1 : RÉCUPÉRER UN FILM ---
export const getMovieById = async (req, res) => {
  try {
    const { id } = req.params;

    const [movieRows] = await db.query(
      'SELECT * FROM movies WHERE id = ? AND status = "approved" AND is_visible = 1',
      [id]
    );

    if (movieRows.length === 0) {
      return res.status(404).json({ message: 'Film non trouvé' });
    }
    const movie = movieRows[0];

    const [collabRows] = await db.query(
      'SELECT lastname, contribution FROM collaborators WHERE movie_id = ?',
      [id]
    );

    const [directorRows] = await db.query(
      `SELECT d.firstname, d.lastname
       FROM directors d
       JOIN movies m ON d.id = m.director_id
       WHERE m.id = ?`,
      [id]
    );

    const directorName =
      directorRows.length > 0
        ? `${directorRows[0].firstname} ${directorRows[0].lastname}`
        : 'Réalisateur inconnu';

    res.json({
      ...movie,
      collaborators: collabRows,
      director: directorName,
    });
  } catch (error) {
    console.error('❌ Erreur getMovieById:', error);
    res.status(500).json({ message: 'Erreur serveur' });
  }
};

// --- FONCTION 2 : ENREGISTRER UN FILM ---
export const submitMovieController = async (req, res) => {
  try {
    console.log('📂 Fichiers reçus:', req.files);
    console.log('📝 Body reçu:', req.body);

    // 1. Récupération et parsing des données
    const formData = JSON.parse(req.body.formData || '{}');
    const collaborateurs = JSON.parse(req.body.collaborateurs || '[]');
    const directorId = req.body.directorId;

    if (!directorId) {
      return res.status(400).json({ message: 'ID du réalisateur manquant' });
    }

    // 2. Gestion des uploads vers Scaleway

    // Upload de la Vignette
    let thumbnailUrl = null;
    if (req.files?.thumbnail && req.files.thumbnail[0]) {
      console.log('☁️ Upload vignette en cours...');
      thumbnailUrl = await uploadToScaleway(
        req.files.thumbnail[0],
        'thumbnails'
      );
    }

    // --- NOUVEAU : Upload de la Vidéo MP4 ---
    let videoUrl = null;
    if (req.files?.video && req.files.video[0]) {
      console.log('☁️ Upload vidéo en cours (attention au délai)...');
      videoUrl = await uploadToScaleway(req.files.video[0], 'videos');
    }

    // Upload de la Galerie
    let galleryUrls = [];
    if (req.files?.gallery) {
      console.log(
        `☁️ Upload de ${req.files.gallery.length} images de galerie...`
      );
      for (const file of req.files.gallery) {
        const url = await uploadToScaleway(file, 'gallery');
        galleryUrls.push(url);
      }
    }

    // 3. Insertion en base de données via le modèle
    const result = await Form.create({
      formData,
      collaborateurs,
      directorId,
      thumbnailUrl, // Sera mappé sur cover_image
      videoUrl, // Sera mappé sur video_url (ton MP4)
      galleryUrls, // Sera utilisé pour la table 'images'
    });

    console.log('✅ Film enregistré en base, ID:', result.insertId);

    res.status(201).json({
      success: true,
      message: 'Film et médias enregistrés avec succès',
      movieId: result.insertId,
    });
  } catch (error) {
    console.error('🔥 Erreur critique submitMovieController:', error);
    res.status(500).json({
      success: false,
      message: "Erreur lors de l'enregistrement",
      error: error.message,
    });
  }
};
