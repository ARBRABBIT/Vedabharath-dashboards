import { Archive, Briefcase, FolderOpen, Leaf, Tag, Users } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { SuperAdminNavbar } from "@/components/dashboard/SuperAdminNavbar";

export const metadata: Metadata = {
  title: "Master Data",
};

const CARDS = [
  {
    title: "Products",
    description: "Create, update, and manage all rice products including pricing, specifications, images, and availability in real-time.",
    icon: Archive,
    href: "/super-admin/master-data/products",
  },
  {
    title: "Product Tags",
    description: "Create and organize tags like Trending, Best Seller, and seasonal categories to improve customer product discovery.",
    icon: Tag,
    href: "/super-admin/master-data/tags",
  },
  {
    title: "Health Benefits",
    description: "Manage the specific health and wellness claims displayed for each product variant on the customer-facing store.",
    icon: Briefcase,
    href: "/super-admin/master-data/health-benefits",
  },
  {
    title: "Nutrition",
    description: "Maintain accurate nutritional profiles including protein, fiber, and micronutrients for detailed label compliance.",
    icon: Leaf,
    href: "/super-admin/master-data/nutrition",
  },
  {
    title: "Coupons",
    description: "Manage system users, define administrative roles, and configure granular access permissions for warehouse staff.",
    icon: Users,
    href: "/super-admin/master-data/coupons",
  },
  {
    title: "Drafts",
    description: "un-published changes. Saving as a draft will move this record to your Drafts workspace so you can resume later.",
    icon: FolderOpen,
    href: "/super-admin/master-data/drafts",
  },
];

export default function MasterDataPage() {
  return (
    <div className="flex min-h-screen w-full flex-col bg-[#F5F5F7]">
      <SuperAdminNavbar />

      <main className="flex-1 px-6 pb-10 pt-6 sm:px-10 lg:px-16">
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {CARDS.map((card) => (
            <div key={card.title} className="flex min-h-[280px] flex-col rounded-[28px] border-2 border-black/[0.04] bg-white p-6">
              <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#F7931E]">
                <card.icon className="h-5 w-5 text-white" strokeWidth={2} />
              </span>
              <h3 className="mt-4 text-xl font-bold text-black">{card.title}</h3>
              <p className="mt-2 max-w-[300px] flex-1 text-sm leading-relaxed text-[#6B7280]">{card.description}</p>
              <Link
                href={card.href}
                className="mt-4 flex w-fit cursor-pointer items-center gap-1.5 text-sm font-bold text-[#F7931E] hover:text-[#e07f0e]"
              >
                View Details →
              </Link>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}
