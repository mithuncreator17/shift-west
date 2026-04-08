import type { backendInterface } from "../backend";

export const mockBackend: backendInterface = {
  addCategory: async (_name: string, _password: string) => ({
    __kind__: "ok" as const,
    ok: { id: BigInt(1), name: _name },
  }),
  addProduct: async (_name: string, _price: bigint, _category: string, _password: string) => ({
    __kind__: "ok" as const,
    ok: { id: BigInt(1), name: _name, price: _price, category: _category },
  }),
  deleteCategory: async (_id: bigint, _password: string) => ({
    __kind__: "ok" as const,
    ok: true,
  }),
  deleteProduct: async (_id: bigint, _password: string) => ({
    __kind__: "ok" as const,
    ok: true,
  }),
  getCategory: async (_id: bigint) => ({ id: BigInt(1), name: "Topwear" }),
  getProduct: async (_id: bigint) => ({
    id: BigInt(1),
    name: "Acid Wash Oversized Tee",
    price: BigInt(899),
    category: "Topwear",
  }),
  listCategories: async () => [
    { id: BigInt(1), name: "Topwear" },
    { id: BigInt(2), name: "Bottomwear" },
    { id: BigInt(3), name: "Hoodies" },
  ],
  listProducts: async () => [
    { id: BigInt(1), name: "Acid Wash Oversized Tee", price: BigInt(899), category: "Topwear" },
    { id: BigInt(2), name: "Graffiti Cargo Pants", price: BigInt(1799), category: "Bottomwear" },
    { id: BigInt(3), name: "West Coast Hoodie", price: BigInt(1499), category: "Hoodies" },
    { id: BigInt(4), name: "Block Print Tee", price: BigInt(749), category: "Topwear" },
    { id: BigInt(5), name: "Distressed Denim", price: BigInt(1999), category: "Bottomwear" },
    { id: BigInt(6), name: "Utility Vest", price: BigInt(1299), category: "Topwear" },
  ],
  updateProduct: async (_id: bigint, _name: string, _price: bigint, _category: string, _password: string) => ({
    __kind__: "ok" as const,
    ok: { id: _id, name: _name, price: _price, category: _category },
  }),
};
