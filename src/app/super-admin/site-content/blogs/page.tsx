"use client";

import { Pencil, Plus, Search } from "lucide-react";
import Link from "next/link";
import { useMemo, useState } from "react";
import { SuperAdminNavbar } from "@/components/dashboard/SuperAdminNavbar";
import { ALL_BLOGS, statusPillClasses } from "@/components/super-admin/content/contentData";
import { PageHeader } from "@/components/super-admin/ui/PageHeader";
import { Pagination } from "@/components/super-admin/ui/Pagination";

const PAGE_SIZE = 12;

export default function AllBlogsPage() {
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);

  const filtered = useMemo(
    () => ALL_BLOGS.filter((blog) => blog.title.toLowerCase().includes(search.toLowerCase())),
    [search],
  );
  const pageItems = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  return (
    <div className="flex min-h-screen w-full flex-col bg-[#F5F5F7]">
      <SuperAdminNavbar />

      <main className="flex-1 px-6 pb-10 pt-6 sm:px-10 lg:px-16">
        <PageHeader
          title="All Blogs"
          subtitle="Browse, search, and manage every article in one place."
          backHref="/super-admin/site-content"
          right={
            <Link
              href="/super-admin/site-content/blogs/new"
              className="flex cursor-pointer items-center gap-2 whitespace-nowrap rounded-full bg-[#F7931E] px-5 py-2.5 text-sm font-semibold text-white transition-opacity hover:opacity-90"
            >
              <Plus className="h-4 w-4" strokeWidth={2.5} />
              Add Blogs
            </Link>
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
            placeholder="Search blogs..."
            className="w-full rounded-full border border-[#E5E7EB] bg-white py-3 pl-11 pr-4 text-sm outline-none placeholder:text-[#9CA3AF] focus:border-[#F7931E]"
          />
        </div>

        <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {pageItems.length === 0 && (
            <p className="col-span-full rounded-[28px] border-2 border-black/[0.04] bg-white py-10 text-center text-sm text-[#9CA3AF]">
              No blogs found.
            </p>
          )}
          {pageItems.map((blog) => (
            <Link
              key={blog.id}
              href={`/super-admin/site-content/blogs/${blog.id}`}
              className="flex items-center gap-3 rounded-2xl border-2 border-black/[0.04] bg-white p-3 transition-colors hover:border-[#F7931E]/30"
            >
              <div className="h-14 w-14 shrink-0 rounded-xl" style={{ backgroundImage: blog.gradient }} />
              <div className="min-w-0 flex-1">
                <span
                  className={`inline-flex rounded-full px-2 py-0.5 text-[10px] font-bold uppercase ${statusPillClasses(blog.status)}`}
                >
                  {blog.status}
                </span>
                <p className="mt-1 truncate text-sm font-semibold text-black">{blog.title}</p>
                <p className="mt-0.5 flex items-center gap-1 text-xs text-[#9CA3AF]">
                  {blog.meta.startsWith("Last edited") && <Pencil className="h-3 w-3 shrink-0" strokeWidth={2} />}
                  {blog.meta}
                </p>
              </div>
            </Link>
          ))}
        </div>

        <div className="mt-5">
          <Pagination
            page={page}
            totalPages={Math.max(1, Math.ceil(filtered.length / PAGE_SIZE))}
            totalItems={filtered.length}
            pageSize={PAGE_SIZE}
            itemLabel="blogs"
            onPageChange={setPage}
          />
        </div>
      </main>
    </div>
  );
}
