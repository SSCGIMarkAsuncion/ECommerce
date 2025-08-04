import { Product } from '../schema/products.js';
import { ObjectId } from 'mongodb';
import parseQueryValue from "../utils/query.js";
import MError from '../error.js';

/* QUERY SCHEMA
- Only works if :id does not exist
filter=..;..
tags=..;..
isSale=1 // optional
sby=string // sort by
s=string // sort type "asc" | "desc"
*/
/** 
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 */
export async function GetProduct(req, res) {
  const productId = req.params.id? new ObjectId(req.params.id):null;
  const filter = parseQueryValue(req.query.filter);
  const tags = parseQueryValue(req.query.tags);
  const isSale = req.query.isSale == '1';
  const sortBy = req.query.sby || "";
  const sort = req.query.s || "asc";

  console.log("filter", filter, "tags", tags);

  if (productId) {
    let doc = null;
    try {
      doc = await Product.findOne({
        _id: productId
      });

      if (doc == null) {
        throw new MError(404, "Product Id does not exist.");
      }
    }
    catch (e) {
      console.log("GetProduct::Id::ERR", e);
      return res.status(404).send("Product Id does not exist.");
    }
    return res.status(200).json(doc);
  }

  // Build $or query for partial matches
  let orConditions = [];
  let andConditions = [];
  filter.forEach(f => {
    orConditions.push({ name: { $regex: f, $options: "i" } });
    orConditions.push({ description: { $regex: f, $options: "i" } });
  });
  tags.forEach(tag =>
    orConditions.push({ tags: tag })
  );

  if (isSale) {
    andConditions.push({
      discount: { $exists: true, $gt: 0 }
    });
  }

  let query = {};
  if (orConditions.length > 0) {
    query["$or"] = orConditions;
  }
  if (andConditions.length > 0) {
    query["$and"] = andConditions;
  }
  let optSort = null;

  let aggregate = [];
  aggregate.push({
    $match: query
  });
  if (sortBy) {
    let sortType = 1;
    if (sort == "desc")
      sortType = -1;

    switch (sortBy) {
      case "date":
        optSort = {
          updatedAt: sortType
        }
        break;
      case "price":
        optSort = {
          discountedPrice: sortType
        };
        aggregate.push({
          $addFields: {
            discountedPrice: {
              $cond: {
                if: { $gt: ["$discount", 0] },
                then: {
                  $multiply: [
                    "$price",
                    { $subtract: [1, { $divide: ["$discount", 100] }] }
                  ]
                },
                else: "$price"
              }
            }
          }
        });
        break;
    }
  }
  if (optSort)
    aggregate.push({
      $sort: optSort
    });

  console.log(aggregate);

  const docs = await Product.aggregate(aggregate);
  // const docs = await Product.aggregate(aggregate).find(query, null, {
  //   sort: optSort
  // });
  return res.status(200).json(docs);
}

/** 
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 */
export async function DeleteProduct(req, res) {
  const productId = new ObjectId(req.params.id);
  const delRes = await Product.deleteOne({ _id: productId });

  if (delRes.deletedCount == 0) {
    throw new MError(404, "Product Id does not exist. Cannot delete");
  }

  res.status(200).send(`Successfully deleted ${productId.toString()}`);
}

/** 
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 */
export async function PutProduct(req, res) {
  let body = req.body;
  if (!body) throw new MError(400, "Body is Empty");

  const productId = new ObjectId(req.params.id);

  const set = {
    name: body.name,
    description: body.description,
    imgs: body.imgs,
    tags: body.tags,
    stocks: body.stocks,
    price: body.price,
    discount: body.discount
  };
  for (const key of Object.keys(set)) {
    const item = set[key];
    if (item == undefined) {
      delete set[key];
    }
  }

  console.log("PutProduct::set", set);
  try {
    await Product.findOneAndUpdate(
      productId, set,
      {
        new: true,
        runValidators: true,
      }
    );
  }
  catch (e) {
    if (e instanceof Error)
      throw new MError(404, e.message);
    else
      throw new MError(404, e);
  }

  return res.status(200).send("");
}

/** 
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 */
export async function PostProduct(req, res) {
  let body = req.body;
  if (!body) throw new MError(400, "Body is Empty");

  const isArray = Array.isArray(body);
  try {
    if (isArray) {
      await Product.insertMany(body);
    }
    else {
      await Product.insertOne(body);
    }
  }
  catch (e) {
    throw new MError(400, e.message);
  }

  res.status(200).send("");
}