export type DraftCategory = "Products" | "Master Data" | "Users Management";

export type Draft = {
  id: string;
  category: DraftCategory;
  title: string;
  description: string;
  savedAgo: string;
  resumeHref: string | null;
};

const DRAFT_TEMPLATES: Omit<Draft, "id">[] = [
  {
    category: "Products",
    title: "New Rice Variant Entry",
    description:
      "Missing pricing and storefront grid coordinates. Please ensure the SKU mapping is completed before submission.",
    savedAgo: "Saved 2 hrs ago",
    resumeHref: "/super-admin/master-data/products/new",
  },
  {
    category: "Master Data",
    title: "Inward Batch #B-Pending",
    description:
      "Internal Farm Unit origin selected. Rack location unassigned. Awaiting confirmation of pallet weight and moisture percentage.",
    savedAgo: "Saved yesterday",
    resumeHref: "/super-admin/master-data",
  },
  {
    category: "Users Management",
    title: "Warehouse Admin Registration",
    description: "Email and Hub assignment verified. Pending final security clearance and role-based access control (RBAC) signature.",
    savedAgo: "Saved 3 days ago",
    resumeHref: "/super-admin/users?action=create-admin",
  },
];

export const INITIAL_DRAFTS: Draft[] = Array.from({ length: 28 }).map((_, index) => {
  const template = DRAFT_TEMPLATES[index % DRAFT_TEMPLATES.length];
  return { ...template, id: `draft-${index + 1}` };
});

export function categoryPillClasses(category: DraftCategory) {
  if (category === "Products") return "bg-[#FEF3E2] text-[#F7931E]";
  if (category === "Master Data") return "bg-[#EBF7EC] text-[#22C55E]";
  return "bg-[#EFF6FF] text-[#3B82F6]";
}
