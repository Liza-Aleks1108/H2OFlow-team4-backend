import mongoose, { model } from 'mongoose';

const waterVolumeSchema = new mongoose.Schema(
  {
    volume: {
      type: String,
      required: true,
    },
    date: {
      type: String,
      required: true,
      match: /^\d{4}-\d{2}-\d{2} \d{2}:\d{2}$/,
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
  },
  {
    timestamps: true,
    versionKey: false,
  },
);

export const WaterCollection = model('WaterVolume', waterVolumeSchema);
