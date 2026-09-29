import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import connectDB from './config/db.js'
import authRoutes from './routes/auth.routes.js'
import hackathonRoutes from './routes/hackathon.routes.js'
import adminRoutes from './routes/admin.routes.js'
import teamRoutes from './routes/team.routes.js'
import profileRoutes from './routes/profile.routes.js'

dotenv.config()
connectDB()

const app = express()
app.use(cors())
app.use(express.json())

app.use('/api/auth', authRoutes)
app.use('/api/hackathons', hackathonRoutes)
app.use('/api/admin', adminRoutes)
app.use('/api/teams', teamRoutes)
app.use('/api/profile', profileRoutes)

app.get('/api/health', (req, res) => res.json({ status: 'ok' }))

const PORT = process.env.PORT || 5000
app.listen(PORT, () => console.log(`Server running on port ${PORT}`))
