import mongoose, { model } from 'mongoose';

const waterVolumeSchema = new mongoose.Schema({
  volume: {
    type: Number,
    required: true,
    min: 50,
    max: 5000,
  },
  date: {
    type: String,
    required: true,
    match: /^\d{4}-\d{2}-\d{2} \d{2}:\d{2}$/,
  },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
});

export const WaterCollection = model('WaterVolume', waterVolumeSchema);
