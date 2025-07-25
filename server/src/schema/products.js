export default class Products {
  id = null;
  name = "";
  description = "";
  price = 0;
  salePrice = null;
  imgs = [];
  tags = [];
  // likes = []; // list of user._id who liked this product
  createdAt = 0;
  updatedAt = 0;

  static project() {
    return {
      _id: 1,
      name: 1,
      description: 1,
      price: 1,
      salePrice: 1,
      imgs: 1,
      tags: 1,
      createdAt: 1,
      updatedAt: 1
    };
  }

  static projectUpdate() {
    return {
      name: 1,
      description: 1,
      price: 1,
      imgs: 1,
      tags: 1,
    };
  }
}