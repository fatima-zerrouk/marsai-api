// require("dotenv").config();
const express = require('express');
const cors = require('cors');
const db = require('./config/database'); // utilise la connexion propre
const app = express();
const port = process.env.PORT || 3000; // utilise la variable .env

app.use(
    cors({
        origin: "http://localhost:5173",
        methods: ["GET", "POST", "PUT", "DELETE"],
        allowedHeaders: ["Content-Type", "Authorization"],
    })
);

// middlewares 
app.use(express.json());

// routes
app.get('/', (req, res) => {
    res.send('Hello World!');
});

app.get('/about', (req, res) => {
    res.send('Autre route');
});

// start server
app.listen(port, () => {
    console.log(`✅ Example app listening on port ${port}`);
});