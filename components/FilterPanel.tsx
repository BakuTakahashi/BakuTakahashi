"use client";

import type { FilterCriteria, VehicleInput } from "@/types/filter";
import { ALL_STRUCTURES, STRUCTURE_LABELS } from "@/lib/labels";
import { VehiclePresetButtons } from "./VehiclePresetButtons";

interface Props {
  criteria: FilterCriteria;
  onChange: (next: FilterCriteria) => void;
  locationAvailable: boolean;
}

export function FilterPanel({ criteria, onChange, locationAvailable }: Props) {
  const setVehicle = (vehicle: VehicleInput) => onChange({ ...criteria, vehicle });
  const setVehicleField = (field: keyof VehicleInput, value: number) =>
    setVehicle({ ...criteria.vehicle, [field]: value });

  return (
    <aside className="space-y-5 rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
      <div>
        <h2 className="mb-2 text-sm font-bold text-slate-700">車両プリセット</h2>
        <VehiclePresetButtons current={criteria.vehicle} onSelect={setVehicle} />
      </div>

      <div>
        <h2 className="mb-2 text-sm font-bold text-slate-700">車両寸法</h2>
        <div className="grid grid-cols-2 gap-2">
          <NumberField
            label="車幅 (cm)"
            value={criteria.vehicle.widthCm}
            onChange={(v) => setVehicleField("widthCm", v)}
          />
          <NumberField
            label="車長 (cm)"
            value={criteria.vehicle.lengthCm}
            onChange={(v) => setVehicleField("lengthCm", v)}
          />
          <NumberField
            label="車高 (cm)"
            value={criteria.vehicle.heightCm}
            onChange={(v) => setVehicleField("heightCm", v)}
          />
          <NumberField
            label="重量 (kg)"
            value={criteria.vehicle.weightKg}
            onChange={(v) => setVehicleField("weightKg", v)}
          />
        </div>
      </div>

      <div>
        <h2 className="mb-2 text-sm font-bold text-slate-700">距離</h2>
        <NumberField
          label={`現在地から(km) ${locationAvailable ? "" : "※現在地未取得"}`}
          value={criteria.maxDistanceKm ?? 0}
          onChange={(v) =>
            onChange({ ...criteria, maxDistanceKm: v > 0 ? v : null })
          }
          disabled={!locationAvailable}
          placeholder="制限なし=0"
        />
      </div>

      <div>
        <h2 className="mb-2 text-sm font-bold text-slate-700">料金上限 (円/h)</h2>
        <NumberField
          label="平日 1時間あたり"
          value={criteria.maxHourlyYen ?? 0}
          onChange={(v) => onChange({ ...criteria, maxHourlyYen: v > 0 ? v : null })}
          placeholder="制限なし=0"
        />
      </div>

      <div>
        <label className="flex items-center gap-2 text-sm text-slate-700">
          <input
            type="checkbox"
            checked={criteria.requireOpenNow}
            onChange={(e) =>
              onChange({ ...criteria, requireOpenNow: e.target.checked })
            }
            className="h-4 w-4 rounded border-slate-300"
          />
          現在営業中のみ表示
        </label>
      </div>

      <div>
        <h2 className="mb-2 text-sm font-bold text-slate-700">施設種別</h2>
        <div className="flex gap-3 text-sm">
          <CheckboxField
            label="屋内"
            checked={criteria.allowedFacility.indoor}
            onChange={(v) =>
              onChange({
                ...criteria,
                allowedFacility: { ...criteria.allowedFacility, indoor: v },
              })
            }
          />
          <CheckboxField
            label="屋外"
            checked={criteria.allowedFacility.outdoor}
            onChange={(v) =>
              onChange({
                ...criteria,
                allowedFacility: { ...criteria.allowedFacility, outdoor: v },
              })
            }
          />
        </div>
      </div>

      <div>
        <h2 className="mb-2 text-sm font-bold text-slate-700">構造</h2>
        <div className="grid grid-cols-2 gap-2 text-sm">
          {ALL_STRUCTURES.map((s) => (
            <CheckboxField
              key={s}
              label={STRUCTURE_LABELS[s]}
              checked={criteria.allowedStructure[s]}
              onChange={(v) =>
                onChange({
                  ...criteria,
                  allowedStructure: { ...criteria.allowedStructure, [s]: v },
                })
              }
            />
          ))}
        </div>
        <p className="mt-2 text-xs text-slate-500">
          機械式・タワー式は大型車入庫不可なことが多いです
        </p>
      </div>
    </aside>
  );
}

function NumberField({
  label,
  value,
  onChange,
  disabled,
  placeholder,
}: {
  label: string;
  value: number;
  onChange: (v: number) => void;
  disabled?: boolean;
  placeholder?: string;
}) {
  return (
    <label className="block text-xs text-slate-600">
      <span>{label}</span>
      <input
        type="number"
        inputMode="numeric"
        value={value || ""}
        placeholder={placeholder}
        disabled={disabled}
        onChange={(e) => onChange(Number(e.target.value) || 0)}
        className="mt-1 w-full rounded border border-slate-300 px-2 py-1 text-sm disabled:bg-slate-100 disabled:text-slate-400"
      />
    </label>
  );
}

function CheckboxField({
  label,
  checked,
  onChange,
}: {
  label: string;
  checked: boolean;
  onChange: (v: boolean) => void;
}) {
  return (
    <label className="flex items-center gap-2 text-slate-700">
      <input
        type="checkbox"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
        className="h-4 w-4 rounded border-slate-300"
      />
      {label}
    </label>
  );
}
