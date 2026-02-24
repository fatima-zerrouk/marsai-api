import create from '../models/rating.model.js';

const createRating = (req, res) => {
    const {rate, userId, movieId} = req.body;
    create([rate, userId, movieId], (error, result) => {
        if (error){
            console.log("erreur lors de la requete sql", error.message);
            return res.status(500).send("erreur serveur");
        }
        // res.json(result);
         res.status(201).json({ message: "Note enregistrée", ratingId: result.insertId });
    });
};

export default createRating;