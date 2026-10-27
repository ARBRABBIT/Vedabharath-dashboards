"use client";

import { Download, type LucideIcon } from "lucide-react";

export type ReportCardData = {
  icon: LucideIcon;
  title: string;
  description: string;
  fileName: string;
  rows: string[][];
};

function downloadCsv(fileName: string, rows: string[][]) {
  const csv = rows
    .map((row) => row.map((cell) => `"${cell.replace(/"/g, '""')}"`).join(","))
    .join("\n");
  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = fileName;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

export function ReportCard({ icon: Icon, title, description, fileName, rows }: ReportCardData) {
  return (
    <div className="flex flex-col gap-5 rounded-[24px] bg-white p-7 shadow-[0_4px_24px_rgba(0,0,0,0.04)]">
      <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-[#F9A51A]">
        <Icon className="h-6 w-6 text-white" strokeWidth={2} />
      </div>

      <div className="flex flex-col gap-2">
        <h3 className="text-xl font-semibold text-black">{title}</h3>
        <p className="text-sm leading-[22px] text-[#6E7B6A]">{description}</p>
      </div>

      <button
        type="button"
        onClick={() => downloadCsv(fileName, rows)}
        className="flex w-fit cursor-pointer items-center gap-2 text-sm font-semibold text-[#3BB54A] transition-colors hover:text-[#2f9d3d]"
      >
        <Download className="h-4 w-4" strokeWidth={2} />
        Download CSV
      </button>
    </div>
  );
}
