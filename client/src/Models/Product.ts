export interface Product {
  id: string,
  name: string,
  description: string,
  price: number,
  salePrice?: number,
  imgs: string[],
  tags: string[],
  createdAt: Date,
  updatedAt: Date
};

export const dummyPromoProducts: Product[] = [
  {
    id: "prod_001",
    name: "UltraBlend Espresso Machine",
    description: "A compact countertop espresso machine with milk frother and 15-bar pump pressure.",
    price: 249.99,
    salePrice: 199.99,
    imgs: [
      "https://www.sharmispassions.com/wp-content/uploads/2012/07/espresso-coffee-recipe04.jpg",
    ],
    tags: ["espresso", "kitchen", "premium"],
    createdAt: new Date("2025-01-10T10:15:00Z"),
    updatedAt: new Date("2025-06-15T08:30:00Z"),
  },
  {
    id: "prod_002",
    name: "GrindPro Burr Grinder",
    description: "Adjustable coarse-to-fine burr grinder with 60 grind settings and airtight hopper.",
    price: 129.99,
    salePrice: 100.00,
    imgs: [
      "https://smegphilippines.com/cdn/shop/files/CFG01BLEU_4.png?v=1724747383",
    ],
    tags: ["grinder", "accessory", "coffee"],
    createdAt: new Date("2025-02-05T14:20:00Z"),
    updatedAt: new Date("2025-02-05T14:20:00Z"),
  },
  {
    id: "prod_003",
    name: "ThermoCup Travel Mug 16oz",
    description: "Stainless steel insulated travel mug with spill-proof lid, fits most cup holders.",
    price: 29.99,
    salePrice: 18.00,
    imgs: [
      "https://www.boscoffee.com/cdn/shop/files/DSC06713_edited_1.jpg?v=1730975511",
    ],
    tags: ["mug", "travel", "outdoor"],
    createdAt: new Date("2025-03-12T09:00:00Z"),
    updatedAt: new Date("2025-05-20T11:45:00Z"),
  }
];