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
    const idProduct = new ObjectId(req.params.id);

    let productDoc = await productCollection.findOne({
      _id: idProduct
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
      return p.id.toString() == idProduct.toString();
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

/*
  query
    withProduct=1
      optional. Adds a products.product in Cart schema
      and inserts the Product doc associated with products[n].id
*/
router.get("/", async (req, res) => {
    /*** @type {string} */
    const uid = req.tokenPayload.id;
    const collection = getCollection(COLLECTIONS.CARTS);
    const withProduct = req.query.withProduct == '1';

    const match = {
      owner: new ObjectId(uid),
      status: "cart"
    };
    if (!withProduct) {
      const doc = await collection.findOne(match, { sort: { updatedAt: -1 } });

      console.log("cart::get", doc);

      return res.status(200).send(doc);
    }

    const doc = await collection.aggregate([
      { $match: match },
      { $unwind: "$products" },
      {
        $lookup: {
          from: COLLECTIONS.PRODUCTS,
          foreignField: "_id",
          localField: "products.id",
          as: "productDetails"
        }
      },
      {
        $addFields: {
          "products.product": "$productDetails"
        }
      },
      {
        $group: Carts.aggregateGroup()
      }
    ]).toArray();
    // mongodb returns an array for products.product

    if (doc == null || doc.length == 0) {
      res.status(200).json(null);
    }

    res.status(200).json(doc[0]);
}
);

export default router;