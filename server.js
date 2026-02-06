import 'dotenv/config'
import express from 'express'
import cors from 'cors'
import db from './config/database.config.js'
import authRoutes from './routes/auth.routes.js'
import dashboardRoutes from './routes/dashboard.routes.js'  

const app = express()
const port = process.env.PORT || 3000

app.use(cors({ origin: 'http://localhost:5173', methods: ['GET','POST','PUT','DELETE'], 
allowedHeaders: ['Content-Type','Authorization'] }))
app.use(express.json())

app.get('/', (req, res) => res.send('Hello World!'))
app.use('/auth', authRoutes)
app.get('/about', (req, res) => res.send('Autre route'))
app.use('/api', dashboardRoutes)


app.listen(port, () => console.log(`✅ Server listening on port ${port}`))

db.getConnection()
  .then(() => console.log('✅ Database connected'))
  .catch(err => console.error('❌ Database connection error:', err))
