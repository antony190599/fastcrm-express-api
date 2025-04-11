import mongoose from 'mongoose';

const plantillaSchema = new mongoose.Schema({
  type: { type: String, required: true, index: true },
  content: { type: String, required: true, index: 'text' },
  labels: { type: [String], default: [] },
  author: { type: String, required: true },
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.model('Plantilla', plantillaSchema);
