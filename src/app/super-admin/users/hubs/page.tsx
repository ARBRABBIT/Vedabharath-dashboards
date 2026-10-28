"use client";

import {
  Building2,
  Check,
  ChevronDown,
  Filter,
  LayoutGrid,
  List,
  MapPin,
  Plus,
  Search,
  Sparkles,
  TrendingUp,
  Users,
} from "lucide-react";
import Link from "next/link";
import { useMemo, useState } from "react";
import { SuperAdminNavbar } from "@/components/dashboard/SuperAdminNavbar";
import { AdminDetailModal } from "@/components/super-admin/users/AdminDetailModal";
import { CreateHubModal, type HubFormData } from "@/components/super-admin/users/CreateHubModal";
import { HubDetailModal } from "@/components/super-admin/users/HubDetailModal";
import {
  INITIAL_ADMINS,
  INITIAL_HUBS,
  type Admin,
  type Hub,
} from "@/components/super-admin/users/usersData";
import { PageHeader } from "@/components/super-admin/ui/PageHeader";

type ViewMode = "table" | "grid";

export default function HighPerformingHubsPage() {
  const [hubs, setHubs] = useState<Hub[]>(INITIAL_HUBS);
  const [admins, setAdmins] = useState<Admin[]>(INITIAL_ADMINS);
  const [search, setSearch] = useState("");
  const [viewMode, setViewMode] = useState<ViewMode>("table");

  // Modals
  const [createHubOpen, setCreateHubOpen] = useState(false);
  const [viewingHub, setViewingHub] = useState<Hub | null>(null);
  const [viewingAdmin, setViewingAdmin] = useState<Admin | null>(null);

  // Sorted hubs by stock capacity / performance descending
  const sortedHubs = useMemo(() => {
    return [...hubs].sort((a, b) => b.stockCapacityPercent - a.stockCapacityPercent);
  }, [hubs]);

  const filteredHubs = useMemo(() => {
    return sortedHubs.filter((hub) => {
      const matchesSearch =
        !search ||
        hub.name.toLowerCase().includes(search.toLowerCase()) ||
        hub.address.toLowerCase().includes(search.toLowerCase()) ||
        hub.highlyOrdered.toLowerCase().includes(search.toLowerCase());
      return matchesSearch;
    });
  }, [sortedHubs, search]);

  const topHub = sortedHubs[0];

  function handleCreateHub(data: HubFormData) {
    const newHubId = `hub-${hubs.length + 1}-${Date.now()}`;
    const newHub: Hub = {
      id: newHubId,
      name: data.name,
      status: "Active",
      address: data.zone,
      stockCapacityPercent: 75,
      dailyOrderVolume: "850 units",
      highlyOrdered: "Sona Masoori",
      ordersDispatchedToday: 45,
      totalInventoryVolumeKg: 950,
      ordersYetToPack: 12,
      lowStockItem: "—",
      facilityAddress: data.address,
    };
    setHubs((prev) => [newHub, ...prev]);
  }

  return (
    <div className="flex min-h-screen w-full flex-col bg-[#F5F5F7]">
      <SuperAdminNavbar />

      <main className="flex-1 px-6 pb-12 pt-6 sm:px-10 lg:px-16">
        <PageHeader
          title="Distribution Warehouses"
          subtitle="Performance, capacity, and active workforce across all regional distribution centers."
          backHref="/super-admin/users"
          right={
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => setCreateHubOpen(true)}
                className="flex cursor-pointer items-center gap-2 whitespace-nowrap rounded-full bg-[#F7931E] px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition-opacity hover:opacity-90"
              >
                <Plus className="h-4 w-4" strokeWidth={2.5} />
                Create New Warehouse
              </button>
            </div>
          }
        />

        {/* Top 4 Performance Summary Cards */}
        <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <div className="flex flex-col justify-between rounded-[28px] border-2 border-black/[0.04] bg-white p-5">
            <p className="text-xs font-medium uppercase tracking-wide text-[#9CA3AF]">Total Warehouses</p>
            <div>
              <p className="mt-1.5 text-3xl font-bold text-black">{hubs.length + 18}</p>
              <p className="mt-0.5 text-xs text-[#6B7280]">Regional distribution centers</p>
            </div>
          </div>

          <div className="flex flex-col justify-between rounded-[28px] border-2 border-black/[0.04] bg-white p-5">
            <div className="flex items-center justify-between">
              <p className="text-xs font-medium uppercase tracking-wide text-[#9CA3AF]">Top Performer</p>
              <span className="flex items-center gap-1 text-[11px] font-bold text-[#F7931E]">
                <Sparkles className="h-3 w-3" /> #1 Rank
              </span>
            </div>
            <div>
              <p className="mt-1.5 truncate text-2xl font-bold text-black">
                {topHub?.name.replace(" Distribution Warehouse", "").replace(" Distribution Hub", "")}
              </p>
              <p className="mt-0.5 text-xs text-[#6B7280]">
                {topHub?.stockCapacityPercent}% Stock Capacity
              </p>
            </div>
          </div>

          <div className="flex flex-col justify-between rounded-[28px] border-2 border-black/[0.04] bg-white p-5">
            <p className="text-xs font-medium uppercase tracking-wide text-[#9CA3AF]">Avg Order Volume</p>
            <div>
              <p className="mt-1.5 text-3xl font-bold text-black">1.1K</p>
              <p className="mt-0.5 text-xs text-[#6B7280]">Units dispatched / day</p>
            </div>
          </div>

          <div className="flex flex-col justify-between rounded-[28px] border-2 border-black/[0.04] bg-white p-5">
            <p className="text-xs font-medium uppercase tracking-wide text-[#9CA3AF]">Total Admin Workforce</p>
            <div>
              <p className="mt-1.5 text-3xl font-bold text-black">{admins.length + 130}</p>
              <p className="mt-0.5 text-xs text-[#6B7280]">Across regional warehouses</p>
            </div>
          </div>
        </div>

        {/* Filter and View Controls Bar */}
        <div className="mt-8 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            {/* Search */}
            <div className="relative">
              <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-[#9CA3AF]" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search warehouses, location, or crop..."
                className="w-[300px] rounded-full border border-[#E5E7EB] bg-white py-2.5 pl-10 pr-4 text-sm outline-none placeholder:text-[#9CA3AF] focus:border-[#F7931E]"
              />
            </div>
          </div>

          {/* View Mode Toggle */}
          <div className="flex items-center gap-1 rounded-full border border-[#E5E7EB] bg-white p-1">
            <button
              type="button"
              onClick={() => setViewMode("table")}
              title="Table view"
              className={`flex h-8 w-8 cursor-pointer items-center justify-center rounded-full transition-colors ${
                viewMode === "table" ? "bg-[#F7931E] text-white" : "text-[#6B7280] hover:text-black"
              }`}
            >
              <List className="h-4 w-4" />
            </button>
            <button
              type="button"
              onClick={() => setViewMode("grid")}
              title="Grid card view"
              className={`flex h-8 w-8 cursor-pointer items-center justify-center rounded-full transition-colors ${
                viewMode === "grid" ? "bg-[#F7931E] text-white" : "text-[#6B7280] hover:text-black"
              }`}
            >
              <LayoutGrid className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* Hubs Content: Table or Grid */}
        {viewMode === "table" ? (
          <div className="mt-4 overflow-hidden rounded-[32px] border-2 border-black/[0.04] bg-white shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full min-w-[920px]">
                <thead>
                  <tr className="border-b border-[#F3F4F6] text-left text-xs font-semibold uppercase tracking-wide text-[#6B7280]">
                    <th className="px-6 py-4">Rank</th>
                    <th className="px-4 py-4">Warehouse Name & Location</th>
                    <th className="px-4 py-4">Stock Capacity</th>
                    <th className="px-4 py-4">Highly Ordered</th>
                    <th className="px-4 py-4">Admins</th>
                    <th className="px-6 py-4 text-right">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredHubs.length === 0 && (
                    <tr>
                      <td colSpan={6} className="px-6 py-12 text-center text-sm text-[#9CA3AF]">
                        No distribution warehouses match your search.
                      </td>
                    </tr>
                  )}
                  {filteredHubs.map((hub, index) => {
                    const hubAdmins = admins.filter(
                      (admin) => admin.hubId === hub.id && admin.status === "Active"
                    );
                    const rank = index + 1;

                    return (
                      <tr
                        key={hub.id}
                        className="border-b border-[#F3F4F6] transition-colors last:border-none hover:bg-[#F9FAFB]"
                      >
                        {/* Rank Badge */}
                        <td className="px-6 py-4">
                          <span
                            className={`flex h-7 w-7 items-center justify-center rounded-full text-xs font-bold ${
                              rank === 1
                                ? "bg-[#FEF3E2] text-[#F7931E]"
                                : rank === 2
                                  ? "bg-[#F3F4F6] text-[#374151]"
                                  : rank === 3
                                    ? "bg-[#FEF2F2] text-[#DC2626]"
                                    : "text-[#9CA3AF]"
                            }`}
                          >
                            {String(rank).padStart(2, "0")}
                          </span>
                        </td>

                        {/* Hub Name & Address */}
                        <td className="px-4 py-4">
                          <div className="flex items-center gap-3">
                            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#EFF6E9] text-[#006E1F]">
                              <Building2 className="h-5 w-5" strokeWidth={2} />
                            </div>
                            <div className="min-w-0">
                              <p className="truncate text-sm font-bold text-black">{hub.name}</p>
                              <p className="flex items-center gap-1 truncate text-xs text-[#6B7280]">
                                <MapPin className="h-3 w-3 shrink-0 text-[#9CA3AF]" />
                                {hub.address}
                              </p>
                            </div>
                          </div>
                        </td>

                        {/* Stock Capacity Progress */}
                        <td className="px-4 py-4">
                          <div className="flex items-center gap-2">
                            <div className="h-2 w-20 overflow-hidden rounded-full bg-[#E5E7EB]">
                              <div
                                className={`h-full rounded-full ${
                                  hub.stockCapacityPercent > 80
                                    ? "bg-[#EF4444]"
                                    : hub.stockCapacityPercent > 50
                                      ? "bg-[#F7931E]"
                                      : "bg-[#22C55E]"
                                }`}
                                style={{ width: `${hub.stockCapacityPercent}%` }}
                              />
                            </div>
                            <span className="text-xs font-bold text-black">
                              {hub.stockCapacityPercent}%
                            </span>
                          </div>
                        </td>

                        {/* Highly Ordered */}
                        <td className="px-4 py-4 text-sm font-medium text-[#006E1F]">
                          {hub.highlyOrdered}
                        </td>

                        {/* Admins */}
                        <td className="px-4 py-4">
                          <div className="flex items-center gap-2">
                            <div className="flex -space-x-1.5 overflow-hidden">
                              <span className="inline-block h-6 w-6 rounded-full border-2 border-white bg-[#D5DCCF]" />
                              <span className="inline-block h-6 w-6 rounded-full border-2 border-white bg-[#83FC87]" />
                            </div>
                            <span className="text-xs font-medium text-[#374151]">
                              {hubAdmins.length} Admins
                            </span>
                          </div>
                        </td>

                        {/* Action */}
                        <td className="px-6 py-4 text-right">
                          <button
                            type="button"
                            onClick={() => setViewingHub(hub)}
                            className="cursor-pointer whitespace-nowrap rounded-lg border border-[#E5E7EB] px-3.5 py-1.5 text-xs font-semibold text-[#374151] transition-colors hover:border-[#F7931E] hover:text-[#F7931E]"
                          >
                            View Details
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        ) : (
          /* Grid View */
          <div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
            {filteredHubs.map((hub, index) => {
              const hubAdmins = admins.filter(
                (admin) => admin.hubId === hub.id && admin.status === "Active"
              );
              const rank = index + 1;

              return (
                <div
                  key={hub.id}
                  className="flex flex-col justify-between rounded-3xl border border-white bg-white p-6 shadow-[0px_4px_24px_rgba(0,0,0,0.04)]"
                >
                  <div>
                    {/* Card Header */}
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-center gap-2.5">
                        <span
                          className={`flex h-7 w-7 items-center justify-center rounded-full text-xs font-bold ${
                            rank === 1
                              ? "bg-[#FEF3E2] text-[#F7931E]"
                              : rank === 2
                                ? "bg-[#F3F4F6] text-[#374151]"
                                : rank === 3
                                  ? "bg-[#FEF2F2] text-[#DC2626]"
                                  : "text-[#9CA3AF]"
                          }`}
                        >
                          #{rank}
                        </span>
                        <div>
                          <h3 className="text-base font-bold text-[#1D1D1F]">{hub.name}</h3>
                          <p className="flex items-center gap-1 text-xs text-[#6B7280]">
                            <MapPin className="h-3 w-3 shrink-0 text-[#9CA3AF]" />
                            {hub.address}
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Stats mini grid */}
                    <div className="mt-5 grid grid-cols-2 gap-3">
                      <div className="rounded-xl bg-[#F9FAFB] p-2.5 text-center">
                        <p className="text-[10px] font-bold uppercase tracking-wide text-[#86868B]">
                          Capacity
                        </p>
                        <p className="mt-1 text-sm font-bold text-black">
                          {hub.stockCapacityPercent}%
                        </p>
                      </div>
                      <div className="rounded-xl bg-[#F9FAFB] p-2.5 text-center">
                        <p className="text-[10px] font-bold uppercase tracking-wide text-[#86868B]">
                          Top Item
                        </p>
                        <p className="mt-1 truncate text-xs font-bold text-[#006E1F]">
                          {hub.highlyOrdered}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Card Footer */}
                  <div className="mt-5 flex items-center justify-between border-t border-[#F0F0F0] pt-4">
                    <span className="text-xs font-medium text-[#6B7280]">
                      {hubAdmins.length} Active Admins
                    </span>
                    <button
                      type="button"
                      onClick={() => setViewingHub(hub)}
                      className="cursor-pointer text-xs font-bold text-[#F7931E] transition-colors hover:underline"
                    >
                      View Warehouse Details →
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </main>

      {/* Modals */}
      <CreateHubModal
        open={createHubOpen}
        onClose={() => setCreateHubOpen(false)}
        admins={admins}
        onSave={handleCreateHub}
      />

      <HubDetailModal
        hub={viewingHub}
        admins={admins.filter((admin) => admin.hubId === viewingHub?.id)}
        open={viewingHub !== null}
        onClose={() => setViewingHub(null)}
        onSelectAdmin={(admin) => setViewingAdmin(admin)}
      />

      <AdminDetailModal
        admin={viewingAdmin}
        hub={hubs.find((h) => h.id === viewingAdmin?.hubId) ?? null}
        hubs={hubs}
        allAdmins={admins}
        open={viewingAdmin !== null}
        onClose={() => setViewingAdmin(null)}
        onSuspend={(adminId) => {
          setAdmins((prev) =>
            prev.map((a) => (a.id === adminId ? { ...a, status: "Suspended" } : a))
          );
        }}
        onReassign={(adminId, newHubId) => {
          setAdmins((prev) =>
            prev.map((a) => (a.id === adminId ? { ...a, hubId: newHubId } : a))
          );
        }}
      />
    </div>
  );
}
