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
import historyRouter from "./routes/history.js";
import orderRouter from "./routes/order.js";
import { authenticateJWT } from "./middleware/verify_token.js";
import { configureCloudinary } from "./cloudinary.js";
import path from 'path';
import { fileURLToPath } from 'url';
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

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
app.use(express.static(path.resolve(__dirname, '../../client/dist')));

// app.get('/', async (req, res) => {
//   res.status(200)
//     .send("Server is Working");
// });
app.use("/api/auth/", authRouter);
app.use("/api/products/", productsRouter);
app.use("/api/cart/", cartRouter);
app.use("/api/orders/", orderRouter);
app.use("/api/users/", usersRouter);
app.use("/api/file/", authenticateJWT, fileRouter);
app.use("/api/reviews/", reviewsRouter);
app.use("/api/history/", historyRouter);
app.get("/", (req, res) => {
  res.sendFile(path.resolve(__dirname, '../../client/dist/', 'index.html'));
});
app.use(
/*** @param {Error} err */
  (err, _, res, __) => {
  console.log("CAUGHT ERROR::", err.name, err.message, err.cause);
  res.status(err.status || 500).json({ error: err.message || 'Internal server error.' });
});

app.listen(port, () => {
  console.log(`Example app listening on port http://localhost:${port}/`);
});