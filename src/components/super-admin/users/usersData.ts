export type Hub = {
  id: string;
  name: string;
  status: "Active" | "Inactive";
  address: string;
  stockCapacityPercent: number;
  dailyOrderVolume: string;
  highlyOrdered: string;
  ordersDispatchedToday: number;
  totalInventoryVolumeKg: number;
  ordersYetToPack: number;
  lowStockItem: string;
  facilityAddress: string;
};

export type Admin = {
  id: string;
  name: string;
  role: string;
  email: string;
  phone: string;
  hubId: string;
  status: "Active" | "Suspended";
};

export type Customer = {
  id: string;
  name: string;
  location: string;
  orders: number;
  lifetimeValue: number;
  joinedOn: string;
  email: string;
  phone: string;
  address: string;
  recentOrders: { txn: string; date: string; amount: number; status: string }[];
};

export const INITIAL_HUBS: Hub[] = [
  {
    id: "hub-1",
    name: "Kukatpally Distribution Warehouse",
    status: "Active",
    address: "Phase 3, Kukatpally Industrial Estate",
    stockCapacityPercent: 84,
    dailyOrderVolume: "1.2K units",
    highlyOrdered: "Dudeshwar",
    ordersDispatchedToday: 124,
    totalInventoryVolumeKg: 1450,
    ordersYetToPack: 34,
    lowStockItem: "Black Burma",
    facilityAddress: "Plot 12, Phase 3, Kukatpally Industrial Estate, Hyderabad, Telangana 500072",
  },
  {
    id: "hub-2",
    name: "Gachibowli Distribution Warehouse",
    status: "Active",
    address: "Financial District, Nanakramguda",
    stockCapacityPercent: 96,
    dailyOrderVolume: "1.5K units",
    highlyOrdered: "Black Burma",
    ordersDispatchedToday: 168,
    totalInventoryVolumeKg: 1890,
    ordersYetToPack: 41,
    lowStockItem: "Rakthashali",
    facilityAddress: "Survey No. 83, Financial District, Nanakramguda, Hyderabad, Telangana 500032",
  },
  {
    id: "hub-3",
    name: "Secunderabad Distribution Warehouse",
    status: "Active",
    address: "Habsiguda, Secunderabad",
    stockCapacityPercent: 62,
    dailyOrderVolume: "980 units",
    highlyOrdered: "Navara Rice",
    ordersDispatchedToday: 96,
    totalInventoryVolumeKg: 1120,
    ordersYetToPack: 22,
    lowStockItem: "Kaattu Rice",
    facilityAddress: "Road No. 3, Habsiguda, Secunderabad, Telangana 500007",
  },
  {
    id: "hub-4",
    name: "Whitefield Distribution Warehouse",
    status: "Active",
    address: "ITPL Road, Whitefield",
    stockCapacityPercent: 71,
    dailyOrderVolume: "1.1K units",
    highlyOrdered: "Sona Masoori",
    ordersDispatchedToday: 110,
    totalInventoryVolumeKg: 1340,
    ordersYetToPack: 29,
    lowStockItem: "Seeraga Samba",
    facilityAddress: "ITPL Main Road, Whitefield, Bengaluru, Karnataka 560066",
  },
  {
    id: "hub-5",
    name: "HSR Layout Distribution Warehouse",
    status: "Active",
    address: "Sector 2, HSR Layout",
    stockCapacityPercent: 45,
    dailyOrderVolume: "740 units",
    highlyOrdered: "Poongar Rice",
    ordersDispatchedToday: 68,
    totalInventoryVolumeKg: 860,
    ordersYetToPack: 15,
    lowStockItem: "Indrani Rice",
    facilityAddress: "27th Main, Sector 2, HSR Layout, Bengaluru, Karnataka 560102",
  },
  {
    id: "hub-6",
    name: "Indiranagar Distribution Warehouse",
    status: "Inactive",
    address: "100 Feet Road, Indiranagar",
    stockCapacityPercent: 20,
    dailyOrderVolume: "310 units",
    highlyOrdered: "Kaattu Rice",
    ordersDispatchedToday: 0,
    totalInventoryVolumeKg: 240,
    ordersYetToPack: 0,
    lowStockItem: "—",
    facilityAddress: "100 Feet Road, Indiranagar, Bengaluru, Karnataka 560038",
  },
];

export const INITIAL_ADMINS: Admin[] = [
  { id: "adm-1", name: "Suresh Kumar", role: "Warehouse Admin", email: "suresh.k@vedabharath.com", phone: "+91 91919 19991", hubId: "hub-1", status: "Active" },
  { id: "adm-2", name: "Anjali Sharma", role: "Warehouse Admin", email: "anjali.s@vedabharath.com", phone: "+91 91234 56780", hubId: "hub-1", status: "Active" },
  { id: "adm-3", name: "Ramesh Babu", role: "Warehouse Admin", email: "ramesh.b@vedabharath.com", phone: "+91 90123 45671", hubId: "hub-2", status: "Active" },
  { id: "adm-4", name: "Divya Krishnan", role: "Warehouse Admin", email: "divya.k@vedabharath.com", phone: "+91 99887 76652", hubId: "hub-2", status: "Active" },
  { id: "adm-5", name: "Karthik Iyer", role: "Warehouse Admin", email: "karthik.i@vedabharath.com", phone: "+91 93012 34563", hubId: "hub-3", status: "Active" },
  { id: "adm-6", name: "Priya Reddy", role: "Warehouse Admin", email: "priya.r@vedabharath.com", phone: "+91 98701 23454", hubId: "hub-4", status: "Active" },
  { id: "adm-7", name: "Meera Nair", role: "Warehouse Admin", email: "meera.n@vedabharath.com", phone: "+91 90123 45695", hubId: "hub-4", status: "Active" },
  { id: "adm-8", name: "Arjun Nair", role: "Warehouse Admin", email: "arjun.n@vedabharath.com", phone: "+91 90123 45696", hubId: "hub-5", status: "Active" },
];

export const CUSTOMERS: Customer[] = [
  {
    id: "CUST-8842",
    name: "Meera Nair",
    location: "Hyderabad, TS",
    orders: 24,
    lifetimeValue: 42500,
    joinedOn: "Jan 23, 2025",
    email: "meera.nair@email.com",
    phone: "+91 98450 12345",
    address: "Jubilee Hills, Road No. 36, Hyderabad, Telangana - 500033",
    recentOrders: [
      { txn: "TXN-99842", date: "Aug 15, 2024", amount: 2450, status: "Delivered" },
      { txn: "TXN-99710", date: "Aug 02, 2024", amount: 1800, status: "Delivered" },
      { txn: "TXN-99505", date: "Jul 18, 2024", amount: 4120, status: "Delivered" },
      { txn: "TXN-99312", date: "Jun 30, 2024", amount: 950, status: "Delivered" },
    ],
  },
  {
    id: "CUST-7721",
    name: "Rahul Sharma",
    location: "Bangalore, KA",
    orders: 18,
    lifetimeValue: 31200,
    joinedOn: "Mar 10, 2025",
    email: "rahul.sharma@email.com",
    phone: "+91 76543 21098",
    address: "HSR Layout, Sector 2, Bengaluru, Karnataka - 560102",
    recentOrders: [
      { txn: "TXN-98120", date: "Aug 10, 2024", amount: 1820, status: "Delivered" },
      { txn: "TXN-97903", date: "Jul 22, 2024", amount: 2600, status: "Delivered" },
      { txn: "TXN-97650", date: "Jul 04, 2024", amount: 780, status: "Delivered" },
    ],
  },
  {
    id: "CUST-9901",
    name: "Priya Verma",
    location: "Bangalore, KA",
    orders: 9,
    lifetimeValue: 12800,
    joinedOn: "Jan 21, 2025",
    email: "priya.verma@email.com",
    phone: "+91 91234 56789",
    address: "Koramangala 5th Block, Bengaluru, Karnataka - 560095",
    recentOrders: [
      { txn: "TXN-96540", date: "Jun 28, 2024", amount: 950, status: "Delivered" },
      { txn: "TXN-96201", date: "Jun 05, 2024", amount: 1400, status: "Delivered" },
    ],
  },
  {
    id: "CUST-8560",
    name: "Karthik Suraj",
    location: "Bangalore, KA",
    orders: 31,
    lifetimeValue: 58900,
    joinedOn: "Sep 14, 2024",
    email: "karthik.suraj@email.com",
    phone: "+91 87654 32109",
    address: "Whitefield, Block C, Bengaluru, Karnataka - 560066",
    recentOrders: [
      { txn: "TXN-99900", date: "Aug 18, 2024", amount: 2450, status: "Delivered" },
      { txn: "TXN-99801", date: "Aug 11, 2024", amount: 1200, status: "Exception" },
    ],
  },
];
