export type ProductTag = { id: string; name: string };
export const INITIAL_TAGS: ProductTag[] = [
  { id: "t1", name: "Trending" },
  { id: "t2", name: "Best Seller" },
  { id: "t3", name: "Organic" },
  { id: "t4", name: "Healthy Choice" },
  { id: "t5", name: "Top Rated" },
  { id: "t6", name: "Premium" },
  { id: "t7", name: "Premium" },
  { id: "t8", name: "Limited Edition" },
  { id: "t9", name: "Heritage Rice" },
  { id: "t10", name: "Trending" },
  { id: "t11", name: "Trending" },
];

export type HealthBenefit = { id: string; name: string; description: string };
export const INITIAL_HEALTH_BENEFITS: HealthBenefit[] = [
  { id: "hb1", name: "High Fiber", description: "Supports healthy digestion and gut health." },
  { id: "hb2", name: "Rich in Protein", description: "Helps muscle growth and recovery effectively." },
  { id: "hb3", name: "Low Glycemic Index", description: "Helps maintain healthy blood sugar levels." },
  { id: "hb4", name: "Rich in Iron", description: "Supports healthy hemoglobin levels naturally." },
  { id: "hb5", name: "Heart Healthy", description: "Supports cardiovascular wellness and health." },
  { id: "hb6", name: "Supports Immunity", description: "Rich in essential vitamins and nutrients." },
  { id: "hb7", name: "Gluten Free", description: "Safe for gluten-sensitive consumers." },
];

export type Nutrient = { id: string; name: string; unit: string };
export const INITIAL_NUTRIENTS: Nutrient[] = [
  { id: "n1", name: "Protein", unit: "Gram (g)" },
  { id: "n2", name: "Iron", unit: "Milligram (mg)" },
  { id: "n3", name: "Dietary Fiber", unit: "Gram (g)" },
  { id: "n4", name: "Carbohydrates", unit: "Gram (g)" },
  { id: "n5", name: "Energy", unit: "Kilocalorie (kcal)" },
  { id: "n6", name: "Iron", unit: "Milligram (mg)" },
  { id: "n7", name: "Calcium", unit: "Milligram (mg)" },
  { id: "n8", name: "Energy", unit: "Kilocalorie (kcal)" },
];

export type Coupon = { id: string; code: string; subtitle: string; discount: string; maxDiscount: string };
export const INITIAL_COUPONS: Coupon[] = [
  { id: "c1", code: "FREESHIP", subtitle: "Annual holiday campaign", discount: "50% OFF", maxDiscount: "Max discount ₹500" },
  { id: "c2", code: "LOYALTY10", subtitle: "Annual holiday campaign", discount: "50% OFF", maxDiscount: "Max discount ₹500" },
  { id: "c3", code: "LOYALTY10", subtitle: "Annual holiday campaign", discount: "50% OFF", maxDiscount: "Max discount ₹500" },
  { id: "c4", code: "LOYALTY10", subtitle: "Annual holiday campaign", discount: "50% OFF", maxDiscount: "Max discount ₹500" },
  { id: "c5", code: "FREESHIP", subtitle: "Annual holiday campaign", discount: "50% OFF", maxDiscount: "Max discount ₹500" },
  { id: "c6", code: "FREESHIP", subtitle: "Annual holiday campaign", discount: "50% OFF", maxDiscount: "Max discount ₹500" },
];

export type ProductStatus = "Published" | "Out of Stock" | "Low Stock" | "Draft";
export type MasterProduct = {
  id: string;
  name: string;
  description: string;
  price: number;
  tag: string;
  tagTone: "green" | "blue" | "red";
  storefrontGrid: number;
  visible: boolean;
  status: ProductStatus;
  isDraft?: boolean;
};

export const INITIAL_PRODUCTS: MasterProduct[] = [
  { id: "p1", name: "Navara Rice", description: "Traditional medicinal red rice known...", price: 299, tag: "Lowest Ever", tagTone: "green", storefrontGrid: 1, visible: true, status: "Published" },
  { id: "p2", name: "Basmati Premium", description: "Long-grain aromatic rice aged for 2...", price: 185, tag: "Trending", tagTone: "blue", storefrontGrid: 2, visible: false, status: "Published" },
  { id: "p3", name: "Black Kavuni", description: "Antique black rice variety rich in...", price: 450, tag: "Most Selling", tagTone: "red", storefrontGrid: 3, visible: true, status: "Published" },
  { id: "p4", name: "Jasmine Rice", description: "Delicate fragrance and sticky texture...", price: 120, tag: "Lowest Ever", tagTone: "green", storefrontGrid: 4, visible: false, status: "Draft", isDraft: true },
  { id: "p5", name: "Jasmine Rice", description: "Delicate fragrance and sticky texture...", price: 120, tag: "Most Selling", tagTone: "red", storefrontGrid: 5, visible: false, status: "Draft", isDraft: true },
  { id: "p6", name: "Jasmine Rice", description: "Delicate fragrance and sticky texture...", price: 120, tag: "Top Selling", tagTone: "green", storefrontGrid: 6, visible: false, status: "Draft", isDraft: true },
  { id: "p7", name: "Sona Masoori", description: "Light, aromatic rice ideal for everyday...", price: 165, tag: "Trending", tagTone: "blue", storefrontGrid: 1, visible: true, status: "Out of Stock" },
  { id: "p8", name: "Red Kavuni", description: "Nutrient-dense antique rice with earthy...", price: 320, tag: "Most Selling", tagTone: "red", storefrontGrid: 2, visible: true, status: "Out of Stock" },
  { id: "p9", name: "Ponni Rice", description: "Soft, easy-to-digest rice for daily meals...", price: 140, tag: "Lowest Ever", tagTone: "green", storefrontGrid: 3, visible: true, status: "Low Stock" },
  { id: "p10", name: "Kaima Rice", description: "Fragrant short-grain rice used in biryanis...", price: 210, tag: "Trending", tagTone: "blue", storefrontGrid: 4, visible: true, status: "Low Stock" },
];

export function tagToneClasses(tone: "green" | "blue" | "red") {
  if (tone === "blue") return "bg-[#EFF6FF] text-[#3B82F6]";
  if (tone === "red") return "bg-[#FEE2E2] text-[#EF4444]";
  return "bg-[#EBF7EC] text-[#22C55E]";
}

export const HEALTH_BENEFIT_LIBRARY = [
  { id: "hbl1", name: "Low Glycemic Index", description: "Helps maintain stable blood sugar levels and supports diabetic-friendly diets." },
  { id: "hbl2", name: "High Fiber Content", description: "Supports healthy digestion, promotes gut health, and improves satiety." },
  { id: "hbl3", name: "Rich in Antioxidants", description: "Protects cells from oxidative stress and supports overall wellness." },
  { id: "hbl4", name: "Essential Minerals", description: "Provides calcium, magnesium, and iron for metabolism." },
];

export const NUTRIENT_LIBRARY = [
  { id: "nl1", name: "Moisture", unit: "(G)" },
  { id: "nl2", name: "Energy from Fat", unit: "(KCAL)" },
  { id: "nl3", name: "Carbohydrates", unit: "(G)" },
  { id: "nl4", name: "Protein", unit: "(G)" },
  { id: "nl5", name: "Dietary Fiber", unit: "(G)" },
  { id: "nl6", name: "Fat", unit: "(KCAL)" },
  { id: "nl7", name: "Calcium (Ca)", unit: "(MG)" },
  { id: "nl8", name: "Magnesium (Mg)", unit: "(MG)" },
];

export const TESTIMONIAL_LIBRARY = [
  { id: "tm1", name: "Arjun Mehta", rating: 5, date: "Oct 2023", text: "The quality of the Vedha Bharath supplements has been transformative for my daily routine. I've noticed a significant increase in my energy levels within just two weeks.", verified: true },
  { id: "tm2", name: "Priya Sharma", rating: 4.5, date: "Nov 2023", text: "The packaging was exquisite and the product itself feels very premium. Shipping was fast, and the support was great.", verified: false },
  { id: "tm3", name: "Dr. Rajesh Khanna", rating: 4, date: "Dec 2023", text: "As a healthcare professional, I'm quite selective about herbal supplements. This product has a clean ingredient profile and provides consistent results. Exceptional purity.", verified: true },
  { id: "tm4", name: "Sneha Gupta", rating: 5, date: "Jan 2024", text: "The taste is surprisingly pleasant compared to other similar products. I've recommended it to several colleagues already.", verified: false },
];
