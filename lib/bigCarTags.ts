import type { BigCarTag, BigCarTagKind, TagSummary } from "@/types/bigCarTag";

const STORAGE_KEY = "bigCarTags.v1";
const ALL_KINDS: BigCarTagKind[] = [
  "spacious",
  "tight",
  "stuck",
  "noMechanical",
  "actualSize",
];

function emptySummary(): TagSummary {
  return {
    spacious: 0,
    tight: 0,
    stuck: 0,
    noMechanical: 0,
    actualSize: 0,
  };
}

function localDateKey(input: Date | string = new Date()): string {
  const d = typeof input === "string" ? new Date(input) : input;
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

function readAll(): BigCarTag[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? (parsed as BigCarTag[]) : [];
  } catch {
    return [];
  }
}

function writeAll(tags: BigCarTag[]): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(tags));
  } catch {
    // Quota exceeded or storage unavailable
  }
}

export function getTagsByParking(parkingId: string): BigCarTag[] {
  return readAll().filter((t) => t.parkingId === parkingId);
}

export function summarize(tags: BigCarTag[]): TagSummary {
  const sum = emptySummary();
  for (const t of tags) {
    if (ALL_KINDS.includes(t.kind)) {
      sum[t.kind] += 1;
    }
  }
  return sum;
}

export function getSummaryByParking(parkingId: string): TagSummary {
  return summarize(getTagsByParking(parkingId));
}

export function totalCount(summary: TagSummary): number {
  return ALL_KINDS.reduce((acc, k) => acc + summary[k], 0);
}

interface AddTagInput {
  parkingId: string;
  kind: BigCarTagKind;
  vehicleWidthCm?: number;
  comment?: string;
}

export type AddTagResult =
  | { ok: true; tag: BigCarTag }
  | { ok: false; reason: "duplicate" | "unavailable" };

export function addTag(input: AddTagInput): AddTagResult {
  if (typeof window === "undefined") return { ok: false, reason: "unavailable" };
  const all = readAll();
  const today = localDateKey();
  const duplicate = all.some(
    (t) =>
      t.parkingId === input.parkingId &&
      t.kind === input.kind &&
      localDateKey(t.createdAt) === today,
  );
  if (duplicate) return { ok: false, reason: "duplicate" };

  const id =
    typeof crypto !== "undefined" && "randomUUID" in crypto
      ? crypto.randomUUID()
      : `${Date.now()}-${Math.random().toString(36).slice(2)}`;
  const tag: BigCarTag = {
    id,
    parkingId: input.parkingId,
    kind: input.kind,
    vehicleWidthCm: input.vehicleWidthCm,
    comment: input.comment?.slice(0, 100),
    createdAt: new Date().toISOString(),
  };
  writeAll([...all, tag]);
  return { ok: true, tag };
}

export function getAllSummariesByParking(): Record<string, TagSummary> {
  const all = readAll();
  const map: Record<string, TagSummary> = {};
  for (const t of all) {
    if (!map[t.parkingId]) map[t.parkingId] = emptySummary();
    if (ALL_KINDS.includes(t.kind)) map[t.parkingId][t.kind] += 1;
  }
  return map;
}
