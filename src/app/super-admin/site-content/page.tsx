"use client";

import { ChevronRight, Eye, Pencil, Plus, Search } from "lucide-react";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { SuperAdminNavbar } from "@/components/dashboard/SuperAdminNavbar";
import {
  BANNERS,
  BLOGS,
  CONTENT_DRAFTS,
  UPCOMING_EVENTS,
  statusPillClasses,
} from "@/components/super-admin/content/contentData";

type Tab = "Blogs" | "Banners" | "Drafts";

export default function SiteContentPage() {
  const [tab, setTab] = useState<Tab>("Blogs");
  const [search, setSearch] = useState("");

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const tabParam = params.get("tab");
    if (tabParam === "Blogs" || tabParam === "Banners" || tabParam === "Drafts") {
      setTab(tabParam);
      window.history.replaceState(null, "", "/super-admin/site-content");
    }
  }, []);

  const featured = BLOGS.find((blog) => blog.featured);
  const otherBlogs = BLOGS.filter((blog) => !blog.featured);

  const filteredBlogs = useMemo(
    () => otherBlogs.filter((blog) => blog.title.toLowerCase().includes(search.toLowerCase())),
    [otherBlogs, search],
  );
  const filteredBanners = useMemo(
    () => BANNERS.filter((banner) => banner.name.toLowerCase().includes(search.toLowerCase())),
    [search],
  );
  const filteredDrafts = useMemo(
    () => CONTENT_DRAFTS.filter((draft) => draft.title.toLowerCase().includes(search.toLowerCase())),
    [search],
  );

  return (
    <div className="flex min-h-screen w-full flex-col bg-[#F5F5F7]">
      <SuperAdminNavbar />

      <main className="flex-1 px-6 pb-10 pt-6 sm:px-10 lg:px-16">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="inline-flex items-center gap-1 rounded-full bg-white p-1.5 shadow-[0_2px_10px_rgba(0,0,0,0.05)]">
            {(["Blogs", "Banners", "Drafts"] as Tab[]).map((option) => (
              <button
                key={option}
                type="button"
                onClick={() => setTab(option)}
                className={`cursor-pointer rounded-full px-5 py-2 text-sm font-semibold transition-colors ${
                  tab === option ? "bg-[#F7931E] text-white" : "text-[#374151] hover:text-black"
                }`}
              >
                {option}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-3">
            <div className="relative">
              <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-[#9CA3AF]" />
              <input
                type="text"
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Search..."
                className="w-[220px] rounded-full border border-[#E5E7EB] bg-white py-2.5 pl-11 pr-4 text-sm outline-none placeholder:text-[#9CA3AF] focus:border-[#F7931E]"
              />
            </div>

            {tab === "Blogs" && (
              <Link
                href="/super-admin/site-content/blogs/new"
                className="flex cursor-pointer items-center gap-2 whitespace-nowrap rounded-full bg-[#F7931E] px-5 py-2.5 text-sm font-semibold text-white transition-opacity hover:opacity-90"
              >
                <Plus className="h-4 w-4" strokeWidth={2.5} />
                Add Blogs
              </Link>
            )}
            {tab === "Banners" && (
              <Link
                href="/super-admin/site-content/banners/new"
                className="flex cursor-pointer items-center gap-2 whitespace-nowrap rounded-full bg-[#F7931E] px-5 py-2.5 text-sm font-semibold text-white transition-opacity hover:opacity-90"
              >
                <Plus className="h-4 w-4" strokeWidth={2.5} />
                Add Banner
              </Link>
            )}
          </div>
        </div>

        {tab === "Blogs" && (
          <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-[1.4fr_1fr]">
            {featured && (
              <div
                className="relative flex min-h-[520px] flex-col justify-end overflow-hidden rounded-[32px] p-8"
                style={{ backgroundImage: featured.gradient }}
              >
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                <div className="relative flex items-center gap-2">
                  <span className="rounded-full bg-black/40 px-3 py-1 text-xs font-semibold text-white backdrop-blur-sm">
                    In Focus
                  </span>
                  <span className="rounded-full bg-black/40 px-3 py-1 text-xs font-semibold text-white backdrop-blur-sm">
                    Just Published
                  </span>
                </div>
                <h2 className="relative mt-4 text-3xl font-bold leading-tight text-white">{featured.title}</h2>
                <p className="relative mt-3 max-w-[520px] text-sm leading-relaxed text-white/80">
                  {featured.description}
                </p>
                <div className="relative mt-6 flex items-center justify-between border-t border-white/20 pt-5">
                  <span className="flex items-center gap-1.5 text-sm text-white/80">
                    <Eye className="h-4 w-4" strokeWidth={2} />
                    {featured.views}
                  </span>
                  <Link
                    href={`/super-admin/site-content/blogs/${featured.id}`}
                    className="cursor-pointer rounded-full bg-[#F7931E] px-6 py-2.5 text-sm font-bold text-white transition-opacity hover:opacity-90"
                  >
                    Edit Post
                  </Link>
                </div>
              </div>
            )}

            <div>
              <h3 className="text-xl font-bold text-black">Blogs</h3>
              <div className="mt-4 flex flex-col gap-3">
                {filteredBlogs.map((blog) => (
                  <Link
                    key={blog.id}
                    href={`/super-admin/site-content/blogs/${blog.id}`}
                    className="flex cursor-pointer items-center gap-3 rounded-2xl border-2 border-black/[0.04] bg-white p-3 transition-colors hover:border-[#F7931E]/30"
                  >
                    <div
                      className="h-14 w-14 shrink-0 rounded-xl"
                      style={{ backgroundImage: blog.gradient }}
                    />
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

              <Link
                href="/super-admin/site-content/blogs"
                className="mt-3 flex w-full cursor-pointer items-center justify-center gap-2 rounded-full border border-[#E5E7EB] bg-white py-3 text-sm font-semibold text-[#374151] transition-colors hover:bg-[#F9FAFB]"
              >
                View All Blogs
                <ChevronRight className="h-4 w-4" strokeWidth={2} />
              </Link>
            </div>
          </div>
        )}

        {tab === "Banners" && (
          <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-[1.6fr_1fr]">
            <div className="flex flex-col gap-4">
              {filteredBanners.map((banner) => (
                <div key={banner.id} className="flex items-center gap-4 rounded-[28px] border-2 border-black/[0.04] bg-white p-4">
                  <div className="relative h-20 w-28 shrink-0 overflow-hidden rounded-2xl" style={{ backgroundImage: banner.gradient }}>
                    <span
                      className={`absolute left-2 top-2 rounded-full px-2 py-0.5 text-[9px] font-bold uppercase ${
                        banner.status === "Live" ? "bg-[#22C55E] text-white" : "bg-black/50 text-white"
                      }`}
                    >
                      {banner.status === "Live" ? "● Live" : "Scheduled"}
                    </span>
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-base font-bold text-black">{banner.name}</p>
                    <p className="mt-0.5 text-sm text-[#9CA3AF]">
                      Placement: {banner.placement} • <span className="text-[#F7931E]">{banner.dateLabel}</span>
                    </p>
                    <div className="mt-3 flex items-center gap-3">
                      <span className="cursor-pointer rounded-lg bg-[#F7931E] px-5 py-1.5 text-xs font-bold text-white">
                        Preview
                      </span>
                      <span className="cursor-pointer text-xs font-semibold text-[#EF4444]">Delete</span>
                    </div>
                  </div>
                  <div className="shrink-0 text-right">
                    <p className="text-[10px] font-semibold uppercase tracking-wide text-[#9CA3AF]">Clicks</p>
                    <p className="text-lg font-bold text-black">{banner.clicks}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="rounded-[28px] border-2 border-black/[0.04] bg-white p-5">
              <h3 className="text-lg font-bold text-black">Upcoming Events &amp; Holidays</h3>
              <p className="mt-0.5 text-xs text-[#9CA3AF]">Plan Your Design Requests.</p>

              <div className="mt-4 flex flex-col divide-y divide-[#F3F4F6]">
                {UPCOMING_EVENTS.map((event) => (
                  <div key={event.title} className="flex cursor-pointer items-center gap-3 py-3">
                    <div className="flex h-12 w-12 shrink-0 flex-col items-center justify-center rounded-xl bg-[#F9FAFB]">
                      <span className="text-[9px] font-bold uppercase text-[#9CA3AF]">{event.month}</span>
                      <span className="text-sm font-bold text-black">{event.day}</span>
                    </div>
                    <p className="flex-1 text-sm font-semibold text-black">{event.title}</p>
                    <ChevronRight className="h-4 w-4 text-[#9CA3AF]" strokeWidth={2} />
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {tab === "Drafts" && (
          <div className="mt-6 overflow-hidden rounded-[32px] border-2 border-black/[0.04] bg-white">
            <div className="overflow-x-auto">
              <table className="w-full min-w-[820px]">
                <thead>
                  <tr className="border-b border-[#F3F4F6] text-left text-xs font-semibold uppercase tracking-wide text-[#6B7280]">
                    <th className="px-6 py-4">Blog Title</th>
                    <th className="px-4 py-4">Type</th>
                    <th className="px-4 py-4">Author</th>
                    <th className="px-4 py-4">Last Modified</th>
                    <th className="px-4 py-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredDrafts.map((draft) => (
                    <tr key={draft.id} className="border-b border-[#F3F4F6] last:border-none">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="h-12 w-12 shrink-0 rounded-xl" style={{ backgroundImage: draft.gradient }} />
                          <div className="min-w-0">
                            <p className="truncate text-sm font-semibold text-black">{draft.title}</p>
                            <p className="truncate text-xs text-[#9CA3AF]">{draft.description}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-4">
                        <span className="inline-flex rounded-full bg-[#F3F4F6] px-2.5 py-1 text-[10px] font-bold text-[#6B7280]">
                          {draft.type}
                        </span>
                      </td>
                      <td className="px-4 py-4 text-sm text-black">{draft.author}</td>
                      <td className="px-4 py-4">
                        <p className="text-sm text-black">{draft.lastModifiedDate}</p>
                        <p className="text-xs text-[#9CA3AF]">{draft.lastModifiedTime}</p>
                      </td>
                      <td className="px-4 py-4 text-right">
                        <Link
                          href={
                            draft.type === "BLOG"
                              ? `/super-admin/site-content/blogs/${draft.id}`
                              : `/super-admin/site-content/banners/new`
                          }
                          className="inline-flex cursor-pointer items-center gap-1.5 whitespace-nowrap rounded-full border border-[#F7931E] px-4 py-1.5 text-xs font-semibold text-[#F7931E] transition-colors hover:bg-[#FEF3E2]"
                        >
                          Edit
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
