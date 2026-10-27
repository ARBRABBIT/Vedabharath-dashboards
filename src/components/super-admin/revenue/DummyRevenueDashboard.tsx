import { Clock, Filter, RotateCcw, TrendingUp } from "lucide-react";
import { statusPillClasses, TRANSACTIONS } from "@/components/super-admin/revenue/revenueData";

export function DummyRevenueDashboard() {
  return (
    <main className="flex-1 px-6 pb-10 pt-6 sm:px-10 lg:px-16">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-[28px] font-bold text-black">Financial Overview &amp; Revenue</h1>
          <p className="mt-1 text-sm text-[#6B7280]">Monitor your business performance and financial health.</p>
        </div>
        <span className="rounded-full border border-[#E5E7EB] bg-white px-4 py-2.5 text-sm font-semibold text-black">
          May 2026
        </span>
      </div>

      <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-3">
        <div className="rounded-[28px] border-2 border-black/[0.04] bg-white p-5">
          <div className="flex items-start justify-between">
            <p className="text-xs font-medium uppercase tracking-wide text-[#9CA3AF]">Gross Revenue</p>
            <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#EBF7EC]">
              <TrendingUp className="h-4 w-4 text-[#22C55E]" strokeWidth={2} />
            </span>
          </div>
          <p className="mt-3 text-3xl font-bold text-black">₹4,25,800</p>
        </div>
        <div className="rounded-[28px] border-2 border-black/[0.04] bg-white p-5">
          <div className="flex items-start justify-between">
            <p className="text-xs font-medium uppercase tracking-wide text-[#9CA3AF]">Pending Settlements</p>
            <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#FEF3E2]">
              <Clock className="h-4 w-4 text-[#F7931E]" strokeWidth={2} />
            </span>
          </div>
          <p className="mt-3 text-3xl font-bold text-black">₹18,650</p>
        </div>
        <div className="rounded-[28px] border-2 border-black/[0.04] bg-white p-5">
          <div className="flex items-start justify-between">
            <p className="text-xs font-medium uppercase tracking-wide text-[#9CA3AF]">Processed Refunds</p>
            <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#FEE2E2]">
              <RotateCcw className="h-4 w-4 text-[#EF4444]" strokeWidth={2} />
            </span>
          </div>
          <p className="mt-3 text-3xl font-bold text-black">₹4,200</p>
        </div>
      </div>

      <div className="mt-8 flex items-center justify-between">
        <h3 className="text-lg font-bold text-black">Recent Transactions</h3>
        <span className="flex items-center gap-2 rounded-full border border-[#E5E7EB] bg-white px-4 py-2 text-sm font-medium text-[#374151]">
          <Filter className="h-3.5 w-3.5" strokeWidth={2} />
          Filters
        </span>
      </div>

      <div className="mt-3 overflow-hidden rounded-[32px] border-2 border-black/[0.04] bg-white">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[760px]">
            <thead>
              <tr className="border-b border-[#F3F4F6] text-left text-xs font-semibold uppercase tracking-wide text-[#6B7280]">
                <th className="px-6 py-4">Transaction ID</th>
                <th className="px-4 py-4">Order ID</th>
                <th className="px-4 py-4">Date</th>
                <th className="px-4 py-4">Amount</th>
                <th className="px-4 py-4">Status</th>
                <th className="px-4 py-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody>
              {TRANSACTIONS.map((txn) => (
                <tr key={txn.id} className="border-b border-[#F3F4F6] last:border-none">
                  <td
                    className={`px-6 py-4 text-sm font-semibold ${
                      txn.status === "Refunded" ? "text-[#EF4444]" : "text-black"
                    }`}
                  >
                    {txn.id}
                  </td>
                  <td className="px-4 py-4 text-sm text-[#374151]">Order #{txn.orderId}</td>
                  <td className="px-4 py-4 text-sm text-[#6B7280]">{txn.date}</td>
                  <td className={`px-4 py-4 text-sm font-semibold ${txn.amount < 0 ? "text-[#EF4444]" : "text-black"}`}>
                    {txn.amount < 0 ? "-" : ""}₹{Math.abs(txn.amount).toLocaleString()}
                  </td>
                  <td className="px-4 py-4">
                    <span
                      className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold uppercase ${statusPillClasses(txn.status)}`}
                    >
                      {txn.status}
                    </span>
                  </td>
                  <td className="px-4 py-4 text-right">
                    <span className="inline-block whitespace-nowrap rounded-lg border border-[#E5E7EB] px-4 py-1.5 text-xs font-semibold text-[#374151]">
                      View Details
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="flex items-center justify-between border-t border-[#F3F4F6] px-6 py-4">
          <p className="text-sm text-[#6B7280]">Showing 1 to 4 of 128 transactions</p>
          <div className="flex items-center gap-2">
            {[1, 2, 3].map((num) => (
              <span
                key={num}
                className={`flex h-8 w-8 items-center justify-center rounded-full text-sm font-semibold ${
                  num === 1 ? "bg-[#F7931E] text-white" : "border border-[#E5E7EB] text-[#374151]"
                }`}
              >
                {num}
              </span>
            ))}
          </div>
        </div>
      </div>
    </main>
  );
}
