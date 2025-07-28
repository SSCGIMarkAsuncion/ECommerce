import dotenv from "dotenv";
dotenv.config();
import mongoose from "mongoose";

const connectionString = process.env.MONGODB_CONNECTION_STRING;
const clientOptions = { serverApi: { version: '1', strict: true, deprecationErrors: true } };


export async function connect() {
  try {
    await mongoose.connect(connectionString, clientOptions);
  }
  catch (e) {
    console.log("MONGODB::connect", e);
    await mongoose.disconnect();
  }
}

export const COLLECTIONS = {
  USERS: "users",
  PRODUCTS: "products",
  CARTS: "carts"
};