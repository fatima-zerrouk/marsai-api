import { Dashboard } from '../models/Dashboard.model.js';

export const getAdminDashboard = async (req, res) => {
  try {
    const [movies, jury, countries, workshops, directors] = await Promise.all([
      Dashboard.getMoviesStats(),
      Dashboard.getJuryStats(),
      Dashboard.getCountries(),
      Dashboard.getWorkshopsOccupancy(),
      Dashboard.getDirectorsStats(),
    ]);

    res.json({
      movies,
      jury,
      countries,
      workshops,
      directors,
    });
  } catch (err) {
    console.error('Dashboard admin error:', err);
    res.status(500).json({
      error: 'Erreur serveur lors du chargement du dashboard',
    });
  }
};
