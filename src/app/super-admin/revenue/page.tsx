import type { Metadata } from "next";
import { SuperAdminNavbar } from "@/components/dashboard/SuperAdminNavbar";
import { ComingSoonCard } from "@/components/super-admin/revenue/ComingSoonCard";
import { DummyRevenueDashboard } from "@/components/super-admin/revenue/DummyRevenueDashboard";

export const metadata: Metadata = {
  title: "Revenue Management",
};

export default function RevenueManagementPage() {
  return (
    <div className="flex h-screen w-full flex-col overflow-hidden bg-[#F5F5F7]">
      <SuperAdminNavbar />

      <div className="relative flex flex-1 overflow-hidden">
        <div aria-hidden className="pointer-events-none w-full select-none overflow-hidden blur-sm">
          <DummyRevenueDashboard />
        </div>

        <div className="absolute inset-0 flex items-center justify-center bg-black/5">
          <ComingSoonCard />
        </div>
      </div>
    </div>
  );
}
