export type BigCarTagKind =
  | "spacious"
  | "tight"
  | "stuck"
  | "noMechanical"
  | "actualSize";

export interface BigCarTag {
  id: string;
  parkingId: string;
  kind: BigCarTagKind;
  vehicleWidthCm?: number;
  comment?: string;
  createdAt: string;
}

export type TagSummary = Record<BigCarTagKind, number>;

export const BIG_CAR_TAG_LABELS: Record<BigCarTagKind, string> = {
  spacious: "余裕あり",
  tight: "ギリギリ",
  stuck: "詰まった",
  noMechanical: "機械式不可",
  actualSize: "実測サイズ報告",
};

export const BIG_CAR_TAG_EMOJI: Record<BigCarTagKind, string> = {
  spacious: "👍",
  tight: "😅",
  stuck: "⚠️",
  noMechanical: "🏗",
  actualSize: "📐",
};
