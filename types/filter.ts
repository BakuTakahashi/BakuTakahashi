import type { Structure } from "./parking";

export type SortKey = "distance" | "priceAsc";

export interface VehicleInput {
  widthCm: number;
  lengthCm: number;
  heightCm: number;
  weightKg: number;
}

export interface FilterCriteria {
  vehicle: VehicleInput;
  maxDistanceKm: number | null;
  maxHourlyYen: number | null;
  requireOpenNow: boolean;
  allowedFacility: { indoor: boolean; outdoor: boolean };
  allowedStructure: Record<Structure, boolean>;
  sort: SortKey;
}
