import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import type { ReactNode } from "react";

type PageHeaderProps = {
  title: ReactNode;
  subtitle: string;
  backHref?: string;
  right?: ReactNode;
};

export function PageHeader({ title, subtitle, backHref = "/super-admin", right }: PageHeaderProps) {
  return (
    <div className="flex items-start justify-between gap-4">
      <div className="flex items-start gap-3">
        <Link
          href={backHref}
          aria-label="Back"
          className="mt-1 flex h-8 w-8 shrink-0 cursor-pointer items-center justify-center text-black transition-opacity hover:opacity-70"
        >
          <ArrowLeft className="h-6 w-6" strokeWidth={2} />
        </Link>
        <div>
          <h1 className="text-[28px] font-bold text-black">{title}</h1>
          <p className="mt-1 text-sm text-[#6B7280]">{subtitle}</p>
        </div>
      </div>
      {right && <div className="shrink-0">{right}</div>}
    </div>
  );
}
