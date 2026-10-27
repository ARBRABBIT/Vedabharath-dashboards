export type SuperAdminProduct = {
  sku: string;
  name: string;
  subtitle: string;
  variants: string[];
  stock: number;
  orders: number;
  ordersDelta: number;
  salesPercent: number;
  price: number;
  description: string;
};

export const PRODUCTS: SuperAdminProduct[] = [
  {
    sku: "VB-NAV",
    name: "Navara Rice",
    subtitle: "Traditional Red Rice",
    variants: ["1kg", "5kg"],
    stock: 1240,
    orders: 1850,
    ordersDelta: 12,
    salesPercent: 78,
    price: 299,
    description:
      "Traditional medicinal red rice from the heart of Kerala, known for its unique healing properties and nutritional profile.",
  },
  {
    sku: "VB-THO",
    name: "Thooyamalli Rice",
    subtitle: "Fragrant White Rice",
    variants: ["1kg", "5kg"],
    stock: 850,
    orders: 1240,
    ordersDelta: 8,
    salesPercent: 62,
    price: 249,
    description: "Aromatic short-grain white rice, prized for its fragrance and soft texture when cooked.",
  },
  {
    sku: "VB-KAA",
    name: "Kaattu Rice",
    subtitle: "Premium Brown Rice",
    variants: ["1kg", "5kg"],
    stock: 45,
    orders: 450,
    ordersDelta: -2,
    salesPercent: 95,
    price: 329,
    description: "Unpolished forest-grown brown rice with a nutty flavour and high fibre content.",
  },
  {
    sku: "VB-MAP",
    name: "Mapillai Rice",
    subtitle: "Traditional Raw Rice",
    variants: ["1kg", "5kg"],
    stock: 320,
    orders: 920,
    ordersDelta: 15,
    salesPercent: 45,
    price: 279,
    description: "A protein-rich heirloom rice variety traditionally given to grooms in Tamil Nadu for strength.",
  },
  {
    sku: "VB-KUL",
    name: "Kullakar Rice",
    subtitle: "Short Grain Rice",
    variants: ["1kg", "5kg"],
    stock: 580,
    orders: 780,
    ordersDelta: 5,
    salesPercent: 55,
    price: 259,
    description: "A short-grain heirloom variety known for its cooling properties and easy digestibility.",
  },
  {
    sku: "VB-KAR",
    name: "Karuppu Kavuni Rice",
    subtitle: "Black Rice",
    variants: ["1kg", "5kg"],
    stock: 210,
    orders: 610,
    ordersDelta: 6,
    salesPercent: 51,
    price: 349,
    description: "Antioxidant-rich black rice, historically reserved for Chinese royalty.",
  },
  {
    sku: "VB-POO",
    name: "Poongar Rice",
    subtitle: "Aromatic Red Rice",
    variants: ["1kg", "5kg"],
    stock: 690,
    orders: 540,
    ordersDelta: 4,
    salesPercent: 40,
    price: 289,
    description: "A fragrant red rice variety traditionally used in South Indian festive cooking.",
  },
  {
    sku: "VB-SEE",
    name: "Seeraga Samba Rice",
    subtitle: "Cumin Rice",
    variants: ["1kg", "5kg"],
    stock: 75,
    orders: 1020,
    ordersDelta: 9,
    salesPercent: 71,
    price: 269,
    description: "Small, fragrant grains resembling cumin seeds, ideal for biryani.",
  },
  {
    sku: "VB-BAH",
    name: "Bahurupi Rice",
    subtitle: "Heirloom Multi-Colour Rice",
    variants: ["1kg", "5kg"],
    stock: 0,
    orders: 310,
    ordersDelta: -5,
    salesPercent: 88,
    price: 319,
    description: "A rare heirloom variety that changes colour through its growth stages.",
  },
  {
    sku: "VB-BLB",
    name: "Black Burma Rice",
    subtitle: "Purple Sticky Rice",
    variants: ["1kg", "5kg"],
    stock: 460,
    orders: 690,
    ordersDelta: 11,
    salesPercent: 58,
    price: 359,
    description: "A glutinous purple rice popular in South East Asian desserts.",
  },
  {
    sku: "VB-IND",
    name: "Indrani Rice",
    subtitle: "Traditional Boiled Rice",
    variants: ["1kg", "5kg"],
    stock: 140,
    orders: 430,
    ordersDelta: 3,
    salesPercent: 36,
    price: 229,
    description: "A hearty parboiled rice suited for everyday South Indian meals.",
  },
  {
    sku: "VB-CHI",
    name: "Chinthaluri Sannalu Rice",
    subtitle: "Fine Grain Rice",
    variants: ["1kg", "5kg"],
    stock: 390,
    orders: 505,
    ordersDelta: 7,
    salesPercent: 49,
    price: 249,
    description: "A fine-grain rice variety known for its light texture and mild aroma.",
  },
  {
    sku: "VB-DUD",
    name: "Dudeshwar Rice",
    subtitle: "Medicinal Red Rice",
    variants: ["1kg", "5kg"],
    stock: 265,
    orders: 615,
    ordersDelta: 10,
    salesPercent: 63,
    price: 309,
    description: "A red rice variety used in traditional medicine for its high iron content.",
  },
  {
    sku: "VB-SOR",
    name: "Sornavari Rice",
    subtitle: "Golden Harvest Rice",
    variants: ["1kg", "5kg"],
    stock: 520,
    orders: 470,
    ordersDelta: 2,
    salesPercent: 33,
    price: 239,
    description: "Named after the golden Tamil harvest season, prized for its mild sweetness.",
  },
  {
    sku: "VB-RAK",
    name: "Rakthashali Rice",
    subtitle: "Ayurvedic Red Rice",
    variants: ["1kg", "5kg"],
    stock: 88,
    orders: 395,
    ordersDelta: -1,
    salesPercent: 42,
    price: 339,
    description: "An ancient Ayurvedic rice variety recommended for its therapeutic properties.",
  },
];

export function stockDotColor(stock: number) {
  if (stock < 100) return "bg-[#EF4444]";
  if (stock < 500) return "bg-[#F97316]";
  return "bg-[#22C55E]";
}

export function performanceTag(salesPercent: number): "Most Selling" | "Trending" | "Less Selling" {
  if (salesPercent >= 65) return "Most Selling";
  if (salesPercent < 48) return "Less Selling";
  return "Trending";
}

export function tagPillClasses(tag: ReturnType<typeof performanceTag>) {
  if (tag === "Most Selling") return "bg-[#EBF7EC] text-[#22C55E]";
  if (tag === "Less Selling") return "bg-[#FEF2F2] text-[#EF4444]";
  return "bg-[#EFF6FF] text-[#3B82F6]";
}
