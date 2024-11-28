//connect DB
import mongoose from 'mongoose';
import { MONGO_DB_VARS } from '../constants/index.js';
import { env } from '../utils/env.js';

export const initMongoConnection = async () => {
  try {
    const user = env(MONGO_DB_VARS.MONGODB_USER);
    const password = env(MONGO_DB_VARS.MONGODB_PASSWORD);
    const url = env(MONGO_DB_VARS.MONGODB_URL);
    const db = env(MONGO_DB_VARS.MONGODB_DB);
    await mongoose.connect(
      `mongodb+srv://${user}:${password}@${url}/${db}?retryWrites=true&w=majority&appName=Cluster0`,
    );
    console.log('Mongo connection successfully established!');
  } catch (error) {
    console.log(error);
    throw error;
  }
};
