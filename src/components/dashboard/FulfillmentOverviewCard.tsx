"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { smoothPath } from "@/lib/smooth-path";
import { AnimatedCounter } from "@/components/dashboard/AnimatedCounter";

const CHART_WIDTH = 400;
const CHART_HEIGHT = 100;
const CHART_RENDER_HEIGHT = 130;
const SVG_TOP_OFFSET = 40;
const DAY_LABELS = ["1 day", "2 days", "3 days", "4 days", "5 days", "6 days", "7 days"];
const VALUES = [50, 90, 55, 95, 60, 80, 45];
const GRID_LINE_COUNT = 7;
const PEAK_INDEX = 3;

function toPoints(values: number[]): Array<[number, number]> {
  const step = CHART_WIDTH / (values.length - 1);
  return values.map((value, index) => [index * step, CHART_HEIGHT - value]);
}

const points = toPoints(VALUES);
const peakY = SVG_TOP_OFFSET + (points[PEAK_INDEX][1] / CHART_HEIGHT) * CHART_RENDER_HEIGHT;

// Keyframes tracing the actual line shape (day1 -> peak), relative to the
// grain's resting spot, so it flows along the wave instead of a straight line.
const TRAVEL_PX = 170;
const restX = points[PEAK_INDEX][0];
const restY = (points[PEAK_INDEX][1] / CHART_HEIGHT) * CHART_RENDER_HEIGHT;

const flowKeyframes = points.slice(0, PEAK_INDEX + 1).reduce(
  (acc, [x, y]) => {
    acc.x.push(((x - restX) / restX) * TRAVEL_PX);
    acc.y.push((y / CHART_HEIGHT) * CHART_RENDER_HEIGHT - restY);
    return acc;
  },
  { x: [] as number[], y: [] as number[] },
);

export function FulfillmentOverviewCard() {
  return (
    <div className="flex-1 rounded-[32px] border-2 border-black/[0.04] bg-white p-5 sm:p-6">
      <h3 className="text-xl font-semibold text-black">Fulfillment Overview - All Time</h3>

      <div className="relative mt-12" style={{ height: SVG_TOP_OFFSET + CHART_RENDER_HEIGHT }}>
        <div
          className="absolute inset-x-1 flex justify-between"
          style={{ top: SVG_TOP_OFFSET, height: CHART_RENDER_HEIGHT }}
        >
          {Array.from({ length: GRID_LINE_COUNT }).map((_, index) => (
            <div
              key={index}
              className="h-full w-0 border-l border-dashed border-[#DADADA]/55"
            />
          ))}
        </div>

        <svg
          viewBox={`0 0 ${CHART_WIDTH} ${CHART_HEIGHT}`}
          className="absolute inset-x-0 w-full"
          style={{ top: SVG_TOP_OFFSET, height: CHART_RENDER_HEIGHT }}
          preserveAspectRatio="none"
        >
          <defs>
            <linearGradient id="fulfillment-line-fade" x1="0" x2="1" y1="0" y2="0">
              <stop offset="0%" stopColor="#1B4332" stopOpacity={0} />
              <stop offset="15%" stopColor="#1B4332" stopOpacity={1} />
              <stop offset="85%" stopColor="#1B4332" stopOpacity={1} />
              <stop offset="100%" stopColor="#1B4332" stopOpacity={0} />
            </linearGradient>
          </defs>
          <path
            d={smoothPath(points)}
            fill="none"
            stroke="url(#fulfillment-line-fade)"
            strokeWidth={2}
            strokeLinecap="round"
          />
        </svg>

        <div
          className="pointer-events-none absolute left-1/2 origin-bottom"
          style={{ top: peakY, transform: "translate(-50%, -46%)" }}
        >
          <motion.div
            className="drop-shadow-[0_18px_14px_rgba(0,0,0,0.22)]"
            initial={{
              opacity: 0,
              filter: "blur(10px)",
              scale: 0.8,
              x: flowKeyframes.x[0],
              y: flowKeyframes.y[0],
              rotate: -10,
            }}
            animate={{
              opacity: 1,
              filter: "blur(0px)",
              scale: 1,
              x: flowKeyframes.x,
              y: flowKeyframes.y,
              rotate: [-10, -2, -14, 4],
            }}
            transition={{
              opacity: { duration: 0.4, ease: "easeOut" },
              filter: { duration: 0.4, ease: "easeOut" },
              scale: { duration: 0.4, ease: "easeOut" },
              x: { duration: 1.4, ease: "easeInOut" },
              y: { duration: 1.4, ease: "easeInOut" },
              rotate: { duration: 1.4, ease: "easeInOut" },
            }}
          >
            <Image src="/Warehouse/ricegrain.png" alt="" width={64} height={91} />
          </motion.div>
        </div>

        <div
          className="pointer-events-none absolute left-1/2 whitespace-nowrap rounded-lg border border-dashed border-white/50 bg-white/70 px-2.5 py-1 text-[10px] font-bold text-[#8F4E00] shadow-[0_10px_16px_-3px_rgba(0,0,0,0.1)] backdrop-blur-sm"
          style={{ top: peakY, transform: "translate(-50%, -220%)" }}
        >
          <AnimatedCounter value={3.5} decimals={1} suffix=" Days" />
        </div>
      </div>

      <div className="flex justify-between text-xs font-medium text-[#544437]/50">
        {DAY_LABELS.map((label) => (
          <span key={label}>{label}</span>
        ))}
      </div>

      <div className="mt-6 flex flex-col gap-3">
        <div className="flex items-center justify-between rounded-2xl bg-[#F7F7F7]/60 p-4">
          <span className="text-base font-semibold text-[#1F1B17]">Avg. Fulfillment Days</span>
          <span className="rounded-full bg-[#D8F3DC] px-3 py-1 text-xs font-bold text-[#1B4332]">
            <AnimatedCounter value={3.5} decimals={1} suffix=" Days" />
          </span>
        </div>
        <div className="flex items-center justify-between rounded-2xl bg-[#F7F7F7]/60 p-4">
          <span className="text-base font-semibold text-[#1F1B17]">Best Fulfillment Days</span>
          <span className="rounded-full bg-[#D8F3DC] px-3 py-1 text-xs font-bold text-[#1B4332]">
            <AnimatedCounter value={1.5} decimals={1} suffix=" Days" />
          </span>
        </div>
      </div>
    </div>
  );
}
