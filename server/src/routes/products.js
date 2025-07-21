import express from "express";
import parseQueryValue from "../utils/query.js";
import { ObjectId } from "mongodb";
import MError from "../error.js";
import { authenticateJWT } from "../middleware/verify_token.js";
import { hasAdminRole, verifyRole } from "../middleware/role.js";
import { hasKeys } from "../utils/obj.js";
import db from "../mongodb.js";
import Products from "../schema/products.js";
import ROLES from "../utils/roles.js";

const { getCollection, COLLECTIONS } = db;

const router = express.Router();

/* QUERY SCHEMA
- Only works if :id does not exist
filter=..;..
tags=..;..
isSale=1 // optional
*/

/**
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 */
async function rootHandler(req, res) {
  const productId = req.params.id;
  const filter = parseQueryValue(req.query.filter);
  const tags = parseQueryValue(req.query.tags);
  const isSale = req.query.isSale == '1';

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

  if (isSale) {
    orConditions.push({
      salePrice: { $exists: true, $gt: 0 }
    });
  }

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

router.post("/add",
  authenticateJWT,
  hasAdminRole,
  async (req, res) => {
    let body = req.body;
    const schema = Products.project();
    schema._id = undefined;
    schema.salePrice = undefined;
    const collection = getCollection(COLLECTIONS.PRODUCTS);

    if (Array.isArray(body)) {
      body = body.map((d) => {
        d.id = undefined;
        return d;
      });

      if (!hasKeys(schema, body[0])) {
        throw new MError(400, "Wrong Schema");
      }

      try {
        await collection.insertMany(body);
      }
      catch (e) {
        console.log(e);
        throw new MError(400, "Failed to add products");
      }
    }
    else {
      body.id = undefined;
      if (!hasKeys(schema, body)) {
        throw new MError(400, "Wrong Schema");
      }
      try {
        await collection.insertOne(body);
      }
      catch (e) {
        console.log(e);
        throw new MError(400, "Failed to add products");
      }
    }

    res.status(200).send("");
});

export default router;