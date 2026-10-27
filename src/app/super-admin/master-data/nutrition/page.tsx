"use client";

import { Plus, Search } from "lucide-react";
import { useMemo, useState } from "react";
import { SuperAdminNavbar } from "@/components/dashboard/SuperAdminNavbar";
import { FormModal } from "@/components/super-admin/masterdata/FormModal";
import { INITIAL_NUTRIENTS, type Nutrient } from "@/components/super-admin/masterdata/masterDataData";
import { PageHeader } from "@/components/super-admin/ui/PageHeader";
import { Pagination } from "@/components/super-admin/ui/Pagination";

const PAGE_SIZE = 6;

export default function NutritionLibraryPage() {
  const [nutrients, setNutrients] = useState(INITIAL_NUTRIENTS);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [createOpen, setCreateOpen] = useState(false);
  const [editingNutrient, setEditingNutrient] = useState<Nutrient | null>(null);

  const filtered = useMemo(
    () => nutrients.filter((nutrient) => nutrient.name.toLowerCase().includes(search.toLowerCase())),
    [nutrients, search],
  );
  const pageItems = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  function handleSubmit(values: Record<string, string>) {
    if (!values.name?.trim()) return;
    if (editingNutrient) {
      setNutrients((prev) =>
        prev.map((nutrient) =>
          nutrient.id === editingNutrient.id ? { ...nutrient, name: values.name, unit: values.unit ?? "" } : nutrient,
        ),
      );
    } else {
      setNutrients((prev) => [
        { id: `n${prev.length + 1}-${Date.now()}`, name: values.name, unit: values.unit ?? "" },
        ...prev,
      ]);
    }
  }

  return (
    <div className="flex min-h-screen w-full flex-col bg-[#F5F5F7]">
      <SuperAdminNavbar />

      <main className="flex-1 px-6 pb-10 pt-6 sm:px-10 lg:px-16">
        <PageHeader
          title="Nutrition Library"
          subtitle="Maintain the master list of nutrients used across products."
          backHref="/super-admin/master-data"
          right={
            <button
              type="button"
              onClick={() => setCreateOpen(true)}
              className="flex cursor-pointer items-center gap-2 whitespace-nowrap rounded-full bg-[#F7931E] px-5 py-2.5 text-sm font-semibold text-white transition-opacity hover:opacity-90"
            >
              <Plus className="h-4 w-4" strokeWidth={2.5} />
              New Nutrient
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
            placeholder="Search Nutrition..."
            className="w-full rounded-full border border-[#E5E7EB] bg-white py-3 pl-11 pr-4 text-sm outline-none placeholder:text-[#9CA3AF] focus:border-[#F7931E]"
          />
        </div>

        <div className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {pageItems.map((nutrient) => (
            <div key={nutrient.id} className="flex min-h-[140px] flex-col justify-between rounded-2xl border-2 border-black/[0.04] bg-white p-8">
              <h3 className="text-lg font-semibold text-black">{nutrient.name}</h3>
              <div className="mt-6 flex items-end justify-between">
                <div>
                  <p className="text-xs text-[#9CA3AF]">Unit</p>
                  <p className="text-sm font-semibold text-black">{nutrient.unit}</p>
                </div>
                <button
                  type="button"
                  onClick={() => setEditingNutrient(nutrient)}
                  className="cursor-pointer rounded-full border border-[#F7931E] px-4 py-1.5 text-xs font-semibold text-[#F7931E] transition-colors hover:bg-[#FEF3E2]"
                >
                  Edit
                </button>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-5">
          <Pagination
            page={page}
            totalPages={Math.max(1, Math.ceil(filtered.length / PAGE_SIZE))}
            totalItems={filtered.length}
            pageSize={PAGE_SIZE}
            itemLabel="nutrients"
            onPageChange={setPage}
          />
        </div>
      </main>

      <FormModal
        open={createOpen || editingNutrient !== null}
        onClose={() => {
          setCreateOpen(false);
          setEditingNutrient(null);
        }}
        title="Nutrition Library"
        fields={[
          { key: "name", label: "Nutrient Name", type: "text", placeholder: "carbohydrates" },
          { key: "unit", label: "Units", type: "text", placeholder: "Grams" },
        ]}
        initialValues={editingNutrient ? { name: editingNutrient.name, unit: editingNutrient.unit } : undefined}
        submitLabel="Create Nutrition"
        onSubmit={handleSubmit}
      />
    </div>
  );
}
