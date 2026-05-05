"use client";

import { useEffect, useMemo } from "react";
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

const ICON_BASE = "https://unpkg.com/leaflet@1.9.4/dist/images";

const defaultIcon = L.icon({
  iconUrl: `${ICON_BASE}/marker-icon.png`,
  iconRetinaUrl: `${ICON_BASE}/marker-icon-2x.png`,
  shadowUrl: `${ICON_BASE}/marker-shadow.png`,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

const bigCarFriendlyIcon = L.divIcon({
  className: "custom-marker-icon",
  html: `<div style="background:#0F766E;color:#fff;width:30px;height:30px;border-radius:50% 50% 50% 0;transform:rotate(-45deg);display:flex;align-items:center;justify-content:center;border:2px solid #fff;box-shadow:0 1px 4px rgba(0,0,0,0.4);font-weight:700;font-size:14px;"><span style="transform:rotate(45deg);">🚙</span></div>`,
  iconSize: [30, 30],
  iconAnchor: [15, 30],
  popupAnchor: [0, -30],
});

const standardIcon = L.divIcon({
  className: "custom-marker-icon",
  html: `<div style="background:#94a3b8;color:#fff;width:24px;height:24px;border-radius:50% 50% 50% 0;transform:rotate(-45deg);display:flex;align-items:center;justify-content:center;border:2px solid #fff;box-shadow:0 1px 4px rgba(0,0,0,0.4);font-size:12px;"><span style="transform:rotate(45deg);">P</span></div>`,
  iconSize: [24, 24],
  iconAnchor: [12, 24],
  popupAnchor: [0, -24],
});

const userIcon = L.divIcon({
  className: "user-marker-icon",
  html: `<div style="background:#2563eb;width:18px;height:18px;border-radius:50%;border:3px solid #fff;box-shadow:0 0 0 2px #2563eb;"></div>`,
  iconSize: [18, 18],
  iconAnchor: [9, 9],
});

interface Props {
  parkings: ParkingWithDistance[];
  userLocation: { lat: number; lng: number } | null;
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

export default function ParkingMap({ parkings, userLocation }: Props) {
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
        style={{ height: 500, width: "100%" }}
        scrollWheelZoom={true}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <BoundsUpdater bounds={bounds} />

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
          const isBigCarOk = p.vehicleLimit.maxWidthCm >= 1950;
          const icon = isBigCarOk
            ? bigCarFriendlyIcon
            : p.structure === "mechanical" || p.structure === "tower"
              ? standardIcon
              : defaultIcon;
          return (
            <Marker key={p.id} position={[p.lat, p.lng]} icon={icon}>
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
