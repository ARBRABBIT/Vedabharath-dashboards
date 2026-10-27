export type StockStatus = "out" | "low" | "in";
export type BagSize = 1 | 5;
export const BAG_SIZES: readonly BagSize[] = [1, 5];

export type ProductStock = {
  sku: string;
  name: string;
  bags: Record<BagSize, number>;
  /** Total warehouse capacity in kilograms. */
  maxCapacity: number;
};

export const STATUS_LABELS: Record<StockStatus, string> = {
  out: "Out of Stock",
  low: "Low Stock",
  in: "In Stock",
};

export function stockQuantityKg(product: ProductStock) {
  return product.bags[1] + product.bags[5] * 5;
}

export function stockStatus(product: ProductStock): StockStatus {
  const quantity = stockQuantityKg(product);
  if (quantity <= 0) return "out";
  if (quantity / product.maxCapacity <= 0.2) return "low";
  return "in";
}

export function stockPercent(product: ProductStock) {
  return Math.min(100, Math.round((stockQuantityKg(product) / product.maxCapacity) * 100));
}

/** Explicit sample bag splits for the demo; not inferred production stock data. */
export const INITIAL_PRODUCTS: ProductStock[] = [
  { sku: "VB-HP-92", name: "Heritage Ponni Rice", bags: { 1: 120, 5: 60 }, maxCapacity: 500 },
  { sku: "VB-DU-91", name: "Dudeshwar Rice", bags: { 1: 110, 5: 40 }, maxCapacity: 400 },
  { sku: "VB-BA-18", name: "Bahurupi Rice", bags: { 1: 0, 5: 0 }, maxCapacity: 200 },
  { sku: "VB-IN-27", name: "Indrani Rice", bags: { 1: 7, 5: 1 }, maxCapacity: 120 },
  { sku: "VB-MM-15", name: "Mysore Malliga Rice", bags: { 1: 60, 5: 40 }, maxCapacity: 300 },
  { sku: "VB-BB-33", name: "Black Burma Rice", bags: { 1: 8, 5: 2 }, maxCapacity: 150 },
  { sku: "VB-NAV-26", name: "Navara Rice", bags: { 1: 50, 5: 30 }, maxCapacity: 250 },
  { sku: "VB-CS-44", name: "Chinthaluri Sannalu", bags: { 1: 5, 5: 2 }, maxCapacity: 100 },
];
