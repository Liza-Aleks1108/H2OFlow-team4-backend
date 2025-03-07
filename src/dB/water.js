import mongoose, { model } from 'mongoose';

const waterVolumeSchema = new mongoose.Schema(
  {
    volume: {
      type: String,
      required: true,
    },
    day: {
      type: String,
      required: true,
    },
    time: {
      type: String,
      required: true,
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
