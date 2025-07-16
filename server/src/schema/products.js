export default class Products {
  _id = null;
  name = "";
  description = "";
  price = 0;
  salePrice = null;
  imgs = [];
  tags = [];
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
}