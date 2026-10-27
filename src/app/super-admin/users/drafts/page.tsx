"use client";

import { motion } from "framer-motion";
import { Calendar, Check, Clock, Search, Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";
import { SuperAdminNavbar } from "@/components/dashboard/SuperAdminNavbar";
import { categoryPillClasses, INITIAL_DRAFTS, type Draft } from "@/components/super-admin/drafts/draftsData";
import { ConfirmModal } from "@/components/super-admin/masterdata/ConfirmModal";
import { ModalShell } from "@/components/orders/modals/ModalShell";
import { PageHeader } from "@/components/super-admin/ui/PageHeader";
import { Pagination } from "@/components/super-admin/ui/Pagination";

const PAGE_SIZE = 12;

export default function UserManagementDraftsPage() {
  const router = useRouter();
  const [drafts, setDrafts] = useState(INITIAL_DRAFTS);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [deleteTarget, setDeleteTarget] = useState<Draft | null>(null);
  const [deletedConfirmOpen, setDeletedConfirmOpen] = useState(false);

  const filtered = useMemo(
    () => drafts.filter((draft) => draft.title.toLowerCase().includes(search.toLowerCase())),
    [drafts, search],
  );
  const pageItems = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  function handleDelete() {
    if (!deleteTarget) return;
    setDrafts((prev) => prev.filter((draft) => draft.id !== deleteTarget.id));
    setDeleteTarget(null);
    setDeletedConfirmOpen(true);
  }

  function handleResume(href: string | null) {
    if (href) router.push(href);
  }

  return (
    <div className="flex min-h-screen w-full flex-col bg-[#F5F5F7]">
      <SuperAdminNavbar />

      <main className="flex-1 px-6 pb-10 pt-6 sm:px-10 lg:px-16">
        <PageHeader
          title="Drafts"
          subtitle="Manage, resume, or discard your pending operational updates across all modules."
          backHref="/super-admin/users"
          right={
            <div className="relative">
              <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-[#9CA3AF]" />
              <input
                type="text"
                value={search}
                onChange={(event) => {
                  setSearch(event.target.value);
                  setPage(1);
                }}
                placeholder="Search..."
                className="w-[220px] rounded-full border border-[#E5E7EB] bg-white py-2.5 pl-11 pr-4 text-sm outline-none placeholder:text-[#9CA3AF] focus:border-[#F7931E]"
              />
            </div>
          }
        />

        <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.length === 0 && (
            <p className="col-span-full py-10 text-center text-sm text-[#9CA3AF]">No drafts found.</p>
          )}
          {pageItems.map((draft) => (
            <div key={draft.id} className="flex flex-col rounded-[28px] border-2 border-black/[0.04] bg-white p-5">
              <div className="flex items-start justify-between">
                <span
                  className={`inline-flex rounded-full px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide ${categoryPillClasses(draft.category)}`}
                >
                  {draft.category}
                </span>
                <button
                  type="button"
                  onClick={() => setDeleteTarget(draft)}
                  aria-label="Delete draft"
                  className="cursor-pointer text-[#9CA3AF] transition-colors hover:text-[#EF4444]"
                >
                  <Trash2 className="h-4 w-4" strokeWidth={2} />
                </button>
              </div>

              <h3 className="mt-3 text-base font-bold text-black">{draft.title}</h3>
              <p className="mt-1.5 flex-1 text-sm leading-relaxed text-[#6B7280]">{draft.description}</p>

              <div className="mt-4 flex items-center justify-between border-t border-[#F3F4F6] pt-4">
                <span className="flex items-center gap-1.5 text-xs text-[#9CA3AF]">
                  {draft.savedAgo.includes("day") ? (
                    <Calendar className="h-3.5 w-3.5" strokeWidth={2} />
                  ) : (
                    <Clock className="h-3.5 w-3.5" strokeWidth={2} />
                  )}
                  {draft.savedAgo}
                </span>
                <button
                  type="button"
                  onClick={() => handleResume(draft.resumeHref)}
                  disabled={!draft.resumeHref}
                  className="cursor-pointer whitespace-nowrap rounded-full bg-[#F7931E] px-5 py-2 text-xs font-bold text-white transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-40"
                >
                  Resume Edit
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
            itemLabel="Drafts"
            onPageChange={setPage}
          />
        </div>
      </main>

      <ConfirmModal
        open={deleteTarget !== null}
        onClose={() => setDeleteTarget(null)}
        icon={Trash2}
        iconBg="bg-[#FEF2F2]"
        iconColor="text-[#EF4444]"
        title="Discard this draft?"
        description={`This will permanently remove '${deleteTarget?.title}' from your Drafts workspace. This action cannot be undone.`}
        cancelLabel="Cancel"
        onCancel={() => setDeleteTarget(null)}
        confirmLabel="Discard Draft"
        onConfirm={handleDelete}
      />

      <ModalShell open={deletedConfirmOpen} onClose={() => setDeletedConfirmOpen(false)} maxWidth="max-w-[420px]">
        <div className="flex flex-col items-center gap-4 p-8 text-center">
          <motion.div
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: "spring", stiffness: 400, damping: 15 }}
            className="flex h-16 w-16 items-center justify-center rounded-full bg-[#EBF7EC]"
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", stiffness: 400, damping: 12, delay: 0.15 }}
            >
              <Check className="h-7 w-7 text-[#22C55E]" strokeWidth={3} />
            </motion.div>
          </motion.div>
          <div>
            <h2 className="text-xl font-bold text-black">Draft Discarded</h2>
            <p className="mt-2 text-sm leading-relaxed text-[#6B7280]">
              The draft has been permanently removed from your workspace.
            </p>
          </div>
          <button
            type="button"
            onClick={() => setDeletedConfirmOpen(false)}
            className="mt-2 w-full cursor-pointer rounded-full bg-[#F7931E] py-3 text-sm font-bold text-white transition-opacity hover:opacity-90"
          >
            Done
          </button>
        </div>
      </ModalShell>
    </div>
  );
}
