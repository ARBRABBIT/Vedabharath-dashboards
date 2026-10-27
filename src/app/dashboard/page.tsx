import { Clock, ShoppingBag, Truck } from "lucide-react";
import type { Metadata } from "next";
import { ActivityTicketTable } from "@/components/dashboard/ActivityTicketTable";
import { AnimatedCounter } from "@/components/dashboard/AnimatedCounter";
import { DashboardNavbar } from "@/components/dashboard/DashboardNavbar";
import { FulfillmentOverviewCard } from "@/components/dashboard/FulfillmentOverviewCard";
import { HeroBanner } from "@/components/dashboard/HeroBanner";
import { InventoryAlertsCard } from "@/components/dashboard/InventoryAlertsCard";

export const metadata: Metadata = {
  title: "Dashboard",
};

const STATS = [
  { icon: ShoppingBag, label: "Total Orders", value: 142 },
  { icon: Truck, label: "Orders Shipped", value: 92 },
  { icon: Clock, label: "Orders Pending", value: 24 },
];

export default function DashboardPage() {
  return (
    <div className="flex min-h-screen w-full flex-col bg-white">
      <DashboardNavbar />

      <main className="flex-1 px-6 pb-10 pt-6 sm:px-10 lg:px-16">
        <HeroBanner
          heading="Dashboard"
          subtitle="Monitor your operations and take action"
        >
          <div className="flex flex-wrap gap-3">
            {STATS.map((stat) => (
              <div
                key={stat.label}
                className="flex w-fit min-w-[199px] items-center gap-3 rounded-2xl border border-white/30 bg-white/20 p-2.5 backdrop-blur-sm"
              >
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-white">
                  <stat.icon className="h-4 w-4 text-[#F7931E]" strokeWidth={1.5} />
                </div>
                <div className="flex flex-col">
                  <span className="whitespace-nowrap text-sm font-medium capitalize tracking-[0.5px] text-white/80">
                    {stat.label}
                  </span>
                  <AnimatedCounter
                    value={stat.value}
                    className="text-2xl font-medium leading-7 text-white"
                  />
                </div>
              </div>
            ))}
          </div>
        </HeroBanner>

        <div className="mt-6 flex flex-col gap-6 lg:flex-row">
          <InventoryAlertsCard />
          <FulfillmentOverviewCard />
        </div>

        <div className="mt-10">
          <ActivityTicketTable />
        </div>
      </main>
    </div>
  );
}
