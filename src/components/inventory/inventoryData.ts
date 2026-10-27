import type { PillTone } from "@/components/orders/modals/modalHelpers";

export type Batch = {
  id: string;
  farm: string;
  farmAddress: string;
  farmOwner: string;
  farmPhone: string;
  photo: string;
  inwardDate: string;
  preArrivalYears: number;
  warehouseAgingYears: number;
  ageYears: number;
  warehouse: string;
  rack: string;
  quantityKg: number;
  variety: string;
  moisturePercent: number;
  purityGrade: string;
};

export const VARIETIES = [
  "Dudeshwar",
  "Heritage Ponni",
  "Bahurupi",
  "Indrani",
  "Mysore Malliga",
  "Black Burma",
] as const;

export const WAREHOUSES = ["Kukatpally", "Nanakramkuda", "Madhapur"] as const;

export const PURITY_GRADES = ["A+", "A", "B+", "B"] as const;

const FARMS = [
  {
    name: "Kurnool Farm",
    address: "Plot 45, Kurnool Agricultural Zone, Andhra Pradesh 518002",
    owner: "Ramesh Babu",
    phone: "+91 98765 43210",
  },
  {
    name: "Nizamabad Farm",
    address: "Survey No. 12, Nizamabad Rural Mandal, Telangana 503001",
    owner: "Lakshmi Reddy",
    phone: "+91 91234 56780",
  },
  {
    name: "Warangal Farm",
    address: "Plot 8, Hanamkonda Agri Belt, Warangal, Telangana 506001",
    owner: "Srinivas Rao",
    phone: "+91 90123 45678",
  },
  {
    name: "Guntur Farm",
    address: "Plot 21, Guntur Delta Zone, Andhra Pradesh 522001",
    owner: "Venkata Naidu",
    phone: "+91 89765 43219",
  },
];

const FARM_PHOTO = "/Warehouse/dashboard-banner.png";

export function agingTone(years: number): PillTone {
  return years >= 1 ? "green" : "orange";
}

export function agingLabel(years: number) {
  return years >= 1 ? "Aged - Ready" : "Under Ageing";
}

export function dossierStatusLabel(years: number) {
  return years >= 1 ? "Ready for Dispatch" : "Maturing in Warehouse";
}

function makeBatch(
  index: number,
  variety: (typeof VARIETIES)[number],
  preArrivalYears: number,
  warehouseAgingYears: number,
  quantityKg: number,
): Batch {
  const farm = FARMS[index % FARMS.length];
  const warehouse = WAREHOUSES[index % WAREHOUSES.length];
  const zone = String.fromCharCode(65 + (index % 3));
  const rackNumber = String((index % 12) + 1).padStart(2, "0");
  const ageYears = preArrivalYears + warehouseAgingYears;
  const inwardDate = new Date();
  inwardDate.setFullYear(inwardDate.getFullYear() - Math.floor(ageYears));
  inwardDate.setMonth(inwardDate.getMonth() - Math.round((ageYears % 1) * 12));

  return {
    id: `#B-${(921 + index * 91).toString().padStart(4, "0")}`,
    farm: farm.name,
    farmAddress: farm.address,
    farmOwner: farm.owner,
    farmPhone: farm.phone,
    photo: FARM_PHOTO,
    inwardDate: inwardDate.toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    }),
    preArrivalYears,
    warehouseAgingYears,
    ageYears,
    warehouse,
    rack: `Zone ${zone} - Rack ${rackNumber}`,
    quantityKg,
    variety,
    moisturePercent: 10.5 + ((index * 7) % 30) / 10,
    purityGrade: PURITY_GRADES[index % PURITY_GRADES.length],
  };
}

const PRE_ARRIVAL_CYCLE = [0.5, 0.6, 0.1, 0.8, 0.2, 0.4];
const WAREHOUSE_AGE_CYCLE = [1.3, 0.8, 0.3, 1.3, 0.5, 0.7];
const QTY_CYCLE = [2590, 3456, 9867, 4210, 1875, 6320];

export const ALL_BATCHES: Batch[] = Array.from({ length: 12 }, (_, index) =>
  makeBatch(
    index,
    VARIETIES[index % VARIETIES.length],
    PRE_ARRIVAL_CYCLE[index % PRE_ARRIVAL_CYCLE.length],
    WAREHOUSE_AGE_CYCLE[index % WAREHOUSE_AGE_CYCLE.length],
    QTY_CYCLE[index % QTY_CYCLE.length],
  ),
);
