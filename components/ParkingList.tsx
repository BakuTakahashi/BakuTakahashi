import type { ParkingWithDistance } from "@/types/parking";
import type { TagSummary } from "@/types/bigCarTag";
import { ParkingCard } from "./ParkingCard";

interface Props {
  parkings: ParkingWithDistance[];
  tagSummaries: Record<string, TagSummary>;
  selectedId: string | null;
  onSelect: (id: string | null) => void;
  onHover: (id: string | null) => void;
}

export function ParkingList({
  parkings,
  tagSummaries,
  selectedId,
  onSelect,
  onHover,
}: Props) {
  if (parkings.length === 0) {
    return (
      <div className="rounded-xl border border-dashed border-slate-300 bg-white p-8 text-center">
        <p className="text-base font-semibold text-slate-700">
          条件に合う駐車場が見つかりません
        </p>
        <p className="mt-2 text-sm text-slate-500">
          車両寸法を小さくする、構造の制限を緩める、距離・料金の上限を上げる、などをお試しください。
        </p>
      </div>
    );
  }

  return (
    <ul className="space-y-3">
      {parkings.map((p) => (
        <li key={p.id}>
          <ParkingCard
            parking={p}
            tagSummary={tagSummaries[p.id]}
            selected={selectedId === p.id}
            onSelect={() => onSelect(selectedId === p.id ? null : p.id)}
            onHoverStart={() => onHover(p.id)}
            onHoverEnd={() => onHover(null)}
          />
        </li>
      ))}
    </ul>
  );
}
