import { CheckCircle2, PackageCheck, Truck } from "lucide-react";
import type { Metadata } from "next";
import { AnimatedCounter } from "@/components/dashboard/AnimatedCounter";
import { DashboardNavbar } from "@/components/dashboard/DashboardNavbar";
import { HeroBanner } from "@/components/dashboard/HeroBanner";
import { OrdersQueue } from "@/components/orders/OrdersQueue";

export const metadata: Metadata = {
  title: "Orders",
};

const STATS = [
  { icon: PackageCheck, label: "To Be Packed", value: 84 },
  { icon: Truck, label: "Orders Shipped", value: 56 },
  { icon: CheckCircle2, label: "Delivered Today", value: 38 },
];

export default function OrdersPage() {
  return (
    <div className="flex min-h-screen w-full flex-col bg-[#F5F5F7]">
      <DashboardNavbar />

      <main className="flex-1 px-6 pb-10 pt-6 sm:px-10 lg:px-16">
        <HeroBanner
          heading="Orders Made Effortless"
          subtitle="Track, manage, and process every order without the clutter."
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

        <OrdersQueue />
      </main>
    </div>
  );
}
