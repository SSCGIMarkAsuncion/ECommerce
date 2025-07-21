import express from "express";
import { ObjectId } from "mongodb";
import MError from "../error.js";
import { authenticateJWT } from "../middleware/verify_token.js";
import db from "../mongodb.js";
import Carts from "../schema/carts.js";
const { getCollection, COLLECTIONS } = db;
const router = express.Router();

/*
  param:
    :id = id of product
  query
    amount

*/

router.post("/add/:id",
  async (req, res) => {
    /*** @type {string} */
    const uid = req.tokenPayload.id;
    const collection = getCollection(COLLECTIONS.CARTS);
    const productCollection = getCollection(COLLECTIONS.PRODUCTS);
    /*** @type {string} */
    const idProduct = req.params.id;

    let productDoc = await productCollection.findOne({
      _id: new ObjectId(idProduct)
    });
    if (!productDoc) {
      throw new MError(400, "Product Does not exist");
    }

    let amount = req.query.amount || 1;
    if (typeof amount == "string") {
      try {
        amount = Number(req.query.amount);
      }
      catch {
        throw new MError(400, "amount must be a number");
      }
    }

    const ownerId = new ObjectId(uid);
    let doc = await collection.findOne({
      owner: ownerId,
      status: "cart"
    }, { sort: { updatedAt: -1 } });

    if (!doc) {
      doc = {
        products: []
      }
    }
    /*** @type {any[]} */
    const products = doc.products;
    const id = products.findIndex((p) => {
      return p.id == idProduct;
    });

    if (id >= 0) {
      products[id].amount = amount;
      if (products[id].amount <= 0) {
        products.splice(id, 1);
      }
    }
    else {
      products.push({
        id: idProduct,
        amount
      });
    }
    doc.products = products;

    let result = {};
    if (doc._id) {
      const updatedAt = new Date(Date.now());
      result = {
        ...doc,
        updatedAt: updatedAt,
        products: doc.products
      };

      await collection.updateOne({
        _id: doc._id,
      }, {
        "$set": {
          updatedAt: updatedAt,
          products: doc.products
        }
      });
    }
    else {
      const cartItem = Carts.create(ownerId);
      cartItem.products = doc.products;
      result = cartItem;
      await collection.insertOne(cartItem);
    }

    // No _id will be given if the document is new
    res.status(200).json(result);
  }
);

router.get("/", async (req, res) => {
    /*** @type {string} */
    const uid = req.tokenPayload.id;
    const collection = getCollection(COLLECTIONS.CARTS);

    const doc = await collection.findOne({
      owner: new ObjectId(uid),
      status: "cart"
    }, { sort: { updatedAt: -1 } });

    console.log("cart::get", doc);

    res.status(200).send(doc);
  }
);

export default router;