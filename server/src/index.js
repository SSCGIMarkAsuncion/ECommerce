import express from "express";
import morgan from "morgan";
import cookieParser from 'cookie-parser';
import cors from "cors";
import { connect as configureMongoDb } from "./mongodb.js";
import authRouter from "./routes/auth.js";
import productsRouter from "./routes/products.js";
import cartRouter from "./routes/cart.js";
import fileRouter from "./routes/file.js";
import usersRouter from "./routes/user.js";
import reviewsRouter from "./routes/reviews.js";
import { authenticateJWT } from "./middleware/verify_token.js";
import { configureCloudinary } from "./cloudinary.js";

const app = express();
const port = 3000;

configureMongoDb();
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
app.use("/cart/", cartRouter);
app.use("/users/", usersRouter);
app.use("/file/", authenticateJWT, fileRouter);
app.use("/reviews/", reviewsRouter);
app.use(
/*** @param {Error} err */
  (err, _, res, __) => {
  console.log("CAUGHT ERROR::", err.name, err.message, err.cause);
  res.status(err.status || 500).json({ error: err.message || 'Internal server error.' });
});

app.listen(port, () => {
  console.log(`Example app listening on port http://localhost:${port}/`);
});