import mongoose from 'mongoose'

const teamSchema = new mongoose.Schema({
  hackathon: { type: mongoose.Schema.Types.ObjectId, ref: 'Hackathon', required: true },
  leader: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  members: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  requiredSize: { type: Number, required: true },
  registered: { type: Boolean, default: false },
}, { timestamps: true })

teamSchema.index({ hackathon: 1, leader: 1 }, { unique: true })

export default mongoose.model('Team', teamSchema)