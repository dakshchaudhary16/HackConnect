import mongoose from 'mongoose'

const registrationSchema = new mongoose.Schema({
  hackathon: { type: mongoose.Schema.Types.ObjectId, ref: 'Hackathon', required: true },
  student: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  team: { type: mongoose.Schema.Types.ObjectId, ref: 'Team' },
}, { timestamps: true })

registrationSchema.index({ hackathon: 1, student: 1 }, { unique: true })

export default mongoose.model('Registration', registrationSchema)