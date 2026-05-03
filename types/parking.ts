export type Structure = "flat" | "mechanical" | "tower" | "underground" | "rooftop";
export type FacilityType = "indoor" | "outdoor";

export interface VehicleLimit {
  maxWidthCm: number;
  maxLengthCm: number;
  maxHeightCm: number;
  maxWeightKg: number;
}

export interface Fee {
  weekdayHourlyYen: number;
  weekendHourlyYen: number;
  maxDailyYen: number | null;
}

export interface OpeningHours {
  is24h: boolean;
  openTime?: string;
  closeTime?: string;
}

export type AvailabilityStatus = "available" | "few" | "full" | "unknown";

export interface Availability {
  status: AvailabilityStatus;
  freeSpots?: number;
  totalSpots?: number;
}

export interface Parking {
  id: string;
  name: string;
  address: string;
  lat: number;
  lng: number;
  facilityType: FacilityType;
  structure: Structure;
  vehicleLimit: VehicleLimit;
  fee: Fee;
  openingHours: OpeningHours;
  availability: Availability;
  notes?: string;
}

export interface ParkingWithDistance extends Parking {
  distanceKm?: number;
}
