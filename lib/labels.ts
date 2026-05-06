import type {
  AvailabilityStatus,
  FacilityType,
  Structure,
} from "@/types/parking";

export const STRUCTURE_LABELS: Record<Structure, string> = {
  flat: "平面",
  mechanical: "機械式",
  tower: "タワー式",
  underground: "地下",
  rooftop: "屋上",
};

export const FACILITY_LABELS: Record<FacilityType, string> = {
  indoor: "屋内",
  outdoor: "屋外",
};

export const STATUS_BADGE: Record<
  AvailabilityStatus,
  { label: string; className: string }
> = {
  available: { label: "空きあり", className: "bg-emerald-100 text-emerald-800" },
  few: { label: "残りわずか", className: "bg-amber-100 text-amber-800" },
  full: { label: "満車", className: "bg-rose-100 text-rose-800" },
  unknown: { label: "不明", className: "bg-slate-100 text-slate-700" },
};

export const ALL_STRUCTURES: Structure[] = [
  "flat",
  "mechanical",
  "tower",
  "underground",
  "rooftop",
];
