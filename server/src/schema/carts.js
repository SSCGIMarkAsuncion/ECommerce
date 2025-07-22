export default class Carts {
  _id = null;
  owner = "";
  /*** @type {{id: string, amount: number}[]} */
  products = [];
  /*** @type {"done" | "cart"} */
  status = "";
  createdAt = 0;
  updatedAt = 0;

  static create(owner) {
    return {
      owner,
      products: [],
      status: "cart",
      createdAt: new Date(Date.now()),
      updatedAt: new Date(Date.now())
    };
  }

  static aggregateGroup() {
    return {
      _id: "$_id",
      owner: { $first: "$owner" },
      status: { $first: "$status" },
      createdAt: { $first: "$createdAt" },
      updatedAt: { $first: "$updatedAt" },
      products: { $push: "$products" }
    }
  }

  static project() {
    return {
      _id: 1,
      owner: 1,
      products: 1,
      status: 1,
      createdAt: 1,
      updatedAt: 1
    };
  }
}