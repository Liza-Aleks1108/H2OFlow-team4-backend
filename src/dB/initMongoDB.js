import mongoose from 'mongoose';
import { getEnvVar } from '../utils/getEnvVar.js';

export const initMongoDb = async () => {
  try {
    const user = getEnvVar('MONGODB_USER');
    const password = getEnvVar('MONGODB_PASSWORD');
    const host = getEnvVar('MONGODB_URL');
    const database = getEnvVar('MONGODB_DB');
    await mongoose.connect(
      `mongodb+srv://${user}:${password}@${host}/${database}?retryWrites=true&w=majority&appName=Cluster0`,
    );
    console.log('MongoDB connected, database:', database);
  } catch (error) {
    console.log('Error while setting up mongo connection', error);
    throw error;
  }
};
