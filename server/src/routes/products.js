import express from "express";
import db from "../mongodb.js";
import parseQueryValue from "../utils/query.js";
import { ObjectId } from "mongodb";
import MError from "../error.js";

// let { createToken, verifyToken } = token;
let { getCollection, COLLECTIONS } = db;

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
  const productId = req.params.id;
  const filter = parseQueryValue(req.query.filter);
  const tags = parseQueryValue(req.query.tags);
  console.log("filter", filter, "tags", tags);
  const collection = getCollection(COLLECTIONS.PRODUCTS);
  if (productId) {
    const id = new ObjectId(productId)
    console.log(id);
    const doc = await collection.findOne({
      _id: new ObjectId(productId)
    });
    if (doc == null) {
      throw new MError(400, "Invalid Id");
    }
    doc.id = doc._id.toString();
    return res.status(200).json(doc);
  }

  // Build $or query for partial matches
  let orConditions = [];
  filter.forEach(f => {
    orConditions.push({ name: { $regex: f, $options: "i" } });
    orConditions.push({ description: { $regex: f, $options: "i" } });
  });
  tags.forEach(tag =>
    orConditions.push({ tags: tag })
  );

  let query = {};
  if (orConditions.length > 0) {
    query = { $or: orConditions };
  }

  const docs = await collection.find(query).toArray();
  return res.status(200).json(docs);
}

router.get("/", async (req, res) => {
  await rootHandler(req, res);
});

router.get("/:id", async (req, res) => {
  await rootHandler(req, res);
});

export default router;