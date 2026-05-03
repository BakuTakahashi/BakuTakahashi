"use client";

import type { SortKey } from "@/types/filter";

interface Props {
  value: SortKey;
  onChange: (next: SortKey) => void;
  count: number;
  effectiveSort: SortKey;
}

export function SortControl({ value, onChange, count, effectiveSort }: Props) {
  return (
    <div className="flex flex-wrap items-center justify-between gap-3 rounded-lg bg-white px-4 py-2 text-sm shadow-sm">
      <span className="font-semibold text-slate-800">{count}件 ヒット</span>
      <div className="flex items-center gap-2">
        <label className="text-xs text-slate-500">並び替え</label>
        <select
          value={value}
          onChange={(e) => onChange(e.target.value as SortKey)}
          className="rounded border border-slate-300 px-2 py-1 text-sm"
        >
          <option value="distance">距離順</option>
          <option value="priceAsc">料金が安い順</option>
        </select>
        {value === "distance" && effectiveSort !== "distance" && (
          <span className="text-xs text-amber-600">
            ※現在地未取得のため料金順で表示中
          </span>
        )}
      </div>
    </div>
  );
}
