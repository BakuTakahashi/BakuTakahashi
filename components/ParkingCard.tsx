"use client";

import Link from "next/link";
import { useEffect, useRef } from "react";
import type { ParkingWithDistance } from "@/types/parking";
import type { TagSummary } from "@/types/bigCarTag";
import { BIG_CAR_TAG_EMOJI } from "@/types/bigCarTag";
import {
  formatCmToM,
  formatDistanceKm,
  formatKg,
  formatYen,
} from "@/lib/format";

const STRUCTURE_LABELS: Record<string, string> = {
  flat: "平面",
  mechanical: "機械式",
  tower: "タワー式",
  underground: "地下",
  rooftop: "屋上",
};

const FACILITY_LABELS: Record<string, string> = {
  indoor: "屋内",
  outdoor: "屋外",
};

const STATUS_BADGE: Record<string, { label: string; className: string }> = {
  available: { label: "空きあり", className: "bg-emerald-100 text-emerald-800" },
  few: { label: "残りわずか", className: "bg-amber-100 text-amber-800" },
  full: { label: "満車", className: "bg-rose-100 text-rose-800" },
  unknown: { label: "不明", className: "bg-slate-100 text-slate-700" },
};

interface Props {
  parking: ParkingWithDistance;
  tagSummary?: TagSummary;
  selected?: boolean;
  onSelect?: () => void;
  onHoverStart?: () => void;
  onHoverEnd?: () => void;
}

export function ParkingCard({
  parking,
  tagSummary,
  selected = false,
  onSelect,
  onHoverStart,
  onHoverEnd,
}: Props) {
  const status = STATUS_BADGE[parking.availability.status];
  const articleRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    if (selected && articleRef.current) {
      articleRef.current.scrollIntoView({ behavior: "smooth", block: "nearest" });
    }
  }, [selected]);

  return (
    <article
      ref={articleRef}
      onClick={onSelect}
      onMouseEnter={onHoverStart}
      onMouseLeave={onHoverEnd}
      onFocus={onHoverStart}
      onBlur={onHoverEnd}
      tabIndex={0}
      className={`cursor-pointer rounded-xl border bg-white p-4 shadow-sm transition ${
        selected
          ? "border-amber-400 ring-2 ring-amber-200"
          : "border-slate-200 hover:border-brand"
      }`}
    >
      <header className="flex items-start justify-between gap-3">
        <div>
          <h3 className="text-base font-bold text-slate-900">{parking.name}</h3>
          <p className="text-xs text-slate-500">{parking.address}</p>
        </div>
        <span
          className={`shrink-0 rounded-full px-2 py-1 text-xs font-semibold ${status.className}`}
        >
          {status.label}
        </span>
      </header>

      <dl className="mt-3 grid grid-cols-2 gap-x-4 gap-y-1 text-sm text-slate-700">
        <div>
          <dt className="inline text-slate-500">距離: </dt>
          <dd className="inline font-medium">
            {parking.distanceKm !== undefined ? formatDistanceKm(parking.distanceKm) : "—"}
          </dd>
        </div>
        <div>
          <dt className="inline text-slate-500">料金: </dt>
          <dd className="inline font-medium">
            {formatYen(parking.fee.weekdayHourlyYen)} / 時
          </dd>
        </div>
        <div>
          <dt className="inline text-slate-500">種別: </dt>
          <dd className="inline">
            {FACILITY_LABELS[parking.facilityType]} ・{" "}
            {STRUCTURE_LABELS[parking.structure]}
          </dd>
        </div>
        <div>
          <dt className="inline text-slate-500">営業: </dt>
          <dd className="inline">
            {parking.openingHours.is24h
              ? "24時間"
              : `${parking.openingHours.openTime}〜${parking.openingHours.closeTime}`}
          </dd>
        </div>
        <div className="col-span-2">
          <dt className="inline text-slate-500">最大寸法: </dt>
          <dd className="inline">
            幅 {formatCmToM(parking.vehicleLimit.maxWidthCm)} / 長{" "}
            {formatCmToM(parking.vehicleLimit.maxLengthCm)} / 高{" "}
            {formatCmToM(parking.vehicleLimit.maxHeightCm)} / 重{" "}
            {formatKg(parking.vehicleLimit.maxWeightKg)}
          </dd>
        </div>
      </dl>

      {parking.notes && (
        <p className="mt-2 rounded bg-slate-50 px-2 py-1 text-xs text-slate-600">
          {parking.notes}
        </p>
      )}

      {tagSummary && (
        <div className="mt-3 flex flex-wrap gap-1.5 text-xs">
          {(["spacious", "tight", "stuck", "noMechanical", "actualSize"] as const).map(
            (kind) =>
              tagSummary[kind] > 0 && (
                <span
                  key={kind}
                  className="rounded-full bg-brand/10 px-2 py-0.5 font-medium text-brand"
                >
                  {BIG_CAR_TAG_EMOJI[kind]} {tagSummary[kind]}
                </span>
              ),
          )}
        </div>
      )}

      <div className="mt-3 flex justify-end">
        <Link
          href={`/parking/${parking.id}`}
          onClick={(e) => e.stopPropagation()}
          className="rounded-lg bg-brand px-3 py-1.5 text-xs font-semibold text-white hover:bg-brand-dark"
        >
          詳細を見る →
        </Link>
      </div>
    </article>
  );
}
