import { UserCollection } from '../dB/user.js';

export const getUserById = async (id) => {
  return await UserCollection.findById(id);
};

export const updateUser = async (id, payload) => {
  return await UserCollection.findByIdAndUpdate(id, payload, {
    new: true,
    runValidators: true,
  });
};
