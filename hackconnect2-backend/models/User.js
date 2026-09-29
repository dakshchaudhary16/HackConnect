import mongoose from 'mongoose'

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true, lowercase: true, trim: true },
  password: { type: String, required: true },
  role: { type: String, enum: ['student', 'admin'], default: 'student' },
  year: { type: String, default: '1' },
  bio: { type: String, default: '' },
  skills: { type: [String], default: [] },
  github: { type: String, default: '' },
  linkedin: { type: String, default: '' },
}, { timestamps: true })

export default mongoose.model('User', userSchema)