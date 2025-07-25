import express from "express";
import morgan from "morgan";
import cookieParser from 'cookie-parser';
import cors from "cors";
import dotenv from "dotenv";
dotenv.config();

import db from "./mongodb.js";
const { connect } = db;
import authRouter from "./routes/auth.js";
import productsRouter from "./routes/products.js";
import cartRouter from "./routes/cart.js";
import fileRouter from "./routes/file.js";
import { authenticateJWT } from "./middleware/verify_token.js";
import { configureCloudinary } from "./cloudinary.js";

const app = express();
const port = 3000;

connect(process.env.MONGODB_CONNECTION_STRING);
configureCloudinary();

app.use(morgan("dev"));
app.use(cors({
  origin: process.env.CLIENT_HOST,
  credentials: true
}));
app.use(cookieParser());
app.use(express.text());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get('/', async (req, res) => {
  res.status(200)
    .send("Server is Working");
});
app.use("/auth/", authRouter);
app.use("/products/", productsRouter);
app.use("/cart/", authenticateJWT, cartRouter);
app.use("/file/", authenticateJWT, fileRouter);
app.use((err, _, res, __) => {
  console.log("ERROR::", err);
  res.status(err.status || 500).json({ error: err.message || 'Internal server error.' });
});

app.listen(port, () => {
  console.log(`Example app listening on port http://localhost:${port}/`);
});