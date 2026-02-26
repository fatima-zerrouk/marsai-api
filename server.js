import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import { db } from './config/database.config.js';

// Imports des routes
import authRoutes from './routes/auth.routes.js';
import dashboardRoutes from './routes/dashboard.routes.js';
import adminJuryRoutes from './routes/adminJury.routes.js';
import formRoutes from './routes/form.routes.js';
import submitRoutes from './routes/submit.routes.js';
import mailJury from './routes/juryMail.routes.js';
import adminMoviesRoutes from './routes/adminMovies.routes.js';
import adminMoviesResult from './routes/adminMoviesResult.routes.js';
import movieRoutes from './routes/movie.routes.js';
import juryDashboard from './routes/juryDashboard.routes.js';
import ratingsRoutes from './routes/rating.routes.js';

const app = express();
const port = process.env.PORT || 3001;

// --- CONFIGURATION CORS ---
app.use(
  cors({
    origin: [
      'http://localhost:5173',
      'http://localhost:5174', 
      'http://localhost:5175',
      'http://localhost:5176'
    ],
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true,
  })
);

// --- PARSING DES REQUÊTES (Une seule fois avec les limites) ---
app.use(express.json({ limit: '100mb' }));
app.use(express.urlencoded({ limit: '100mb', extended: true }));

// --- ROUTES ---
app.get('/', (req, res) => res.send('API Marsai is running!'));

app.use('/auth', authRoutes);
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/admin/jury', adminJuryRoutes);
app.use('/api/jury-mail', mailJury);
app.use('/api/form', formRoutes);
app.use('/api/submit', submitRoutes); // Route pour le formulaire réalisateur ?
app.use('/api/admin/movies', adminMoviesRoutes);
app.use('/api/admin/movies-result', adminMoviesResult);
app.use('/api/movies', movieRoutes); // C'est ici que /submit est géré pour les films
app.use('/dashboard/jury', juryDashboard);
app.use('/ratings', ratingsRoutes);
app.use('/api/movies-and-directors', movieRoutes);

// --- LANCEMENT DU SERVEUR ---
app.listen(port, () => {
  console.log(`✅ Server listening on port ${port}`);
});

// --- CONNEXION DB ---
db.getConnection()
  .then(() => console.log('✅ Database connected to MAMP MySQL'))
  .catch(err => {
    console.error('❌ Database connection error. Check if MAMP is started and port is 8889.');
    console.error(err.message);
  });