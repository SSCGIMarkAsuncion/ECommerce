import express from "express";
import db from "../mongodb.js";
import encryption from "../encryption.js";
import token from "../utils/jwt.js";
import { User } from "../schema/user.js";
import MError from "../error.js";

let { createToken, verifyToken } = token;
let { client } = db;

const router = express.Router();

router.post("/register",
  async (req, res) => {
  const db = await client();
  const body = req.body;

  const user = {
    email: body.email,
    username: body.username,
    password: encryption.encrypt(body.password),
    role: "user"
  };

  const ecommerceDb = db.db("ecommerce");
  const collection = ecommerceDb.collection("users");
  const doc = await collection.findOne({
    email: user.email
  }, {
    projection: { _id: 1 }
  });

  if (doc) {
    return res.status(400)
      .json({
        email: "User already exists"
      });
  }

  const result = await collection.insertOne(user);
  // console.log(result);

  res.status(200).send("");
});

router.get("/verify", async (req, res) => {
  const token = req.cookies.TOKEN;
  const decoded = verifyToken(token);

  // console.log(decoded);

  if (decoded == null) {
    throw new MError(400, "Token Invalid");
  }
  return res.status(200).json(decoded);
});

router.post("/login", async (req, res) => {
  // console.log(req.body);
  // console.log(req.query);

  const body = req.body;
  const user = {
    email: body.email,
    password: encryption.encrypt(body.password)
  };

  const db = await client();
  const ecommerceDb = db.db("ecommerce");
  const collection = ecommerceDb.collection("users");
  const doc = await collection.findOne({
    email: user.email,
    password: user.password
  }, {
    projection: User.project()
  });
  // console.log(doc);
  if (doc == null) {
    throw new MError(400, "User does not exists");
  }

  const jwtPayload = {
    email: doc.email,
    username: doc.username,
    role: doc.role
  };
  // console.log(doc, jwtPayload);

  const token = createToken(jwtPayload);
  res.cookie("TOKEN", token, {
    secure: true,
    httpOnly: true
  });

  return res.status(200).json(jwtPayload);
});

router.get("/logout", async (req, res) => {
  res.cookie("TOKEN", ":removed:", {
    maxAge: 300,
    secure: true,
    httpOnly: true
  });

  return res.status(200).send("");
});

export default router;