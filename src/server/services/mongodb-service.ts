import { MongoClient, Collection, Db } from 'mongodb';
import * as config from '../config/config';

const client = new MongoClient(
  config.mongoDbUrl,
  {
    useNewUrlParser: true,
    useUnifiedTopology: true
  }
);

let defaultDb: Db;

export async function getDefaultCollection<CollectionSchema>(): Promise<Collection<CollectionSchema>> {
  if (!defaultDb) {
    console.log('Creating mongo db services');
    await client.connect();
    defaultDb = client.db(config.mongoDbDefaultDatabase);
  }

  return defaultDb.collection<CollectionSchema>(config.mongoDbDefaultCollection);
}
