import {MongoClient} from 'old/mongodb';

let uri = process.env.MONGODB_URI;
let dbName = process.env.MONGODB_DB;

let cachedClient;
let cachedDb;

if (!uri) {
    throw new Error(
        'Please define the MONGODB_URI environment variable inside .env'
    );
}

if (!dbName) {
    throw new Error(
        'Please define the MONGODB_DB environment variable inside .env'
    );
}

export async function dbConnect() {
    if (cachedDb) {
        return cachedDb;
    }

    const client = await MongoClient.connect(uri);

    const db = await client.db(dbName);

    cachedClient = client;
    cachedDb = db;

    return db;
}
