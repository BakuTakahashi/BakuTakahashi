"use client";

import { useEffect, useMemo, useRef } from "react";
import {
  MapContainer,
  Marker,
  Popup,
  TileLayer,
  useMap,
  Circle,
} from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import Link from "next/link";
import type { ParkingWithDistance } from "@/types/parking";
import { formatDistanceKm, formatYen, formatCmToM } from "@/lib/format";

function pinIcon(opts: {
  color: string;
  emoji: string;
  size: number;
  selected?: boolean;
}) {
  const ring = opts.selected
    ? `box-shadow:0 0 0 4px rgba(245,158,11,0.85),0 1px 4px rgba(0,0,0,0.4);`
    : `box-shadow:0 1px 4px rgba(0,0,0,0.4);`;
  return L.divIcon({
    className: "custom-marker-icon",
    html: `<div style="background:${opts.color};color:#fff;width:${opts.size}px;height:${opts.size}px;border-radius:50% 50% 50% 0;transform:rotate(-45deg);display:flex;align-items:center;justify-content:center;border:2px solid #fff;${ring}font-weight:700;font-size:${Math.round(opts.size * 0.45)}px;"><span style="transform:rotate(45deg);">${opts.emoji}</span></div>`,
    iconSize: [opts.size, opts.size],
    iconAnchor: [opts.size / 2, opts.size],
    popupAnchor: [0, -opts.size],
  });
}

const userIcon = L.divIcon({
  className: "user-marker-icon",
  html: `<div style="background:#2563eb;width:18px;height:18px;border-radius:50%;border:3px solid #fff;box-shadow:0 0 0 2px #2563eb;"></div>`,
  iconSize: [18, 18],
  iconAnchor: [9, 9],
});

interface Props {
  parkings: ParkingWithDistance[];
  userLocation: { lat: number; lng: number } | null;
  selectedId: string | null;
  highlightedId: string | null;
  onSelect: (id: string | null) => void;
}

interface BoundsUpdaterProps {
  bounds: L.LatLngBoundsExpression | null;
}

function BoundsUpdater({ bounds }: BoundsUpdaterProps) {
  const map = useMap();
  useEffect(() => {
    if (bounds) {
      map.fitBounds(bounds, { padding: [40, 40], maxZoom: 14 });
    }
  }, [bounds, map]);
  return null;
}

function PanToSelected({
  parkings,
  selectedId,
}: {
  parkings: ParkingWithDistance[];
  selectedId: string | null;
}) {
  const map = useMap();
  useEffect(() => {
    if (!selectedId) return;
    const target = parkings.find((p) => p.id === selectedId);
    if (!target) return;
    map.flyTo([target.lat, target.lng], Math.max(map.getZoom(), 14), {
      duration: 0.6,
    });
  }, [selectedId, parkings, map]);
  return null;
}

function category(p: ParkingWithDistance): {
  color: string;
  emoji: string;
  label: string;
} {
  const isBigCarOk = p.vehicleLimit.maxWidthCm >= 1950;
  if (isBigCarOk) return { color: "#0F766E", emoji: "🚙", label: "大型OK" };
  if (p.structure === "mechanical" || p.structure === "tower")
    return { color: "#94a3b8", emoji: "P", label: "機械式・タワー" };
  return { color: "#3b82f6", emoji: "P", label: "標準" };
}

export default function ParkingMap({
  parkings,
  userLocation,
  selectedId,
  highlightedId,
  onSelect,
}: Props) {
  const markerRefs = useRef<Record<string, L.Marker | null>>({});

  const bounds = useMemo<L.LatLngBoundsExpression | null>(() => {
    const points: [number, number][] = parkings.map((p) => [p.lat, p.lng]);
    if (userLocation) points.push([userLocation.lat, userLocation.lng]);
    if (points.length === 0) return null;
    if (points.length === 1) {
      const [lat, lng] = points[0];
      return [
        [lat - 0.01, lng - 0.01],
        [lat + 0.01, lng + 0.01],
      ];
    }
    return points;
  }, [parkings, userLocation]);

  useEffect(() => {
    if (!selectedId) return;
    const m = markerRefs.current[selectedId];
    if (m) m.openPopup();
  }, [selectedId]);

  const center: [number, number] = userLocation
    ? [userLocation.lat, userLocation.lng]
    : parkings.length > 0
      ? [parkings[0].lat, parkings[0].lng]
      : [35.6812, 139.7671];

  return (
    <div className="overflow-hidden rounded-xl border border-slate-200">
      <MapContainer
        center={center}
        zoom={12}
        style={{ height: 450, width: "100%" }}
        scrollWheelZoom={true}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <BoundsUpdater bounds={bounds} />
        <PanToSelected parkings={parkings} selectedId={selectedId} />

        {userLocation && (
          <>
            <Marker
              position={[userLocation.lat, userLocation.lng]}
              icon={userIcon}
            >
              <Popup>現在地</Popup>
            </Marker>
            <Circle
              center={[userLocation.lat, userLocation.lng]}
              radius={300}
              pathOptions={{ color: "#2563eb", fillOpacity: 0.1, weight: 1 }}
            />
          </>
        )}

        {parkings.map((p) => {
          const cat = category(p);
          const isHighlighted = highlightedId === p.id;
          const isSelected = selectedId === p.id;
          const size = isHighlighted || isSelected ? 38 : 26;
          const icon = pinIcon({
            color: cat.color,
            emoji: cat.emoji,
            size,
            selected: isSelected,
          });
          return (
            <Marker
              key={p.id}
              position={[p.lat, p.lng]}
              icon={icon}
              ref={(el) => {
                markerRefs.current[p.id] = el;
              }}
              eventHandlers={{
                click: () => onSelect(p.id),
                popupclose: () => {
                  if (selectedId === p.id) onSelect(null);
                },
              }}
            >
              <Popup>
                <div className="space-y-1 text-sm">
                  <div className="font-bold">{p.name}</div>
                  <div className="text-xs text-slate-600">{p.address}</div>
                  <div className="flex flex-wrap gap-x-3 gap-y-0.5 text-xs">
                    {p.distanceKm !== undefined && (
                      <span>距離: {formatDistanceKm(p.distanceKm)}</span>
                    )}
                    <span>料金: {formatYen(p.fee.weekdayHourlyYen)}/h</span>
                  </div>
                  <div className="text-xs">
                    最大車幅: <b>{formatCmToM(p.vehicleLimit.maxWidthCm)}</b>
                  </div>
                  <Link
                    href={`/parking/${p.id}`}
                    className="inline-block pt-1 text-xs font-semibold text-brand hover:underline"
                  >
                    詳細を見る →
                  </Link>
                </div>
              </Popup>
            </Marker>
          );
        })}
      </MapContainer>
      <div className="flex flex-wrap gap-3 bg-slate-50 px-3 py-2 text-xs text-slate-600">
        <span className="flex items-center gap-1">
          <span className="inline-block h-3 w-3 rounded-full bg-brand"></span>
          大型車OK (車幅1.95m+)
        </span>
        <span className="flex items-center gap-1">
          <span className="inline-block h-3 w-3 rounded-full bg-blue-500"></span>
          標準サイズ
        </span>
        <span className="flex items-center gap-1">
          <span className="inline-block h-3 w-3 rounded-full bg-slate-400"></span>
          機械式・タワー式（大型不可）
        </span>
      </div>
    </div>
  );
}
