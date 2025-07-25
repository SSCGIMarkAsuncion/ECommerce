import express from "express";
import db from "../mongodb.js";
import encryption from "../encryption.js";
import token from "../utils/jwt.js";
import User from "../schema/user.js";
import MError from "../error.js";
import { authenticateJWT, authenticateJWTIfExist } from "../middleware/verify_token.js";
import { verifyRole } from "../middleware/role.js";
import ROLES from "../utils/roles.js";

let { createToken } = token;
let { getCollection, COLLECTIONS } = db;

const router = express.Router();

// TODO add password validation on register
router.post("/register",
 authenticateJWTIfExist,
 verifyRole,
 async (req, res) => {
  const body = req.body;
  console.log("/register::BODY", body);
  const role = req.query.role || ROLES.USER;
  const tokenRole = req.tokenPayload? req.tokenPayload.role:null;

  if ((role == ROLES.ADMIN || role == ROLES.SUPERADMIN) && tokenRole != ROLES.SUPERADMIN) {
    throw new MError(400, "Request Not Allowed");
  }

  const user = {
    email: body.email,
    username: body.username,
    password: encryption.encrypt(body.password),
    role: role
  };
  for (const key of Object.keys(user)) {
    if (!user[key])
        throw new MError(400, "Credentials is empty");
  }

  const collection = getCollection(COLLECTIONS.USERS);
  const doc = await collection.findOne({
    $or: [
      { email: user.email },
      { username: body.username }
    ]
  }, {
    projection: { _id: 1 }
  });

  if (doc) {
    throw new MError(400, "User already exists");
  }

  try {
    await collection.insertOne(user);
  }
  catch (e) {
    throw new MError(400, "An error occured. Please try again.")
  }
  console.log("Registered", user);

  res.status(200).send("");
});

router.get("/verify", authenticateJWT, async (req, res) => {
  console.log(req.tokenPayload);
  return res.status(200).json(req.tokenPayload);
});

router.post("/login", async (req, res) => {
  const body = req.body;
  console.log("/login::BODY", body);
  const user = {
    email: body.email,
    password: encryption.encrypt(body.password)
  };
  for (const key of Object.keys(user)) {
    if (!user[key])
        throw new MError(400, "Credentials is empty");
  }

  const collection = getCollection(COLLECTIONS.USERS);
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
    id: doc._id,
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
  res.clearCookie("TOKEN", {
    maxAge: 300,
    secure: true,
    httpOnly: true
  });

  return res.status(200).send("");
});

export default router;