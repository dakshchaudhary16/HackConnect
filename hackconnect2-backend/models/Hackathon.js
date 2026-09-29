import mongoose from 'mongoose'

const hackathonSchema = new mongoose.Schema({
  name: { type: String, required: true },
  domain: { type: String, required: true },
  date: { type: String, required: true },
  startDate: { type: Date },
  endDate: { type: Date },
  mode: { type: String, enum: ['Online', 'Offline', 'Hybrid'], default: 'Offline' },
  teamSize: { type: String, default: '4' },
  description: { type: String, default: '' },
}, { timestamps: true })

export default mongoose.model('Hackathon', hackathonSchema)