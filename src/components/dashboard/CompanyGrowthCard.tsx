"use client";

import { ChevronDown } from "lucide-react";
import { useState } from "react";
import { smoothPath } from "@/lib/smooth-path";
import { AnimatedCounter } from "@/components/dashboard/AnimatedCounter";

const CHART_WIDTH = 400;
const CHART_HEIGHT = 200;
const Y_TICKS = [200, 150, 100, 50, 0];

type Range = "7d" | "30d" | "90d";

const RANGE_CONFIG: Record<
  Range,
  {
    label: string;
    xLabels: string[];
    orders: number[];
    delivery: number[];
    ordersGrowth: number;
    deliveryGrowth: number;
  }
> = {
  "7d": {
    label: "Last 7 days",
    xLabels: ["Jul30", "Jul31", "Aug1", "Aug2"],
    orders: [120, 145, 132, 168, 155, 180, 196],
    delivery: [98, 110, 105, 128, 120, 140, 152],
    ordersGrowth: 9.2,
    deliveryGrowth: 11.5,
  },
  "30d": {
    label: "Last 30 days",
    xLabels: ["May1", "May10", "May20", "May30"],
    orders: [40, 95, 88, 132, 118, 165, 196],
    delivery: [38, 62, 68, 95, 90, 128, 152],
    ordersGrowth: 18.6,
    deliveryGrowth: 22.4,
  },
  "90d": {
    label: "Last 90 days",
    xLabels: ["Mar", "Apr", "May", "Jun"],
    orders: [60, 72, 65, 98, 110, 140, 196],
    delivery: [45, 58, 52, 80, 92, 118, 152],
    ordersGrowth: 34.8,
    deliveryGrowth: 39.1,
  },
};

function toPoints(values: number[]): Array<[number, number]> {
  const step = CHART_WIDTH / (values.length - 1);
  return values.map((value, index) => [index * step, CHART_HEIGHT - value]);
}

export function CompanyGrowthCard() {
  const [range, setRange] = useState<Range>("30d");
  const config = RANGE_CONFIG[range];
  const ordersPoints = toPoints(config.orders);
  const deliveryPoints = toPoints(config.delivery);

  return (
    <div className="flex-[1.15] rounded-[32px] border-2 border-black/[0.04] bg-white p-5 sm:p-6">
      <div className="flex items-center justify-between">
        <h3 className="text-xl font-semibold text-black">Company Growth</h3>
        <div className="relative">
          <select
            value={range}
            onChange={(event) => setRange(event.target.value as Range)}
            className="cursor-pointer appearance-none bg-transparent pr-5 text-xs font-medium text-[#83818C] outline-none"
          >
            {(Object.keys(RANGE_CONFIG) as Range[]).map((key) => (
              <option key={key} value={key}>
                {RANGE_CONFIG[key].label}
              </option>
            ))}
          </select>
          <ChevronDown
            className="pointer-events-none absolute right-0 top-1/2 h-4 w-4 -translate-y-1/2 text-[#83818C]"
            strokeWidth={2}
          />
        </div>
      </div>

      <div className="mt-4 flex flex-wrap items-center gap-4 sm:gap-6">
        <div className="flex items-center gap-2">
          <span className="h-1.5 w-1.5 rounded-full bg-[#F7931E]" />
          <span className="text-sm font-medium text-black">Orders</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="h-1.5 w-1.5 rounded-full bg-[#006C47]" />
          <span className="text-sm font-medium text-black">Delivery Performance</span>
        </div>
      </div>

      <div className="mt-5 flex flex-wrap items-end gap-4 sm:gap-8">
        <div>
          <AnimatedCounter
            key={`orders-${range}`}
            value={config.ordersGrowth}
            decimals={1}
            prefix="+"
            suffix="%"
            className="text-[32px] leading-[38px] text-black"
          />
          <p className="text-base text-black">Orders Growth</p>
        </div>
        <div>
          <AnimatedCounter
            key={`delivery-${range}`}
            value={config.deliveryGrowth}
            decimals={1}
            prefix="+"
            suffix="%"
            className="text-[32px] leading-[38px] text-black"
          />
          <p className="text-base text-black">Delivery Performance</p>
        </div>
      </div>

      <div className="mt-6 flex gap-2">
        <div className="flex flex-col justify-between py-0.5 text-xs font-medium text-black">
          {Y_TICKS.map((tick) => (
            <span key={tick}>{tick}</span>
          ))}
        </div>
        <svg
          viewBox={`0 -12 ${CHART_WIDTH} ${CHART_HEIGHT + 16}`}
          className="h-[180px] w-full overflow-visible"
          preserveAspectRatio="none"
        >
          {Y_TICKS.map((tick) => (
            <line
              key={tick}
              x1={0}
              x2={CHART_WIDTH}
              y1={CHART_HEIGHT - tick}
              y2={CHART_HEIGHT - tick}
              stroke="rgba(134,134,139,0.16)"
              strokeWidth={1}
            />
          ))}
          <path
            d={smoothPath(deliveryPoints)}
            fill="none"
            stroke="#006C47"
            strokeWidth={1.5}
            strokeLinecap="round"
          />
          <path
            d={smoothPath(ordersPoints)}
            fill="none"
            stroke="#F7931E"
            strokeWidth={1.5}
            strokeLinecap="round"
          />
          {deliveryPoints.map(([x, y]) => (
            <circle key={`d-${x}`} cx={x} cy={y} r={3} fill="#006C47" />
          ))}
          {ordersPoints.map(([x, y]) => (
            <circle key={`o-${x}`} cx={x} cy={y} r={3} fill="#F7931E" />
          ))}
        </svg>
      </div>
      <div className="flex justify-between pl-7 text-xs font-medium text-black">
        {config.xLabels.map((label) => (
          <span key={label}>{label}</span>
        ))}
      </div>
    </div>
  );
}
