
import { Dashboard } from "../models/Dashboard.model.js"

/*
|-----------------------------------------------------------------------
| GET /api/admin/dashboard
|-----------------------------------------------------------------------
| Récupérer toutes les stats du dashboard admin
*/
export const getAdminDashboard = async (req, res) => {
  try {
    // Appel du modèle pour récupérer toutes les stats
    const filmsReviewed = await Dashboard.getFilmsReviewed()
    const jurors = await Dashboard.getJurorsStats()
    const countries = await Dashboard.getCountries()
    const workshops = await Dashboard.getWorkshops()
    const directors = await Dashboard.getDirectorsStats()

    // Retour JSON complet pour le front
    res.json({
      filmsReviewed,
      jurors,
      countries,
      workshops,
      directors
    })
  } catch (err) {
    console.error("Dashboard admin error:", err)
    res.status(500).json({ error: "Erreur serveur lors du chargement du dashboard" })
  }
}
