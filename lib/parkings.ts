import type { Parking } from "@/types/parking";
import parkingsData from "@/data/parkings.json";

export async function fetchParkings(): Promise<Parking[]> {
  return parkingsData as Parking[];
}

export async function fetchParkingById(id: string): Promise<Parking | null> {
  const all = await fetchParkings();
  return all.find((p) => p.id === id) ?? null;
}
