"use client";

import { AnimatePresence, motion } from "framer-motion";
import { Check, Compass, MapPin, Maximize2, Minus, Navigation, Plus, RotateCcw, Search, Warehouse, X } from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";

export type WarehouseLocation = {
  id: string;
  name: string;
  area: string;
  city: string;
  fullAddress: string;
  coordinates: string;
  geoTags: string;
  x: number; // percentage (0-100)
  y: number; // percentage (0-100)
};

export const WAREHOUSE_PRESETS: WarehouseLocation[] = [
  {
    id: "wh-1",
    name: "Whitefield Logistics Center",
    area: "KIADB Industrial Area, Phase 2",
    city: "Bangalore",
    fullAddress: "Plot 42, KIADB Industrial Area, Phase 2, Hoodi, Whitefield, Bangalore, Karnataka - 560066",
    coordinates: "12.9850° N, 77.7400° E",
    geoTags: "#EastBangalore, #IndustrialZone, #Tier1",
    x: 76,
    y: 38,
  },
  {
    id: "wh-2",
    name: "Electronic City Distribution Hub",
    area: "Electronic City Phase 1",
    city: "Bangalore",
    fullAddress: "Survey No. 88, Electronic City Phase 1, Near Hosur Main Road, Bangalore, Karnataka - 560100",
    coordinates: "12.8452° N, 77.6602° E",
    geoTags: "#SouthBangalore, #TechCorridor, #ExpressHub",
    x: 65,
    y: 78,
  },
  {
    id: "wh-3",
    name: "Peenya Industrial Warehouse",
    area: "Peenya 4th Phase",
    city: "Bangalore",
    fullAddress: "Shed 15, Peenya 4th Phase, Industrial Estate, Bangalore, Karnataka - 560058",
    coordinates: "13.0285° N, 77.5195° E",
    geoTags: "#NorthBangalore, #IndustrialBelt, #HeavyLogistics",
    x: 24,
    y: 28,
  },
  {
    id: "wh-4",
    name: "Gachibowli Fulfillment Hub",
    area: "Financial District / Gachibowli",
    city: "Hyderabad",
    fullAddress: "Plot 12-B, Financial District, Nanakramguda, Gachibowli, Hyderabad, Telangana - 500032",
    coordinates: "17.4401° N, 78.3489° E",
    geoTags: "#Hyderabad, #FinancialDistrict, #MetroHub",
    x: 44,
    y: 48,
  },
  {
    id: "wh-5",
    name: "Shamshabad Air Cargo Hub",
    area: "Airport Cargo & Logistics Zone",
    city: "Hyderabad",
    fullAddress: "Survey 45/A, Shamshabad International Airport Cargo Zone, Hyderabad, Telangana - 500409",
    coordinates: "17.2403° N, 78.4294° E",
    geoTags: "#Hyderabad, #AirportCargo, #ExpressCargo",
    x: 52,
    y: 84,
  },
  {
    id: "wh-6",
    name: "Bommasandra Logistics Park",
    area: "Bommasandra Industrial Area",
    city: "Bangalore",
    fullAddress: "Plot 104, 3rd Cross, Bommasandra Industrial Area, Anekal Taluk, Bangalore, Karnataka - 560099",
    coordinates: "12.8123° N, 77.6890° E",
    geoTags: "#Bangalore, #LogisticsPark, #Anekal",
    x: 82,
    y: 88,
  },
];

function getNearestOrCustomLocation(x: number, y: number): WarehouseLocation {
  const closest = WAREHOUSE_PRESETS.reduce((prev, curr) => {
    const dPrev = Math.hypot(prev.x - x, prev.y - y);
    const dCurr = Math.hypot(curr.x - x, curr.y - y);
    return dCurr < dPrev ? curr : prev;
  });
  const dist = Math.hypot(closest.x - x, closest.y - y);
  if (dist < 10) return closest;

  const sector = Math.floor(x / 10) + 1;
  const block = Math.floor(y / 10) + 1;
  const isSouth = y > 50;
  const zoneName = isSouth ? "South Logistics Corridor" : "North Distribution Belt";
  const city = x > 50 ? "Bangalore" : "Hyderabad";
  const pin = x > 50 ? `5600${10 + sector}` : `5000${20 + sector}`;

  const lat = (12.5 + (100 - y) * 0.05).toFixed(4);
  const lng = (77.2 + x * 0.015).toFixed(4);
  const coordinates = `${lat}° N, ${lng}° E`;
  const geoTags = `#${city}, #${zoneName.replace(/\s+/g, "")}, #Sector${sector}`;

  return {
    id: `loc-${Math.round(x)}-${Math.round(y)}`,
    name: `Distribution Center (Sec ${sector})`,
    area: `${zoneName}, Block ${block}`,
    city,
    fullAddress: `Plot No. ${sector * 8 + block}, Sector ${sector}, ${zoneName}, ${city}, ${city === "Bangalore" ? "Karnataka" : "Telangana"} - ${pin}`,
    coordinates,
    geoTags,
    x: Math.round(x),
    y: Math.round(y),
  };
}

// Map SVG background with roads, lakes, zones
export function MapGraphic({
  pinLocation,
  onMapClick,
  zoom = 1,
  showLabels = true,
}: {
  pinLocation?: { x: number; y: number; name?: string };
  onMapClick?: (x: number, y: number) => void;
  zoom?: number;
  showLabels?: boolean;
}) {
  const mapRef = useRef<HTMLDivElement>(null);

  function handleClick(event: React.MouseEvent<HTMLDivElement>) {
    if (!onMapClick || !mapRef.current) return;
    const rect = mapRef.current.getBoundingClientRect();
    const x = Math.max(5, Math.min(95, ((event.clientX - rect.left) / rect.width) * 100));
    const y = Math.max(5, Math.min(95, ((event.clientY - rect.top) / rect.height) * 100));
    onMapClick(x, y);
  }

  return (
    <div
      ref={mapRef}
      onClick={handleClick}
      className="relative h-full w-full cursor-crosshair select-none overflow-hidden bg-[#E9EBEA]"
    >
      <div
        className="h-full w-full transition-transform duration-300"
        style={{ transform: `scale(${zoom})`, transformOrigin: "center center" }}
      >
        <svg
          viewBox="0 0 1000 600"
          className="h-full w-full"
          preserveAspectRatio="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            {/* Grid Pattern */}
            <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
              <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#DFE3E1" strokeWidth="0.8" />
            </pattern>
            {/* Green Industrial Zone */}
            <pattern id="industrialZone" width="20" height="20" patternUnits="userSpaceOnUse">
              <rect width="20" height="20" fill="#E2EBE5" />
              <path d="M 0 20 L 20 0 M 0 0 L 20 20" fill="none" stroke="#D3E0D7" strokeWidth="0.6" />
            </pattern>
          </defs>

          {/* Base background */}
          <rect width="1000" height="600" fill="#EAECEA" />
          <rect width="1000" height="600" fill="url(#grid)" />

          {/* Logistics / Industrial Zones */}
          <rect x="680" y="160" width="240" height="180" rx="16" fill="url(#industrialZone)" />
          <rect x="120" y="80" width="220" height="170" rx="16" fill="url(#industrialZone)" />
          <rect x="560" y="380" width="260" height="170" rx="16" fill="url(#industrialZone)" />
          <rect x="340" y="240" width="200" height="160" rx="16" fill="url(#industrialZone)" />

          {/* Water Bodies / Lakes */}
          <path
            d="M 460 60 C 520 80, 580 50, 620 90 C 650 120, 610 170, 560 160 C 500 150, 430 110, 460 60 Z"
            fill="#C9E6F0"
          />
          <path
            d="M 180 380 C 240 370, 290 420, 270 480 C 250 530, 190 510, 160 460 C 140 420, 150 390, 180 380 Z"
            fill="#C9E6F0"
          />

          {/* Parks / Green Spaces */}
          <path
            d="M 780 440 C 840 430, 920 460, 910 520 C 900 560, 820 570, 770 540 C 740 510, 750 450, 780 440 Z"
            fill="#D4EAD9"
          />

          {/* Arterial Roads (Outer Ring Road, Expressways) */}
          <path
            d="M 0 140 Q 300 200, 600 180 T 1000 120"
            fill="none"
            stroke="#D0D6D2"
            strokeWidth="18"
            strokeLinecap="round"
          />
          <path
            d="M 0 140 Q 300 200, 600 180 T 1000 120"
            fill="none"
            stroke="#FFFFFF"
            strokeWidth="14"
            strokeLinecap="round"
          />

          {/* Highway 2 */}
          <path
            d="M 180 0 Q 240 280, 500 360 T 820 600"
            fill="none"
            stroke="#D0D6D2"
            strokeWidth="20"
            strokeLinecap="round"
          />
          <path
            d="M 180 0 Q 240 280, 500 360 T 820 600"
            fill="none"
            stroke="#FFFFFF"
            strokeWidth="16"
            strokeLinecap="round"
          />

          {/* Diagonal connecting road */}
          <path
            d="M 1000 360 Q 650 350, 480 360 T 0 460"
            fill="none"
            stroke="#D0D6D2"
            strokeWidth="14"
          />
          <path
            d="M 1000 360 Q 650 350, 480 360 T 0 460"
            fill="none"
            stroke="#FFFFFF"
            strokeWidth="10"
          />

          {/* Grid Street Networks */}
          <line x1="720" y1="140" x2="720" y2="360" stroke="#FFFFFF" strokeWidth="6" />
          <line x1="840" y1="140" x2="840" y2="360" stroke="#FFFFFF" strokeWidth="6" />
          <line x1="680" y1="260" x2="940" y2="260" stroke="#FFFFFF" strokeWidth="6" />

          <line x1="160" y1="60" x2="160" y2="280" stroke="#FFFFFF" strokeWidth="6" />
          <line x1="260" y1="60" x2="260" y2="280" stroke="#FFFFFF" strokeWidth="6" />
          <line x1="100" y1="180" x2="320" y2="180" stroke="#FFFFFF" strokeWidth="6" />

          <line x1="600" y1="360" x2="600" y2="580" stroke="#FFFFFF" strokeWidth="6" />
          <line x1="720" y1="360" x2="720" y2="580" stroke="#FFFFFF" strokeWidth="6" />
          <line x1="540" y1="460" x2="800" y2="460" stroke="#FFFFFF" strokeWidth="6" />

          {/* Road labels */}
          {showLabels && (
            <>
              <text x="340" y="165" fill="#6B7280" fontSize="12" fontWeight="700" letterSpacing="1">
                OUTER RING ROAD
              </text>
              <text x="730" y="180" fill="#9CA3AF" fontSize="11" fontWeight="600">
                KIADB LOGISTICS PARK
              </text>
              <text x="140" y="100" fill="#9CA3AF" fontSize="11" fontWeight="600">
                PEENYA INDUSTRIAL BELT
              </text>
              <text x="610" y="405" fill="#9CA3AF" fontSize="11" fontWeight="600">
                ELECTRONIC CITY CORRIDOR
              </text>
              <text x="380" y="270" fill="#9CA3AF" fontSize="11" fontWeight="600">
                FINANCIAL DISTRICT LOGISTICS
              </text>
            </>
          )}
        </svg>
      </div>

      {/* Preset markers on map (subtle dots) */}
      {WAREHOUSE_PRESETS.map((preset) => {
        const isSelected = pinLocation && Math.hypot(pinLocation.x - preset.x, pinLocation.y - preset.y) < 2;
        return (
          <div
            key={preset.id}
            style={{ left: `${preset.x}%`, top: `${preset.y}%` }}
            className={`pointer-events-none absolute -translate-x-1/2 -translate-y-1/2 transition-transform ${
              isSelected ? "scale-0 opacity-0" : "scale-100 opacity-60"
            }`}
          >
            <div className="flex h-5 w-5 items-center justify-center rounded-full bg-white/80 shadow-sm border border-[#E5E7EB]">
              <div className="h-2 w-2 rounded-full bg-[#9CA3AF]" />
            </div>
          </div>
        );
      })}

      {/* Active Pin Marker */}
      {pinLocation && (
        <div
          style={{ left: `${pinLocation.x}%`, top: `${pinLocation.y}%` }}
          className="pointer-events-none absolute -translate-x-1/2 -translate-y-full transition-all duration-200"
        >
          {/* Pulsing Radar Ring */}
          <div className="absolute left-1/2 top-full -translate-x-1/2 -translate-y-1/2">
            <span className="absolute -inset-3 block animate-ping rounded-full bg-[#F7931E]/40" />
            <span className="block h-3.5 w-3.5 rounded-full border-2 border-white bg-[#F7931E] shadow-md" />
          </div>

          {/* Hovering Info Badge */}
          <div className="relative mb-2 flex -translate-y-2 flex-col items-center">
            <div className="flex items-center gap-1.5 whitespace-nowrap rounded-xl bg-black/85 px-3 py-1.5 text-xs font-semibold text-white shadow-xl backdrop-blur-md">
              <Warehouse className="h-3.5 w-3.5 text-[#F7931E]" strokeWidth={2.5} />
              <span>{pinLocation.name || "Selected Location"}</span>
            </div>
            {/* Tooltip caret */}
            <div className="h-1.5 w-2 -mt-0.5 border-x-4 border-t-4 border-x-transparent border-t-black/85" />
          </div>

          {/* Big Orange Pin Icon */}
          <div className="flex h-10 w-10 -translate-y-2 items-center justify-center rounded-full bg-gradient-to-tr from-[#EA580C] to-[#F7931E] text-white shadow-[0_8px_20px_rgba(247,147,30,0.5)] border-2 border-white">
            <MapPin className="h-5 w-5 fill-white stroke-none" />
          </div>
        </div>
      )}
    </div>
  );
}

// Inline Map Preview Component (inside CreateHubModal)
export function WarehouseMapInlinePicker({
  selectedAddress,
  onOpenEnlarge,
}: {
  selectedAddress?: string;
  onOpenEnlarge: () => void;
}) {
  // Find preset or fallback
  const location = useMemo(() => {
    if (!selectedAddress) return WAREHOUSE_PRESETS[0];
    const match = WAREHOUSE_PRESETS.find((p) =>
      selectedAddress.toLowerCase().includes(p.name.toLowerCase()) ||
      selectedAddress.toLowerCase().includes(p.area.toLowerCase())
    );
    return match || { ...WAREHOUSE_PRESETS[0], fullAddress: selectedAddress };
  }, [selectedAddress]);

  return (
    <div className="group relative overflow-hidden rounded-2xl border border-[#E5E7EB] bg-white transition-all hover:border-[#D1D5DB] shadow-sm">
      {/* Map Graphic Container */}
      <div className="relative h-[160px] w-full" onClick={onOpenEnlarge}>
        <MapGraphic pinLocation={{ x: location.x, y: location.y, name: location.name }} showLabels={false} />

        {/* Top Floating Controls */}
        <div className="absolute left-3 top-3 flex items-center gap-2">
          <span className="flex items-center gap-1.5 rounded-full bg-white/95 px-3 py-1 text-xs font-semibold text-black shadow-sm backdrop-blur-md">
            <span className="h-2 w-2 rounded-full bg-[#22C55E]" />
            Warehouse Location
          </span>
        </div>

        {/* Top-Right Enlarge CTA Button */}
        <div className="absolute right-3 top-3">
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onOpenEnlarge();
            }}
            className="flex cursor-pointer items-center gap-1.5 rounded-full bg-white/95 px-3 py-1.5 text-xs font-bold text-[#1F2937] shadow-md backdrop-blur-md transition-all hover:bg-white hover:text-[#F7931E] hover:scale-105 active:scale-95"
          >
            <Maximize2 className="h-3.5 w-3.5" strokeWidth={2.2} />
            Enlarge Map
          </button>
        </div>

        {/* Bottom Address Overlay on Inline View */}
        <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent p-3 pt-6 text-white pointer-events-none">
          <p className="flex items-center gap-1.5 text-xs font-bold">
            <MapPin className="h-3.5 w-3.5 text-[#F7931E]" strokeWidth={2.5} />
            {location.name}
          </p>
          <p className="mt-0.5 truncate text-[11px] text-white/80">
            {location.fullAddress}
          </p>
        </div>
      </div>
    </div>
  );
}

// Enlarged Map Modal Component with "Confirm Warehouse Location" CTA
export function WarehouseLocationMapModal({
  open,
  onClose,
  initialAddress,
  onConfirmLocation,
}: {
  open: boolean;
  onClose: () => void;
  initialAddress?: string;
  onConfirmLocation: (address: string, coordinates?: string, geoTags?: string) => void;
}) {
  const [activeLocation, setActiveLocation] = useState<WarehouseLocation>(() => {
    if (initialAddress) {
      const match = WAREHOUSE_PRESETS.find((p) =>
        initialAddress.toLowerCase().includes(p.name.toLowerCase()) ||
        initialAddress.toLowerCase().includes(p.area.toLowerCase())
      );
      if (match) return match;
    }
    return WAREHOUSE_PRESETS[0];
  });

  const [searchQuery, setSearchQuery] = useState("");
  const [zoom, setZoom] = useState(1);

  // Sync initial address on open
  useEffect(() => {
    if (open) {
      if (initialAddress) {
        const match = WAREHOUSE_PRESETS.find((p) =>
          initialAddress.toLowerCase().includes(p.name.toLowerCase()) ||
          initialAddress.toLowerCase().includes(p.area.toLowerCase())
        );
        if (match) setActiveLocation(match);
      }
      setSearchQuery("");
      setZoom(1);
    }
  }, [open, initialAddress]);

  // Search filter
  const searchResults = useMemo(() => {
    if (!searchQuery.trim()) return [];
    return WAREHOUSE_PRESETS.filter(
      (loc) =>
        loc.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        loc.area.toLowerCase().includes(searchQuery.toLowerCase()) ||
        loc.city.toLowerCase().includes(searchQuery.toLowerCase()) ||
        loc.fullAddress.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [searchQuery]);

  function handleMapClick(x: number, y: number) {
    const newLoc = getNearestOrCustomLocation(x, y);
    setActiveLocation(newLoc);
  }

  function handleConfirm() {
    onConfirmLocation(activeLocation.fullAddress, activeLocation.coordinates, activeLocation.geoTags);
    onClose();
  }

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.18 }}
          onClick={onClose}
          className="fixed inset-0 z-[70] flex items-center justify-center overflow-y-auto bg-black/60 p-4 py-6 backdrop-blur-sm"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.96, y: 12 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: 12 }}
            transition={{ duration: 0.2, ease: [0.22, 1, 0.36, 1] }}
            onClick={(e) => e.stopPropagation()}
            className="flex w-full max-w-[880px] flex-col overflow-hidden rounded-[28px] border border-[#E5E7EB] bg-white shadow-[0_24px_60px_rgba(0,0,0,0.22)]"
          >
            {/* Header */}
            <div className="flex items-center justify-between border-b border-[#F3F4F6] px-6 py-4">
              <div>
                <h3 className="text-lg font-bold text-black">Select Warehouse Location</h3>
                <p className="text-xs text-[#6B7280]">
                  Click anywhere on the map or select a hub to pin the distribution location.
                </p>
              </div>
              <button
                type="button"
                onClick={onClose}
                className="flex h-9 w-9 cursor-pointer items-center justify-center rounded-full text-[#9CA3AF] transition-colors hover:bg-[#F3F4F6] hover:text-black"
              >
                <X className="h-5 w-5" strokeWidth={2} />
              </button>
            </div>

            {/* Search Bar & Quick Zone Filter Chips */}
            <div className="border-b border-[#F3F4F6] bg-[#FAFAFA] px-6 py-3">
              <div className="relative">
                <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-[#9CA3AF]" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search hub name, area, or city (e.g. Whitefield, Peenya, Gachibowli)..."
                  className="w-full rounded-full border border-[#E5E7EB] bg-white py-2 pl-10 pr-10 text-sm outline-none placeholder:text-[#9CA3AF] focus:border-[#F7931E]"
                />
                {searchQuery && (
                  <button
                    type="button"
                    onClick={() => setSearchQuery("")}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-xs font-bold text-[#9CA3AF] hover:text-black"
                  >
                    Clear
                  </button>
                )}

                {/* Dropdown search suggestions */}
                {searchResults.length > 0 && (
                  <div className="absolute left-0 right-0 top-full z-30 mt-1 max-h-48 overflow-y-auto rounded-2xl border border-[#E5E7EB] bg-white p-1.5 shadow-xl">
                    {searchResults.map((result) => (
                      <button
                        key={result.id}
                        type="button"
                        onClick={() => {
                          setActiveLocation(result);
                          setSearchQuery("");
                        }}
                        className="flex w-full cursor-pointer items-start gap-2.5 rounded-xl px-3 py-2 text-left hover:bg-[#FEF3E2]"
                      >
                        <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-[#F7931E]" />
                        <div>
                          <p className="text-xs font-bold text-black">{result.name}</p>
                          <p className="truncate text-[11px] text-[#6B7280]">{result.fullAddress}</p>
                        </div>
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Quick Preset Chips */}
              <div className="mt-2.5 flex items-center gap-2 overflow-x-auto pb-1 text-xs">
                <span className="shrink-0 font-medium text-[#9CA3AF]">Quick Hubs:</span>
                {WAREHOUSE_PRESETS.map((preset) => {
                  const isSelected = activeLocation.id === preset.id;
                  return (
                    <button
                      key={preset.id}
                      type="button"
                      onClick={() => setActiveLocation(preset)}
                      className={`shrink-0 cursor-pointer rounded-full px-3 py-1 font-semibold transition-all ${
                        isSelected
                          ? "bg-[#F7931E] text-white shadow-sm"
                          : "border border-[#E5E7EB] bg-white text-[#374151] hover:bg-[#F3F4F6]"
                      }`}
                    >
                      {preset.name.split(" ")[0]}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Map Canvas Viewport */}
            <div className="relative h-[380px] w-full">
              <MapGraphic
                pinLocation={{ x: activeLocation.x, y: activeLocation.y, name: activeLocation.name }}
                onMapClick={handleMapClick}
                zoom={zoom}
                showLabels={true}
              />

              {/* Map Floating Controls */}
              <div className="absolute right-4 top-4 flex flex-col gap-1.5 rounded-2xl border border-black/5 bg-white/95 p-1.5 shadow-lg backdrop-blur-md">
                <button
                  type="button"
                  title="Zoom In"
                  onClick={() => setZoom((z) => Math.min(1.8, +(z + 0.2).toFixed(1)))}
                  className="flex h-8 w-8 cursor-pointer items-center justify-center rounded-xl text-[#374151] transition-colors hover:bg-[#FEF3E2] hover:text-[#F7931E]"
                >
                  <Plus className="h-4 w-4" strokeWidth={2.4} />
                </button>
                <button
                  type="button"
                  title="Zoom Out"
                  onClick={() => setZoom((z) => Math.max(0.8, +(z - 0.2).toFixed(1)))}
                  className="flex h-8 w-8 cursor-pointer items-center justify-center rounded-xl text-[#374151] transition-colors hover:bg-[#FEF3E2] hover:text-[#F7931E]"
                >
                  <Minus className="h-4 w-4" strokeWidth={2.4} />
                </button>
                <button
                  type="button"
                  title="Reset Map View"
                  onClick={() => setZoom(1)}
                  className="flex h-8 w-8 cursor-pointer items-center justify-center rounded-xl text-[#374151] transition-colors hover:bg-[#FEF3E2] hover:text-[#F7931E]"
                >
                  <RotateCcw className="h-3.5 w-3.5" strokeWidth={2.4} />
                </button>
              </div>

              {/* Hint badge */}
              <div className="pointer-events-none absolute bottom-4 left-4">
                <span className="flex items-center gap-1.5 rounded-full bg-black/75 px-3 py-1.5 text-xs font-medium text-white shadow-md backdrop-blur-md">
                  <Navigation className="h-3 w-3 text-[#F7931E]" />
                  Click anywhere on the map to reposition pin
                </span>
              </div>
            </div>

            {/* Bottom Bar with Location Details & "Confirm Warehouse Location" CTA */}
            <div className="flex flex-col gap-4 border-t border-[#F3F4F6] bg-white p-5 sm:flex-row sm:items-center sm:justify-between sm:px-6">
              <div className="flex items-center gap-3 min-w-0 flex-1">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-[#FEF3E2] text-[#F7931E]">
                  <MapPin className="h-6 w-6" strokeWidth={2.2} />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-xs font-bold uppercase tracking-wide text-[#9CA3AF]">
                    Selected Pin Location
                  </p>
                  <p className="truncate text-sm font-bold text-black">{activeLocation.name}</p>
                  <p className="truncate text-xs text-[#6B7280]">{activeLocation.fullAddress}</p>
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 shrink-0 ml-auto">
                <button
                  type="button"
                  onClick={onClose}
                  className="cursor-pointer rounded-full border border-[#E5E7EB] bg-white px-6 py-2.5 text-sm font-semibold text-[#374151] transition-colors hover:bg-[#F9FAFB] hover:text-black"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleConfirm}
                  className="flex cursor-pointer items-center gap-2 rounded-full bg-[#F7931E] px-7 py-2.5 text-sm font-bold text-white shadow-[0_4px_16px_rgba(247,147,30,0.35)] transition-all hover:bg-[#E68214] active:scale-95"
                >
                  <Check className="h-4 w-4 stroke-[3]" />
                  Confirm Warehouse Location
                </button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

