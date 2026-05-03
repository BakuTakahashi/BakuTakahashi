export function formatYen(yen: number): string {
  return `¥${yen.toLocaleString("ja-JP")}`;
}

export function formatDistanceKm(km: number): string {
  if (km < 1) return `${Math.round(km * 1000)}m`;
  return `${km.toFixed(1)}km`;
}

export function formatCmToM(cm: number): string {
  return `${(cm / 100).toFixed(2)}m`;
}

export function formatKg(kg: number): string {
  return `${kg.toLocaleString("ja-JP")}kg`;
}
