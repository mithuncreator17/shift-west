import { createActor } from "@/backend";
import type { Category, Product } from "@/types";
import { useActor } from "@caffeineai/core-infrastructure";
import { useQuery } from "@tanstack/react-query";

const DEFAULT_PRODUCTS: Product[] = [
  {
    id: "1",
    name: "Acid Wash Oversized Tee",
    price: 899,
    category: "Topwear",
    description: "Heavy 280GSM cotton. Distressed finish.",
  },
  {
    id: "2",
    name: "Graffiti Cargo Pants",
    price: 1799,
    category: "Bottomwear",
    description: "6-pocket utility cargo. Relaxed fit.",
  },
  {
    id: "3",
    name: "West Coast Hoodie",
    price: 1499,
    category: "Hoodies",
    description: "Fleece-lined. Kangaroo pocket.",
  },
  {
    id: "4",
    name: "Drop Shoulder Longsleeve",
    price: 1099,
    category: "Topwear",
    description: "Ribbed cuffs. Extended hem.",
  },
  {
    id: "5",
    name: "Washed Jogger Set",
    price: 2299,
    category: "Bottomwear",
    description: "Matching set. Elastic waistband.",
  },
  {
    id: "6",
    name: "Tie-Dye Zip Hoodie",
    price: 1799,
    category: "Hoodies",
    description: "Full-zip. Split hem.",
  },
];

const DEFAULT_CATEGORIES: Category[] = [
  { id: "All", label: "All" },
  { id: "Topwear", label: "Topwear" },
  { id: "Bottomwear", label: "Bottomwear" },
  { id: "Hoodies", label: "Hoodies" },
];

export function useProducts() {
  const { actor, isFetching } = useActor(createActor);
  return useQuery<Product[]>({
    queryKey: ["products"],
    queryFn: async () => {
      if (!actor) return DEFAULT_PRODUCTS;
      try {
        const result = await (
          actor as unknown as { listProducts: () => Promise<Product[]> }
        ).listProducts();
        return result ?? DEFAULT_PRODUCTS;
      } catch {
        return DEFAULT_PRODUCTS;
      }
    },
    enabled: !isFetching,
    initialData: DEFAULT_PRODUCTS,
  });
}

export function useCategories() {
  const { actor, isFetching } = useActor(createActor);
  return useQuery<Category[]>({
    queryKey: ["categories"],
    queryFn: async () => {
      if (!actor) return DEFAULT_CATEGORIES;
      try {
        const result = await (
          actor as unknown as { listCategories: () => Promise<Category[]> }
        ).listCategories();
        return result ?? DEFAULT_CATEGORIES;
      } catch {
        return DEFAULT_CATEGORIES;
      }
    },
    enabled: !isFetching,
    initialData: DEFAULT_CATEGORIES,
  });
}
