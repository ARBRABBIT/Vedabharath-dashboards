"use client";

import { Plus, Search } from "lucide-react";
import { useMemo, useState } from "react";
import { SuperAdminNavbar } from "@/components/dashboard/SuperAdminNavbar";
import { FormModal } from "@/components/super-admin/masterdata/FormModal";
import { INITIAL_HEALTH_BENEFITS, type HealthBenefit } from "@/components/super-admin/masterdata/masterDataData";
import { PageHeader } from "@/components/super-admin/ui/PageHeader";
import { Pagination } from "@/components/super-admin/ui/Pagination";

const PAGE_SIZE = 10;

export default function HealthBenefitsPage() {
  const [benefits, setBenefits] = useState(INITIAL_HEALTH_BENEFITS);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [createOpen, setCreateOpen] = useState(false);
  const [editingBenefit, setEditingBenefit] = useState<HealthBenefit | null>(null);

  const filtered = useMemo(
    () => benefits.filter((benefit) => benefit.name.toLowerCase().includes(search.toLowerCase())),
    [benefits, search],
  );
  const pageItems = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  function handleSubmit(values: Record<string, string>) {
    if (!values.name?.trim()) return;
    if (editingBenefit) {
      setBenefits((prev) =>
        prev.map((benefit) =>
          benefit.id === editingBenefit.id ? { ...benefit, name: values.name, description: values.description ?? "" } : benefit,
        ),
      );
    } else {
      setBenefits((prev) => [
        { id: `hb${prev.length + 1}-${Date.now()}`, name: values.name, description: values.description ?? "" },
        ...prev,
      ]);
    }
  }

  return (
    <div className="flex min-h-screen w-full flex-col bg-[#F5F5F7]">
      <SuperAdminNavbar />

      <main className="flex-1 px-6 pb-10 pt-6 sm:px-10 lg:px-16">
        <PageHeader
          title="Health Benefits"
          subtitle="Manage wellness claims shown for products."
          backHref="/super-admin/master-data"
          right={
            <button
              type="button"
              onClick={() => setCreateOpen(true)}
              className="flex cursor-pointer items-center gap-2 whitespace-nowrap rounded-full bg-[#F7931E] px-5 py-2.5 text-sm font-semibold text-white transition-opacity hover:opacity-90"
            >
              <Plus className="h-4 w-4" strokeWidth={2.5} />
              Add Health Benefit
            </button>
          }
        />

        <div className="relative mt-6">
          <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-[#9CA3AF]" />
          <input
            type="text"
            value={search}
            onChange={(event) => {
              setSearch(event.target.value);
              setPage(1);
            }}
            placeholder="Search Health Benefits.."
            className="w-full rounded-full border border-[#E5E7EB] bg-white py-3 pl-11 pr-4 text-sm outline-none placeholder:text-[#9CA3AF] focus:border-[#F7931E]"
          />
        </div>

        <div className="mt-5 overflow-hidden rounded-[32px] border-2 border-black/[0.04] bg-white">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[720px]">
              <thead>
                <tr className="border-b border-[#F3F4F6] text-left text-xs font-semibold uppercase tracking-wide text-[#6B7280]">
                  <th className="px-6 py-4">Index</th>
                  <th className="px-4 py-4">Benefit Identity</th>
                  <th className="px-4 py-4">Description Summary</th>
                  <th className="px-4 py-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody>
                {pageItems.map((benefit, index) => (
                  <tr key={benefit.id} className="border-b border-[#F3F4F6] last:border-none">
                    <td className="px-6 py-4 text-sm text-[#9CA3AF]">{String(index + 1).padStart(2, "0")}</td>
                    <td className="px-4 py-4 text-sm font-semibold text-black">{benefit.name}</td>
                    <td className="px-4 py-4 text-sm text-[#6B7280]">{benefit.description}</td>
                    <td className="px-4 py-4 text-right">
                      <button
                        type="button"
                        onClick={() => setEditingBenefit(benefit)}
                        className="cursor-pointer rounded-full border border-[#F7931E] px-4 py-1.5 text-xs font-semibold text-[#F7931E] transition-colors hover:bg-[#FEF3E2]"
                      >
                        Edit
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="border-t border-[#F3F4F6] px-6 pb-6 pt-4">
            <Pagination
              page={page}
              totalPages={Math.max(1, Math.ceil(filtered.length / PAGE_SIZE))}
              totalItems={filtered.length}
              pageSize={PAGE_SIZE}
              itemLabel="benefits"
              onPageChange={setPage}
            />
          </div>
        </div>
      </main>

      <FormModal
        open={createOpen || editingBenefit !== null}
        onClose={() => {
          setCreateOpen(false);
          setEditingBenefit(null);
        }}
        title="Health Benefits"
        fields={[
          { key: "name", label: "Benefit Identity", type: "text", placeholder: "e.g., Antioxidant Rich" },
          { key: "description", label: "Description", type: "textarea", placeholder: "Helps muscle growth and recovery effectively." },
        ]}
        initialValues={editingBenefit ? { name: editingBenefit.name, description: editingBenefit.description } : undefined}
        submitLabel="Create Health Benefit"
        onSubmit={handleSubmit}
      />
    </div>
  );
}
