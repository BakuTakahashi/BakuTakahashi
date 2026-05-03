"use client";

import type { GeoState } from "@/lib/geolocation";

interface Props {
  state: GeoState;
  onRequest: () => void;
}

function statusText(state: GeoState): string {
  switch (state.kind) {
    case "idle":
      return "現在地未取得";
    case "loading":
      return "現在地取得中...";
    case "ok":
      return `現在地: ${state.lat.toFixed(4)}, ${state.lng.toFixed(4)}`;
    case "denied":
      return "位置情報の利用が拒否されています。距離フィルタは無効です。";
    case "unavailable":
      return "この環境では位置情報を取得できません。";
    case "error":
      return `位置情報エラー: ${state.message}`;
  }
}

export function LocationStatus({ state, onRequest }: Props) {
  const buttonLabel = state.kind === "ok" ? "再取得" : "現在地から探す";
  const isLoading = state.kind === "loading";
  return (
    <div className="flex flex-wrap items-center justify-between gap-3 rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm">
      <span className="text-slate-700">{statusText(state)}</span>
      <button
        type="button"
        onClick={onRequest}
        disabled={isLoading}
        className="rounded-lg border border-brand px-3 py-1 text-xs font-semibold text-brand hover:bg-brand hover:text-white disabled:opacity-60"
      >
        {isLoading ? "取得中..." : buttonLabel}
      </button>
    </div>
  );
}
