import { MongoClient } from 'mongodb';

let connection;

export default async function getMongoClient() {
  const uri = process.env.MONGODB_URI;
  if (!uri) throw new Error('Thiếu MONGODB_URI trong Environment Variables');

  if (process.env.NODE_ENV === 'development') {
    globalThis._mongoClientPromise ??= new MongoClient(uri).connect().catch(error => {
      globalThis._mongoClientPromise = undefined;
      throw error;
    });
    return globalThis._mongoClientPromise;
  }

  connection ??= new MongoClient(uri).connect().catch(error => {
    connection = undefined;
    throw error;
  });
  return connection;
}
