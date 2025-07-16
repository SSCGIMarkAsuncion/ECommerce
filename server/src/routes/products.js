import express from "express";
import db from "../mongodb.js";
import token from "../utils/jwt.js";

// let { createToken, verifyToken } = token;
let { client } = db;

const router = express.Router();

/* QUERY SCHEMA
- Only works if :id does not exist
filter=..;..
tags=..;..
*/

/**
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 */
async function rootHandler(req, res) {
  console.log(req.params);
  console.log(req.query);

  return res.status(200).send("");
}

router.get("/", async (req, res) => {
  rootHandler(req, res);
});

router.get("/:id", async (req, res) => {
  rootHandler(req, res);
});

export default router;