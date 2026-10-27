"use client";

import { Plus, Search } from "lucide-react";
import { useMemo, useState } from "react";
import { SuperAdminNavbar } from "@/components/dashboard/SuperAdminNavbar";
import { FormModal } from "@/components/super-admin/masterdata/FormModal";
import { INITIAL_TAGS, type ProductTag } from "@/components/super-admin/masterdata/masterDataData";
import { PageHeader } from "@/components/super-admin/ui/PageHeader";
import { Pagination } from "@/components/super-admin/ui/Pagination";

const PAGE_SIZE = 12;

export default function ProductTagsPage() {
  const [tags, setTags] = useState(INITIAL_TAGS);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [createOpen, setCreateOpen] = useState(false);
  const [editingTag, setEditingTag] = useState<ProductTag | null>(null);

  const filtered = useMemo(() => tags.filter((tag) => tag.name.toLowerCase().includes(search.toLowerCase())), [tags, search]);
  const pageItems = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  function handleCreate(values: Record<string, string>) {
    if (!values.name?.trim()) return;
    if (editingTag) {
      setTags((prev) => prev.map((tag) => (tag.id === editingTag.id ? { ...tag, name: values.name } : tag)));
    } else {
      setTags((prev) => [{ id: `t${prev.length + 1}-${Date.now()}`, name: values.name }, ...prev]);
    }
  }

  return (
    <div className="flex min-h-screen w-full flex-col bg-[#F5F5F7]">
      <SuperAdminNavbar />

      <main className="flex-1 px-6 pb-10 pt-6 sm:px-10 lg:px-16">
        <PageHeader
          title="Product Tags"
          subtitle="Manage tags shown on customer-facing product listings."
          backHref="/super-admin/master-data"
          right={
            <button
              type="button"
              onClick={() => setCreateOpen(true)}
              className="flex cursor-pointer items-center gap-2 whitespace-nowrap rounded-full bg-[#F7931E] px-5 py-2.5 text-sm font-semibold text-white transition-opacity hover:opacity-90"
            >
              <Plus className="h-4 w-4" strokeWidth={2.5} />
              Product tag
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

        <div className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {pageItems.map((tag) => (
            <div key={tag.id} className="flex min-h-[100px] flex-col justify-between rounded-2xl border-2 border-black/[0.04] bg-white p-6">
              <h3 className="text-lg font-bold text-black">{tag.name}</h3>
              <button
                type="button"
                onClick={() => setEditingTag(tag)}
                className="mt-3 cursor-pointer self-end rounded-full border border-[#F7931E] px-4 py-1.5 text-xs font-semibold text-[#F7931E] transition-colors hover:bg-[#FEF3E2]"
              >
                Edit
              </button>
            </div>
          ))}
        </div>

        <div className="mt-5">
          <Pagination
            page={page}
            totalPages={Math.max(1, Math.ceil(filtered.length / PAGE_SIZE))}
            totalItems={filtered.length}
            pageSize={PAGE_SIZE}
            itemLabel="tags"
            onPageChange={setPage}
          />
        </div>
      </main>

      <FormModal
        open={createOpen || editingTag !== null}
        onClose={() => {
          setCreateOpen(false);
          setEditingTag(null);
        }}
        title="Product Tag"
        helperText="Tags help customers discover products aligned with their wellness goals."
        fields={[{ key: "name", label: "Tag Name", type: "text", placeholder: "e.g., Antioxidant Rich", required: true }]}
        initialValues={editingTag ? { name: editingTag.name } : undefined}
        submitLabel="Create Tag"
        onSubmit={handleCreate}
      />
    </div>
  );
}
