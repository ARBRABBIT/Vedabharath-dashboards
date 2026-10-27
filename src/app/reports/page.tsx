import type { Metadata } from "next";
import { DashboardNavbar } from "@/components/dashboard/DashboardNavbar";
import { HeroBanner } from "@/components/dashboard/HeroBanner";
import { ReportsGrid } from "@/components/reports/ReportsGrid";

export const metadata: Metadata = {
  title: "Reports",
};

export default function ReportsPage() {
  return (
    <div className="flex min-h-screen w-full flex-col bg-[#F5F5F7]">
      <DashboardNavbar />

      <main className="flex-1 px-6 pb-10 pt-6 sm:px-10 lg:px-16">
        <HeroBanner
          heading="Reports"
          subtitle="Turn business data into clear and actionable insights."
        />

        <ReportsGrid />
      </main>
    </div>
  );
}
