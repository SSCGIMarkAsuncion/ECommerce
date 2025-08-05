import type { IColumn } from "../Utils/DataBuilder";

export class Product {
  id: string;
  name: string;
  description: string;
  price: number;
  discount: number;
  stocks: number;
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
    this.stocks = obj.stocks || 0;
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
      stocks: 0,
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
      stocks: Number(fdata.get("stocks")) || 0,
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
    name: "Stocks",
    id: "stocks",
    enableColumnFilter: true,
  },
  {
    name: "Updated At",
    id: "updatedAt",
    enableColumnFilter: true,
    isDate: true
  },
];

export class ProductFilterPresets {
  maxPrice: number;
  categories: string[];
  count: number;

  constructor(obj: any) {
    this.maxPrice = obj.maxPrice;
    this.categories = obj.categories;
    this.count = obj.count;
  }

  static empty() {
    return new ProductFilterPresets({
      maxPrice: 0,
      categories: [],
      count: 0
    });
  }
}

export interface ProductFilterQuery {
  sby: "date" | "price" | "";
  sort: "asc" | "desc" | "";
  priceMin: number;
  priceMax: number;
  isDiscounted: boolean;
  tags: string[];
  q: string;
};

export function productFilterQueryGetSortOf(query: ProductFilterQuery, type: typeof query.sby) {
  if (query.sby == type && query.sort !== "") return query.sort;
  return null;
}

export function productFilterQueryFrom(params: URLSearchParams) {
  const res: ProductFilterQuery = {} as ProductFilterQuery;
  res.sby = params.get("sby") as typeof res.sby || "";
  res.sort = params.get("sort") as typeof res.sort || "";
  res.isDiscounted = params.get("isDiscounted") == '1';
  res.tags = params.get("tags") != null ? params.get("tags")!.split(';') : [];
  res.q = params.get("q") || "";
  try {
    res.priceMin = Number(params.get("priceMin")) || 0;
    res.priceMax = Number(params.get("priceMax")) || 0;
  }
  catch {
    res.priceMin = 0;
    res.priceMax = 0;
  }
  return res;
}

export function productFilterQueryBuild(query: ProductFilterQuery) {
  const queries: string[] = [];
  const keys = Object.keys(query) as Array<keyof ProductFilterQuery>;
  keys.forEach((key) => {
    if (!query[key]) return;

    let v = query[key] as any;
    if (key == "priceMax" && v == 0) return;

    if (Array.isArray(v)) {
      if (v.length == 0) return;
      v = v.join(';');
    }
    if (v === true) {
      // query[key] is already checked before query so v here is always true here if it is a boolean type
      v = '1';
    }
    queries.push(`${key as string}=${v}`);
  });

  if (queries.length <= 0) return "";
  return queries.join('&');
}

// export class ProductFilterQuery {
//   sby: "date" | "price" | "";
//   sort: "asc" | "desc" | "";
//   priceMin: number;
//   priceMax: number;
//   isDiscounted: boolean;
//   tags: string[];
//   q: string;

//   constructor(params: any | URLSearchParams) {
//     if (params instanceof URLSearchParams) {
//       this.sby = params.get("sby") as typeof this.sby || "";
//       this.sort = params.get("sort") as typeof this.sort || "";
//       this.isDiscounted = params.get("isDiscounted") == '1';
//       this.tags = params.get("tags") != null ? params.get("tags")!.split(';') : [];
//       this.q = params.get("q") || "";
//       try {
//         this.priceMin = Number(params.get("priceMin"));
//         this.priceMax = Number(params.get("priceMax"));
//       }
//       catch {
//         this.priceMin = 0;
//         this.priceMax = 0;
//       }
//     }
//     else {
//       this.sby = params.sby || "";
//       this.sort = params.sort || "";
//       this.priceMin = params.priceMin || 0;
//       this.priceMax = params.priceMax || 0;
//       this.isDiscounted = params.isDiscounted || false;
//       this.tags = params.tags || [];
//       this.q = params.q || "";
//     }
//   }

//   build() {
//     const queries: string[] = [];
//     const keys = Object.keys(JSON.stringify(this)) as Array<keyof this>;
//     keys.forEach((key) => {
//       if (!this[key]) return;

//       let v = this[key] as any;
//       if (Array.isArray(v)) {
//         v = v.join(';');
//       }
//       if (v instanceof Boolean) {
//         // this[key] is already checked before this so this means v is always true here
//         v = '1';
//       }
//       queries.push(`${key as string}=${v}`);
//     });

//     if (queries.length <= 0) return "";
//     return queries.join('&');
//   }
// }