import 'dotenv/config'
import express from 'express'
import cors from 'cors'
import db from './config/database.config.js'
import authRoutes from './routes/auth.routes.js'
import dashboardRoutes from './routes/dashboard.routes.js'  
import adminJuryRoutes from './routes/adminJury.routes.js'
import formRoutes from './routes/form.routes.js'
import submitRoutes from './routes/submit.routes.js'

const app = express();
const port = process.env.PORT || 3001;

app.use(cors({ 
  origin: [
    'http://localhost:5173', 
  ], 
  methods: ['GET','POST','PUT','DELETE'], 
  allowedHeaders: ['Content-Type','Authorization'],
  credentials: true
}));

app.use(express.json());

// --- ROUTES ---
app.get('/', (req, res) => res.send('API is running...'));

app.use('/auth', authRoutes);
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/admin/jury', adminJuryRoutes);
app.use('/api/form', formRoutes);
app.use('/api/submit', submitRoutes);


app.listen(port, () => console.log(`🚀 Server running on port ${port}`));

db.getConnection()
  .then(() => console.log('✅ Database connected'))
  .catch(err => console.error('❌ Database connection error:', err));