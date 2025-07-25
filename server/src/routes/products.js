import express from "express";
import parseQueryValue from "../utils/query.js";
import { ObjectId } from "mongodb";
import MError from "../error.js";
import { authenticateJWT } from "../middleware/verify_token.js";
import { hasAdminRole, hasSuperAdminRole, verifyRole } from "../middleware/role.js";
import { checkSchema, hasKeys } from "../utils/obj.js";
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

router.delete("/delete/:id",
  authenticateJWT,
  hasSuperAdminRole,
  async (req, res) => {
    const productId = new ObjectId(req.params.id);
    const collection = getCollection(COLLECTIONS.PRODUCTS);
    try {
      await collection.deleteOne({
        _id: productId
      });
    }
    catch (e) {
      throw new MError(400, `Failed to delete Product ${productId.toString()}. ${e}`)
    }

    return res.status(200).send("");
});

router.put("/update/:id",
  authenticateJWT,
  hasAdminRole,
  async (req, res) => {
    let body = req.body;
    if (!body) throw new MError(400, "Body is Empty");

    const schema = Products.projectUpdate();

    const collection = getCollection(COLLECTIONS.PRODUCTS);
    const productId = new ObjectId(req.params.id);

    const copy = {
      ...body,
      id: undefined,
      salePrice: undefined
    };
    const err = checkSchema(schema, copy);
    if (err) throw err;

    /*** @type {Products} */
    const set = {
      updatedAt: new Date(Date.now()),
      name: body.name,
      description: body.description,
      imgs: body.imgs,
      price: body.price,
      salePrice: body.salePrice
    };
    for (const key of Object.keys(set)) {
      const item = set[key];
      if (item == undefined) {
        delete set[key];
      }
    }
    if (set.imgs.length == 0) {
      // do not overwrite images if the update is length 0
      delete set.imgs
    }

    console.log("SET", set);

    try {
      await collection.updateOne(
        { _id: productId },
        {
          $set: set
        }
      );
    }
    catch (e) {
      console.log("ERR", e);
      throw new MError(400, "Failed to update document");
    }

    return res.status(200).send("");
});

router.post("/add",
  authenticateJWT,
  hasAdminRole,
  async (req, res) => {
    let body = req.body;
    const schema = Products.projectUpdate();
    const collection = getCollection(COLLECTIONS.PRODUCTS);

    const isArray = Array.isArray(body);

    if (isArray) {
      body = body.map((d) => {
        d.id = undefined;

        d.createdAt = new Date(Date.now());
        d.updatedAt = new Date(Date.now());

        return d;
      });
      const err = checkSchema(schema, body);
      if (err) throw err;
    }
    else {
      body.id = undefined;
      body.createdAt = new Date(Date.now());
      body.updatedAt = new Date(Date.now());
      const err = checkSchema(schema, body);
      if (err) throw err;
    }

    try {
      if (isArray) {
        await collection.insertMany(body);
      }
      else {
        await collection.insertOne(body);
      }
    }
    catch (e) {
      console.log(e);
      throw new MError(400, "Failed to add products");
    }

    res.status(200).send("");
});

export default router;