import type { Metadata } from "next";
import { SuperAdminNavbar } from "@/components/dashboard/SuperAdminNavbar";
import { ActiveOffersCard } from "@/components/super-admin/ActiveOffersCard";
import { ActiveSupportTicketsCard } from "@/components/super-admin/ActiveSupportTicketsCard";
import { CustomerReviewsCard } from "@/components/super-admin/CustomerReviewsCard";
import { TopSellingProductsCard } from "@/components/super-admin/TopSellingProductsCard";

export const metadata: Metadata = {
  title: "Super Admin",
};

export default function SuperAdminPage() {
  return (
    <div className="flex min-h-screen w-full flex-col bg-[#F5F5F7]">
      <SuperAdminNavbar />

      <main className="flex-1 px-6 pb-10 pt-6 sm:px-10 lg:px-16">
        <div className="flex flex-col gap-6 lg:flex-row">
          <TopSellingProductsCard />
          <ActiveSupportTicketsCard />
        </div>

        <div className="mt-6 flex flex-col gap-6 lg:flex-row">
          <ActiveOffersCard />
          <CustomerReviewsCard />
        </div>
      </main>
    </div>
  );
}
