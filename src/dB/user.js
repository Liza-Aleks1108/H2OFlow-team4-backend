import mongoose from 'mongoose';

export const userSchema = new mongoose.Schema(
  {
    name: { type: String, minlength: 2, maxlength: 12, default: '' },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    gender: { type: String, enum: ['woman', 'man'], default: 'woman' },
    weight: { type: Number, default: 0 },
    dailySportTime: { type: Number, default: 0 },
    dailyNorm: { type: Number, default: 1500, min: 500, max: 15000 },
    avatarUrl: {
      type: String,
      default:
        'https://res.cloudinary.com/dyfgsjdk5/image/upload/c_thumb,w_200,g_face/v1741464082/296fe121-5dfa-43f4-98b5-db50019738a7_hxqowp.jpg',
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
