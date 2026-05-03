"use client";

import { VEHICLE_PRESETS, type VehiclePreset } from "@/lib/presets";
import type { VehicleInput } from "@/types/filter";

interface Props {
  current: VehicleInput;
  onSelect: (vehicle: VehicleInput) => void;
}

function isActive(preset: VehiclePreset, current: VehicleInput): boolean {
  return (
    preset.vehicle.widthCm === current.widthCm &&
    preset.vehicle.lengthCm === current.lengthCm &&
    preset.vehicle.heightCm === current.heightCm &&
    preset.vehicle.weightKg === current.weightKg
  );
}

export function VehiclePresetButtons({ current, onSelect }: Props) {
  return (
    <div className="grid grid-cols-3 gap-2">
      {VEHICLE_PRESETS.map((preset) => {
        const active = isActive(preset, current);
        return (
          <button
            key={preset.id}
            type="button"
            onClick={() => onSelect(preset.vehicle)}
            className={`rounded-lg border px-3 py-2 text-left text-sm transition ${
              active
                ? "border-brand bg-brand text-white"
                : "border-slate-300 bg-white hover:border-brand hover:bg-slate-50"
            }`}
          >
            <div className="font-semibold">{preset.label}</div>
            <div className={`text-xs ${active ? "text-white/80" : "text-slate-500"}`}>
              {preset.description}
            </div>
          </button>
        );
      })}
    </div>
  );
}
