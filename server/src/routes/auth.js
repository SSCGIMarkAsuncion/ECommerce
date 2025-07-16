import express from "express";
import db from "../mongodb.js";
import encryption from "../encryption.js";
import token from "../utils/jwt.js";
import User from "../schema/user.js";
import MError from "../error.js";
import { authenticateJWT } from "../middleware/verify_token.js";
import { verifyRole } from "../middleware/role.js";
import ROLES from "../utils/roles.js";

let { createToken, verifyToken } = token;
let { client } = db;

const router = express.Router();

// TODO add password validation on register
router.post("/register",
 authenticateJWT,
 verifyRole,
 async (req, res) => {
  const db = await client();
  const body = req.body;
  const role = req.query.role || ROLES.USER;
  const tokenRole = req.tokenPayload.role;

  if (role == ROLES.ADMIN && tokenRole != ROLES.SUPERADMIN) {
    throw new MError(400, "Request Not Allowed");
  }

  const user = {
    email: body.email,
    username: body.username,
    password: encryption.encrypt(body.password),
    role: role
  };

  const ecommerceDb = db.db("ecommerce");
  const collection = ecommerceDb.collection("users");
  const doc = await collection.findOne({
    email: user.email
  }, {
    projection: { _id: 1 }
  });

  if (doc) {
    throw new MError(400, "User already exists");
  }

  const result = await collection.insertOne(user);
  // console.log(result);

  res.status(200).send("");
});

router.get("/verify", authenticateJWT, async (req, res) => {
  console.log(req.tokenPayload);
  return res.status(200).json(req.tokenPayload);
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