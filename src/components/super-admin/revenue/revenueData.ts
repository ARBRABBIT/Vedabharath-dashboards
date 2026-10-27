export type Transaction = {
  id: string;
  orderId: string;
  date: string;
  amount: number;
  status: "UPI Success" | "Refunded" | "Pending";
};

export const TRANSACTIONS: Transaction[] = [
  { id: "TXN-99842", orderId: "VB-8495", date: "18 May 2026, 11:40 AM", amount: 1200, status: "UPI Success" },
  { id: "TXN-99843", orderId: "VB-8501", date: "18 May 2026, 12:05 PM", amount: 4850, status: "UPI Success" },
  { id: "TXN-99844", orderId: "VB-8512", date: "18 May 2026, 12:15 PM", amount: -750, status: "Refunded" },
  { id: "TXN-99845", orderId: "VB-8520", date: "18 May 2026, 01:05 PM", amount: 2340, status: "UPI Success" },
];

export function statusPillClasses(status: Transaction["status"]) {
  if (status === "Refunded") return "bg-[#FEE2E2] text-[#EF4444]";
  if (status === "Pending") return "bg-[#FEF3E2] text-[#F7931E]";
  return "bg-[#EBF7EC] text-[#22C55E]";
}
