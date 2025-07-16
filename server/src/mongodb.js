import { Collection, MongoClient, ServerApiVersion } from "mongodb";

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

/** @returns {MongoClient} */
function client() {
  if (!mongoClient) {
    throw Error("MongoDB is null");
  }

  return mongoClient;
}

/** @returns {Collection<Document>} */
function getCollection(collection) {
  const dbclient = client();
  return dbclient.db("ecommerce").collection(collection);
}

export default {
  client,
  connect,
  getCollection,
  COLLECTIONS: {
    USERS: "users",
    PRODUCTS: "products"
  }
};