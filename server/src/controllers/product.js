import { Product, ProductFilter } from '../schema/products.js';
import { ObjectId } from 'mongodb';
import MError from '../error.js';

/** 
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 */
export async function GetProduct(req, res) {
  const productId = req.params.id? new ObjectId(req.params.id):null;
  const productFilter = new ProductFilter(req.query);

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

  const aggregate = productFilter.buildAggregate();
  if (aggregate.length > 0) {
    const docs = await Product.aggregate(aggregate);
    return res.status(200).json(docs);
  }
  
  const docs = await Product.find();
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

/** 
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 */
export async function GetPresets(_req, res) {
  const presets = (await Product.aggregate([
    {
      $group: {
        _id: null,
        maxPrice: { $max: "$price" },
        count: { $sum: 1 }
      }
    }
  ]).project("maxPrice count"))[0];
  presets.categories = ["coffee", "tools", "accessories", "teas"];
  res.status(200).json(presets);
}