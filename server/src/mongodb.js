import { MongoClient, ServerApiVersion } from "mongodb";

let mongoClient = null;

async function connect(uri) {
  if (!mongoClient) {
    mongoClient = new MongoClient(uri, {
      serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
      }
    });
    await mongoClient.connect();
    await mongoClient.db("admin").command({ ping: 1 });
  }
}

/** @returns {Promise<MongoClient>} */
async function client() {
  if (!mongoClient) {
    throw Error("MongoDB is null");
  }

  return mongoClient;
}

export default {
  client: client,
  connect: connect
};