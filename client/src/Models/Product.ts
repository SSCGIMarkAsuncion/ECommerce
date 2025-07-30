import type { IColumn } from "../Utils/DataBuilder";

export class Product {
  id: string;
  name: string;
  description: string;
  price: number;
  discount: number;
  imgs: string[];
  tags: string[];
  createdAt: Date | null;
  updatedAt: Date | null;

  constructor(obj: any) {
    this.id = obj._id;
    this.name = obj.name;
    this.description = obj.description;
    this.price = Number(obj.price)
    this.discount = obj.discount? Number(obj.discount):0; // just in case for old docs that uses salePrice
    this.imgs = obj.imgs;
    this.tags = obj.tags;
    this.createdAt = obj.createdAt? new Date(obj.createdAt):null;
    this.updatedAt = obj.updatedAt? new Date(obj.updatedAt):null;
  }

  static empty() {
    return new Product({
      _id: "",
      name: "",
      description: "",
      price: 0,
      discount: 0,
      imgs: [],
      tags: [],
      createdAt: null,
      updatedAt: null
    });
  }

  static from(fdata: FormData, tags: string[], imgs: string[]) {
    return new Product({
      _id: fdata.get("id") || "",
      name: fdata.get("name") || "",
      description: fdata.get("description") || "",
      price: Number(fdata.get("price")) || 0,
      discount: Number(fdata.get("discount")) || 0,
      tags, imgs, createdAt: null, updatedAt: null
    });
  }

  toJson() {
    return JSON.stringify(this);
  }
};

export const PRODUCT_COLUMNS: IColumn[] = [
  {
    id: "name",
    enableColumnFilter: true
  },
  // {
  //   id: "description",
  //   enableColumnFilter: true
  // },
  {
    id: "price",
    enableColumnFilter: true,
    isNumber: true
  },
  {
    name: "discount%",
    id: "discount",
    enableColumnFilter: true,
    suffix: '%',
    isNumber: true
  },
  {
    id: "tags",
    enableColumnFilter: true,
    enableSorting: false,
    isArray: true
  },
  {
    name: "Created At",
    id: "createdAt",
    enableColumnFilter: true,
    isDate: true
  },
  {
    name: "Updated At",
    id: "updatedAt",
    enableColumnFilter: true,
    isDate: true
  },
];