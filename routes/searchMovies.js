const express = require('express');
const router = express.Router();
const searchMoviesController = require('../controllers/searchMovies.controller');

router.get('/search', searchMoviesController.search);

module.exports = router;
