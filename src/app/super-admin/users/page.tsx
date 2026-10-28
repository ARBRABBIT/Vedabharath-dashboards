"use client";

import { Building2, Search, UserPlus } from "lucide-react";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { SuperAdminNavbar } from "@/components/dashboard/SuperAdminNavbar";
import { AdminDetailModal } from "@/components/super-admin/users/AdminDetailModal";
import { CreateAdminModal } from "@/components/super-admin/users/CreateAdminModal";
import { CreateHubModal, type HubFormData } from "@/components/super-admin/users/CreateHubModal";
import { CustomerDetailModal } from "@/components/super-admin/users/CustomerDetailModal";
import { HubDetailModal } from "@/components/super-admin/users/HubDetailModal";
import {
  CUSTOMERS,
  INITIAL_ADMINS,
  INITIAL_HUBS,
  type Admin,
  type Customer,
  type Hub,
} from "@/components/super-admin/users/usersData";

function initials(name: string) {
  return name
    .split(" ")
    .map((part) => part[0])
    .join("")
    .toUpperCase();
}

export default function UserManagementPage() {
  const [hubs, setHubs] = useState(INITIAL_HUBS);
  const [admins, setAdmins] = useState(INITIAL_ADMINS);
  const [customerSearch, setCustomerSearch] = useState("");

  const [createHubOpen, setCreateHubOpen] = useState(false);
  const [createAdminOpen, setCreateAdminOpen] = useState(false);
  const [editingHub, setEditingHub] = useState<Hub | null>(null);
  const [viewingHub, setViewingHub] = useState<Hub | null>(null);
  const [viewingAdmin, setViewingAdmin] = useState<Admin | null>(null);
  const [viewingCustomer, setViewingCustomer] = useState<Customer | null>(null);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get("action") === "create-admin") {
      setCreateAdminOpen(true);
      window.history.replaceState(null, "", "/super-admin/users");
    }
  }, []);

  const filteredCustomers = useMemo(() => {
    return CUSTOMERS.filter((customer) => customer.name.toLowerCase().includes(customerSearch.toLowerCase()));
  }, [customerSearch]);

  function handleCreateHub(data: HubFormData) {
    const newHubId = `hub-${hubs.length + 1}-${Date.now()}`;
    setHubs((prev) => [
      {
        id: newHubId,
        name: data.name,
        status: "Active",
        address: data.zone,
        stockCapacityPercent: 0,
        dailyOrderVolume: "0 units",
        highlyOrdered: "—",
        ordersDispatchedToday: 0,
        totalInventoryVolumeKg: 0,
        ordersYetToPack: 0,
        lowStockItem: "—",
        facilityAddress: data.address,
      },
      ...prev,
    ]);
    if (data.adminId) {
      setAdmins((prev) => prev.map((admin) => (admin.id === data.adminId ? { ...admin, hubId: newHubId } : admin)));
    }
  }

  function handleEditHub(data: HubFormData) {
    if (!editingHub) return;
    setHubs((prev) =>
      prev.map((hub) =>
        hub.id === editingHub.id ? { ...hub, name: data.name, address: data.zone, facilityAddress: data.address } : hub,
      ),
    );
    if (data.adminId) {
      const hubId = editingHub.id;
      setAdmins((prev) =>
        prev.map((admin) => {
          if (admin.id === data.adminId) return { ...admin, hubId };
          if (admin.hubId === hubId && admin.id !== data.adminId) return { ...admin, hubId: "" };
          return admin;
        }),
      );
    }
  }

  function handleCreateAdmin(data: { name: string; email: string; hubId: string }) {
    setAdmins((prev) => [
      ...prev,
      { id: `adm-${prev.length + 1}`, name: data.name, role: "Warehouse Admin", email: data.email, phone: "+91 90000 00000", hubId: data.hubId, status: "Active" },
    ]);
  }

  function handleSuspendAdmin(adminId: string) {
    setAdmins((prev) =>
      prev.map((admin) =>
        admin.id === adminId ? { ...admin, status: admin.status === "Active" ? "Suspended" : "Active" } : admin,
      ),
    );
    setViewingAdmin((prev) =>
      prev && prev.id === adminId ? { ...prev, status: prev.status === "Active" ? "Suspended" : "Active" } : prev,
    );
  }

  function handleReassignAdmin(adminId: string, newHubId: string) {
    setAdmins((prev) => prev.map((admin) => (admin.id === adminId ? { ...admin, hubId: newHubId } : admin)));
  }

  const totalActiveAdmins = admins.filter((admin) => admin.status === "Active").length;
  const topHub = [...hubs].sort((a, b) => b.stockCapacityPercent - a.stockCapacityPercent)[0];

  return (
    <div className="flex min-h-screen w-full flex-col bg-[#F5F5F7]">
      <SuperAdminNavbar />

      <main className="flex-1 px-6 pb-10 pt-6 sm:px-10 lg:px-16">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <h1 className="text-[28px] font-bold text-black">User Management</h1>
            <p className="mt-1 text-sm text-[#6B7280]">Manage regional distribution centers and assigned personnel.</p>
          </div>
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setCreateHubOpen(true)}
              className="flex cursor-pointer items-center gap-2 whitespace-nowrap rounded-full border border-[#E5E7EB] bg-white px-5 py-2.5 text-sm font-semibold text-[#374151] transition-colors hover:bg-[#F9FAFB]"
            >
              <Building2 className="h-4 w-4 text-[#6B7280]" strokeWidth={2} />
              Create New Warehouse
            </button>
            <button
              type="button"
              onClick={() => setCreateAdminOpen(true)}
              className="flex cursor-pointer items-center gap-2 whitespace-nowrap rounded-full border border-[#E5E7EB] bg-white px-5 py-2.5 text-sm font-semibold text-[#374151] transition-colors hover:bg-[#F9FAFB]"
            >
              <UserPlus className="h-4 w-4 text-[#6B7280]" strokeWidth={2} />
              Create Admin
            </button>
          </div>
        </div>

        <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <div className="flex flex-col justify-between rounded-[28px] border-2 border-black/[0.04] bg-white p-5">
            <p className="text-xs font-medium uppercase tracking-wide text-[#9CA3AF]">Total Warehouses</p>
            <div>
              <p className="mt-1.5 text-3xl font-bold text-black">{hubs.length + 18}</p>
            </div>
          </div>
          <div className="flex flex-col justify-between rounded-[28px] border-2 border-black/[0.04] bg-white p-5">
            <p className="text-xs font-medium uppercase tracking-wide text-[#9CA3AF]">Total Admin Workforce</p>
            <div>
              <p className="mt-1.5 text-3xl font-bold text-black">{totalActiveAdmins + 134}</p>
            </div>
          </div>
          <div className="flex flex-col justify-between rounded-[28px] border-2 border-black/[0.04] bg-white p-5">
            <div className="flex items-center justify-between">
              <p className="text-xs font-medium uppercase tracking-wide text-[#9CA3AF]">High Performing Warehouse</p>
              <Link
                href="/super-admin/users/hubs"
                className="cursor-pointer text-xs font-semibold text-[#F7931E] hover:underline"
              >
                View All →
              </Link>
            </div>
            <div>
              <p className="mt-1.5 truncate text-2xl font-bold text-black">
                {topHub?.name.replace(" Distribution Hub", "")}
              </p>
              <p className="mt-0.5 text-xs text-[#9CA3AF]">Last 30 days</p>
            </div>
          </div>
          <Link
            href="/super-admin/users/orders"
            className="flex flex-col justify-between rounded-[28px] border-2 border-black/[0.04] bg-white p-5 transition-colors hover:border-[#F7931E]/30"
          >
            <div className="flex items-center justify-between">
              <p className="text-xs font-medium uppercase tracking-wide text-[#9CA3AF]">Total Orders</p>
              <span className="text-xs font-semibold text-[#F7931E]">View →</span>
            </div>
            <div>
              <p className="mt-1.5 text-3xl font-bold text-black">202298</p>
              <p className="mt-0.5 text-xs text-[#9CA3AF]">Last 30 days</p>
            </div>
          </Link>
        </div>

        <div className="mt-8 flex items-center justify-between">
          <p className="text-xs font-bold uppercase tracking-wide text-[#9CA3AF]">Customer Directory</p>
          <div className="relative">
            <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-[#9CA3AF]" />
            <input
              type="text"
              value={customerSearch}
              onChange={(event) => setCustomerSearch(event.target.value)}
              placeholder="Search customers..."
              className="w-[220px] rounded-full border border-[#E5E7EB] bg-white py-2.5 pl-11 pr-4 text-sm outline-none placeholder:text-[#9CA3AF] focus:border-[#F7931E]"
            />
          </div>
        </div>

        <div className="mt-3 overflow-hidden rounded-[32px] border-2 border-black/[0.04] bg-white">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[760px]">
              <thead>
                <tr className="border-b border-[#F3F4F6] text-left text-xs font-semibold uppercase tracking-wide text-[#6B7280]">
                  <th className="px-6 py-4">Customer</th>
                  <th className="px-4 py-4">Location</th>
                  <th className="px-4 py-4">Orders</th>
                  <th className="px-4 py-4">Lifetime Value</th>
                  <th className="px-4 py-4">Joined On</th>
                  <th className="px-4 py-4">Action</th>
                </tr>
              </thead>
              <tbody>
                {filteredCustomers.length === 0 && (
                  <tr>
                    <td colSpan={6} className="px-6 py-10 text-center text-sm text-[#9CA3AF]">
                      No customers found.
                    </td>
                  </tr>
                )}
                {filteredCustomers.map((customer) => (
                  <tr key={customer.id} className="border-b border-[#F3F4F6] last:border-none">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#EBF7EC] text-xs font-bold text-[#22C55E]">
                          {initials(customer.name)}
                        </div>
                        <div>
                          <p className="text-sm font-semibold text-black">{customer.name}</p>
                          <p className="text-xs text-[#9CA3AF]">{customer.id}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-4 text-sm text-black">{customer.location}</td>
                    <td className="px-4 py-4 text-sm text-black">{customer.orders} Orders</td>
                    <td className="px-4 py-4 text-sm font-semibold text-black">
                      ₹{customer.lifetimeValue.toLocaleString()}
                    </td>
                    <td className="px-4 py-4 text-sm text-black">{customer.joinedOn}</td>
                    <td className="px-4 py-4">
                      <button
                        type="button"
                        onClick={() => setViewingCustomer(customer)}
                        className="cursor-pointer whitespace-nowrap rounded-lg border border-[#E5E7EB] px-4 py-1.5 text-xs font-semibold text-[#374151] transition-colors hover:bg-[#F9FAFB]"
                      >
                        View Details
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </main>

      <CreateHubModal
        open={createHubOpen}
        onClose={() => setCreateHubOpen(false)}
        admins={admins}
        onSave={handleCreateHub}
      />
      <CreateHubModal
        open={editingHub !== null}
        onClose={() => setEditingHub(null)}
        initial={editingHub}
        admins={admins}
        onSave={handleEditHub}
      />
      <CreateAdminModal
        open={createAdminOpen}
        onClose={() => setCreateAdminOpen(false)}
        hubs={hubs}
        onCreate={handleCreateAdmin}
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
        hub={hubs.find((hub) => hub.id === viewingAdmin?.hubId) ?? null}
        hubs={hubs}
        allAdmins={admins}
        open={viewingAdmin !== null}
        onClose={() => setViewingAdmin(null)}
        onSuspend={handleSuspendAdmin}
        onReassign={handleReassignAdmin}
      />
      <CustomerDetailModal
        customer={viewingCustomer}
        open={viewingCustomer !== null}
        onClose={() => setViewingCustomer(null)}
      />
    </div>
  );
}
