"use client";

import { ClipboardCheck, Gauge, ShoppingCart } from "lucide-react";
import { ReportCard, type ReportCardData } from "./ReportCard";

const REPORTS: ReportCardData[] = [
  {
    icon: ShoppingCart,
    title: "Order Report",
    description:
      "Complete breakdown of daily transaction volume across all regional fulfillment centers.",
    fileName: "order-report.csv",
    rows: [
      ["Order ID", "Customer", "Amount", "Status"],
      ["#VB-8492", "Priya Patel", "1200", "Delivered"],
      ["#VB-8491", "Karthik Suraj", "2450", "Shipped"],
      ["#VB-8490", "Sneha Desai", "450", "Returned"],
    ],
  },
  {
    icon: Gauge,
    title: "Fulfillment Performance",
    description:
      "Detailed analysis of pack times, dispatch cycles, and service level agreement compliance.",
    fileName: "fulfillment-performance.csv",
    rows: [
      ["Metric", "Value"],
      ["Avg. Pack Time", "18 min"],
      ["Avg. Dispatch Cycle", "6.4 hrs"],
      ["SLA Compliance", "96.2%"],
    ],
  },
  {
    icon: ClipboardCheck,
    title: "Out-of-Stock History",
    description:
      "Historical inventory logs identifying SKU shortages and replenishment cycle delays.",
    fileName: "out-of-stock-history.csv",
    rows: [
      ["SKU", "Item", "Flagged On", "Restocked On"],
      ["VB-DU-92", "Dudeshwar", "2026-07-29", "2026-08-02"],
      ["VB-BA-91", "Bahurupi", "2026-07-25", "2026-07-28"],
    ],
  },
];

export function ReportsGrid() {
  return (
    <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {REPORTS.map((report) => (
        <ReportCard key={report.title} {...report} />
      ))}
    </div>
  );
}
