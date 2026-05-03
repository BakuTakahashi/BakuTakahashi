export type GeoState =
  | { kind: "idle" }
  | { kind: "loading" }
  | { kind: "ok"; lat: number; lng: number }
  | { kind: "denied" }
  | { kind: "unavailable" }
  | { kind: "error"; message: string };

export function getCurrentPosition(): Promise<GeoState> {
  return new Promise((resolve) => {
    if (typeof navigator === "undefined" || !navigator.geolocation) {
      resolve({ kind: "unavailable" });
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (pos) =>
        resolve({ kind: "ok", lat: pos.coords.latitude, lng: pos.coords.longitude }),
      (err) => {
        if (err.code === err.PERMISSION_DENIED) resolve({ kind: "denied" });
        else if (err.code === err.POSITION_UNAVAILABLE) resolve({ kind: "unavailable" });
        else resolve({ kind: "error", message: err.message });
      },
      { enableHighAccuracy: false, timeout: 10000, maximumAge: 60000 },
    );
  });
}
