import mongoose from 'mongoose';

export const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      minlength: 2,
      maxlength: 20,
      default: 'User',
      required: false,
    },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    gender: { type: String, enum: ['woman', 'man'], default: 'woman' },
    weight: { type: Number, default: 0 },
    dailySportTime: { type: Number, default: 0 },
    dailyNorm: { type: Number, default: 1500, min: 500, max: 15000 },
    avatarUrl: {
      type: String,
      default:
        'https://collection.cloudinary.com/dojuslnjs/d637fb90dcf69166ae1e1c04c01fb63e?',
    },
  },
  { timestamps: true, versionKey: false },
);
userSchema.methods.toJSON = function () {
  const user = this.toObject();
  delete user.password;
  return user;
};

const UserCollection =
  mongoose.models.users || mongoose.model('users', userSchema);

export { UserCollection };
