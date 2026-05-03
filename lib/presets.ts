import type { VehicleInput } from "@/types/filter";

export interface VehiclePreset {
  id: "compact" | "highRoof" | "large";
  label: string;
  description: string;
  vehicle: VehicleInput;
}

export const VEHICLE_PRESETS: VehiclePreset[] = [
  {
    id: "compact",
    label: "普通車",
    description: "セダン・コンパクト",
    vehicle: { widthCm: 175, lengthCm: 470, heightCm: 155, weightKg: 1500 },
  },
  {
    id: "highRoof",
    label: "ハイルーフ",
    description: "ミニバン・SUV",
    vehicle: { widthCm: 190, lengthCm: 510, heightCm: 210, weightKg: 2000 },
  },
  {
    id: "large",
    label: "大型 (2m級)",
    description: "アルファード・LX等",
    vehicle: { widthCm: 200, lengthCm: 530, heightCm: 200, weightKg: 2500 },
  },
];
