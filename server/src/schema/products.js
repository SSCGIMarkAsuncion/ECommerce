import mongoose from "mongoose";
import { COLLECTIONS } from "../mongodb.js";
import parseQueryValue from "../utils/query.js";

export const ProductSchema = new mongoose.Schema({
  name: {
    required: true,
    type: String
  },
  description: String,
  price: {
    type: Number,
    required: true,
    validate: {
      validator: function(v) {
        return v > 0;
      },
      message: _ => "price must be greater than 0. use discount for free items"
    }
  },
  discount: {
    type: Number,
    required: false,
    validate: {
      validator: function(v) {
        return v >= 0 && v <= 100;
      },
      message: _props => "discount must be between 0 and 100"
    },
    default: 0
  },
  stocks: {
    type: Number,
    default: 0,
    validate: {
      validator: function(v) {
        return v >= 0
      },
      message: _ => "stocks cannot be negative"
    }
  },
  imgs: {
    type: [String],
    validate: {
      validator: function(v) {
        return v.length >= 1
      },
      message: _ => `Must contain at least 1 Image`
    },
  },
  tags: {
    type: [String],
  },
}, { timestamps: true });

export const Product = mongoose.model("product", ProductSchema, COLLECTIONS.PRODUCTS);

export class ProductFilter {
  constructor(queries) {
    this.q = queries.q;
    this.sby = queries.sby;
    this.sort = queries.sort || "asc";
    try {
      this.priceMin = Number(queries.priceMin) || 0;
      this.priceMax = Number(queries.priceMax) || 0;
    }
    catch {
      this.priceMin = 0;
      this.priceMax = 0;
    }
    this.isDiscounted = queries.isDiscounted;
    this.tags = parseQueryValue(queries.tags);
  }

  buildAggregate() {
    const orConditions = [];
    const andConditions = [];

    if (this.q)
      andConditions.push({ name: { $regex: this.q, $options: 'i' }});

    this.tags.forEach(tag =>
      orConditions.push({ tags: { $regex: tag, $options: "i" }})
    );

    if (this.isDiscounted)
      andConditions.push({
        discount: { $exists: true, $gt: 0 }
      });

    const aggregate = [];

    if (orConditions.length > 0 || andConditions.length > 0) {
      const match = {};
      if (orConditions.length > 0)
        match.$or = orConditions;
      if (andConditions.length > 0)
        match.$and = andConditions;

      aggregate.push({ $match: match });
    }

    const sort = this.__buildSort();
    const priceMinMax = this.__buildPriceMinMax();
    if (sort)
      aggregate.push(...sort);
    if (priceMinMax)
      aggregate.push(...priceMinMax);

    return aggregate;
  }

  __buildPriceMinMax() {
    if (this.priceMax == 0) return null;

    return [
      {
        $addFields: {
          effectivePrice: {
            $cond: {
              if: { $gt: ["$discount", 0] },
              then: this.__applyDiscount(),
              else: "$price"
            }
          }
        }
      },
      {
        $match: {
          effectivePrice: {
            $gte: this.priceMin,
            $lte: this.priceMax
          }
        }
      }
    ];
  }

  __applyDiscount() {
    return {
      $multiply: [
        "$price",
        { $subtract: [1, { $divide: ["$discount", 100] }] }
      ]
    };
  }

  __buildSort() {
    if (!this.sby) return;

    let sortType = 1;
    if (this.sort == "desc")
      sortType = -1;
    
    switch (this.sby) {
      case "date":
        return [
          {
            $sort: {
              updatedAt: sortType
            }
          }
        ];
      case "price":
        return [
          {
            $addFields: {
              discountedPrice: {
                $cond: {
                  if: { $gt: ["$discount", 0] },
                  then: this.__applyDiscount(),
                  else: "$price"
                }
              }
            }
          },
          {
            $sort: {
              discountedPrice: sortType
            }
          }
        ];
      default:
        break;
    }
    return null;
  }
}