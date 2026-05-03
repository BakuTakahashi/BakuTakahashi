"use client";

import { useEffect, useMemo, useState } from "react";
import type { Parking } from "@/types/parking";
import type { FilterCriteria } from "@/types/filter";
import type { TagSummary } from "@/types/bigCarTag";
import { VEHICLE_PRESETS } from "@/lib/presets";
import { applyFilters } from "@/lib/filter";
import { getCurrentPosition, type GeoState } from "@/lib/geolocation";
import { getAllSummariesByParking } from "@/lib/bigCarTags";
import { FilterPanel } from "./FilterPanel";
import { ParkingList } from "./ParkingList";
import { LocationStatus } from "./LocationStatus";
import { SortControl } from "./SortControl";

interface Props {
  parkings: Parking[];
}

function defaultCriteria(): FilterCriteria {
  return {
    vehicle: VEHICLE_PRESETS[0].vehicle,
    maxDistanceKm: null,
    maxHourlyYen: null,
    requireOpenNow: false,
    allowedFacility: { indoor: true, outdoor: true },
    allowedStructure: {
      flat: true,
      mechanical: true,
      tower: true,
      underground: true,
      rooftop: true,
    },
    sort: "priceAsc",
  };
}

export function ParkingFinder({ parkings }: Props) {
  const [criteria, setCriteria] = useState<FilterCriteria>(defaultCriteria);
  const [geo, setGeo] = useState<GeoState>({ kind: "idle" });
  const [tagSummaries, setTagSummaries] = useState<Record<string, TagSummary>>({});

  useEffect(() => {
    setTagSummaries(getAllSummariesByParking());
    const handler = () => setTagSummaries(getAllSummariesByParking());
    window.addEventListener("focus", handler);
    return () => window.removeEventListener("focus", handler);
  }, []);

  const requestLocation = async () => {
    setGeo({ kind: "loading" });
    const result = await getCurrentPosition();
    setGeo(result);
    if (result.kind === "ok" && criteria.sort === "priceAsc") {
      setCriteria((prev) => ({ ...prev, sort: "distance" }));
    }
  };

  const userLocation = useMemo(
    () => (geo.kind === "ok" ? { lat: geo.lat, lng: geo.lng } : null),
    [geo],
  );

  const filtered = useMemo(
    () => applyFilters(parkings, criteria, userLocation),
    [parkings, criteria, userLocation],
  );

  const effectiveSort =
    criteria.sort === "distance" && !userLocation ? "priceAsc" : criteria.sort;

  return (
    <div className="space-y-4">
      <LocationStatus state={geo} onRequest={requestLocation} />

      <div className="grid gap-4 md:grid-cols-[280px_1fr]">
        <details className="md:hidden" open={false}>
          <summary className="cursor-pointer rounded-lg bg-brand px-3 py-2 text-sm font-semibold text-white">
            フィルタを開く
          </summary>
          <div className="mt-2">
            <FilterPanel
              criteria={criteria}
              onChange={setCriteria}
              locationAvailable={!!userLocation}
            />
          </div>
        </details>
        <div className="hidden md:block">
          <FilterPanel
            criteria={criteria}
            onChange={setCriteria}
            locationAvailable={!!userLocation}
          />
        </div>

        <div className="space-y-3">
          <SortControl
            value={criteria.sort}
            onChange={(sort) => setCriteria((prev) => ({ ...prev, sort }))}
            count={filtered.length}
            effectiveSort={effectiveSort}
          />
          <ParkingList parkings={filtered} tagSummaries={tagSummaries} />
        </div>
      </div>
    </div>
  );
}
