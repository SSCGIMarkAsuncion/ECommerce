import { Product, ProductFilter } from '../schema/products.js';
import { ObjectId } from 'mongodb';
import MError from '../error.js';
import { ReqBody } from '../utils/ReqBody.js';

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

export class ReqProduct extends ReqBody {
  constructor(obj) {
    super(obj);
    this.name = obj.name,
    this.description = obj.description,
    this.imgs = obj.imgs,
    this.tags = obj.tags,
    this.stocks = obj.stocks,
    this.price = obj.price,
    this.discount = obj.discount
  }
}