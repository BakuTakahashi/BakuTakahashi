import type { FilterCriteria } from "@/types/filter";
import type { LatLng } from "./distance";
import { haversineKm } from "./distance";
import type { Parking, ParkingWithDistance } from "@/types/parking";

function isOpenNow(p: Parking, now: Date): boolean {
  if (p.openingHours.is24h) return true;
  const open = p.openingHours.openTime;
  const close = p.openingHours.closeTime;
  if (!open || !close) return true;
  const minutes = now.getHours() * 60 + now.getMinutes();
  const [oh, om] = open.split(":").map(Number);
  const [ch, cm] = close.split(":").map(Number);
  const openMin = oh * 60 + om;
  const closeMin = ch * 60 + cm;
  if (closeMin > openMin) return minutes >= openMin && minutes <= closeMin;
  return minutes >= openMin || minutes <= closeMin;
}

export function applyFilters(
  parkings: Parking[],
  criteria: FilterCriteria,
  userLocation: LatLng | null,
  now: Date = new Date(),
): ParkingWithDistance[] {
  const { vehicle } = criteria;
  const fitsVehicle = (p: Parking) =>
    p.vehicleLimit.maxWidthCm >= vehicle.widthCm &&
    p.vehicleLimit.maxLengthCm >= vehicle.lengthCm &&
    p.vehicleLimit.maxHeightCm >= vehicle.heightCm &&
    p.vehicleLimit.maxWeightKg >= vehicle.weightKg;

  const matchesStructure = (p: Parking) => criteria.allowedStructure[p.structure] === true;
  const matchesFacility = (p: Parking) =>
    (p.facilityType === "indoor" && criteria.allowedFacility.indoor) ||
    (p.facilityType === "outdoor" && criteria.allowedFacility.outdoor);
  const matchesFee = (p: Parking) =>
    criteria.maxHourlyYen === null || p.fee.weekdayHourlyYen <= criteria.maxHourlyYen;
  const matchesOpen = (p: Parking) => !criteria.requireOpenNow || isOpenNow(p, now);

  let withDistance: ParkingWithDistance[] = parkings.map((p) =>
    userLocation
      ? { ...p, distanceKm: haversineKm(userLocation, { lat: p.lat, lng: p.lng }) }
      : { ...p },
  );

  withDistance = withDistance.filter(
    (p) =>
      fitsVehicle(p) &&
      matchesStructure(p) &&
      matchesFacility(p) &&
      matchesFee(p) &&
      matchesOpen(p),
  );

  if (userLocation && criteria.maxDistanceKm !== null) {
    const limit = criteria.maxDistanceKm;
    withDistance = withDistance.filter((p) => (p.distanceKm ?? Infinity) <= limit);
  }

  const effectiveSort =
    criteria.sort === "distance" && !userLocation ? "priceAsc" : criteria.sort;

  if (effectiveSort === "distance") {
    withDistance.sort((a, b) => (a.distanceKm ?? Infinity) - (b.distanceKm ?? Infinity));
  } else {
    withDistance.sort((a, b) => a.fee.weekdayHourlyYen - b.fee.weekdayHourlyYen);
  }

  return withDistance;
}
