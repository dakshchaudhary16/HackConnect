import mongoose from 'mongoose'
import bcrypt from 'bcryptjs'
import dotenv from 'dotenv'
import User from '../models/User.js'

dotenv.config()

async function seed() {
  await mongoose.connect(process.env.MONGO_URI)
  const existing = await User.findOne({ email: 'admin@hackconnect.com' })
  if (existing) {
    console.log('Admin already exists')
    process.exit(0)
  }
  const hashed = await bcrypt.hash('admin123', 10)
  await User.create({ name: 'Admin', email: 'admin@hackconnect.com', password: hashed, role: 'admin' })
  console.log('Admin created: admin@hackconnect.com / admin123')
  process.exit(0)
}

seed()