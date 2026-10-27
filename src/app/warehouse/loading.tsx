import { Loader2 } from "lucide-react";

export default function DashboardLoading() {
  return (
    <div className="flex min-h-screen w-full items-center justify-center bg-white">
      <Loader2 className="h-8 w-8 animate-spin text-[#F9A51A]" strokeWidth={2.5} />
    </div>
  );
}
