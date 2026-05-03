"use client";

import { useEffect, useState } from "react";
import {
  BIG_CAR_TAG_EMOJI,
  BIG_CAR_TAG_LABELS,
  type BigCarTagKind,
  type TagSummary,
} from "@/types/bigCarTag";
import {
  addTag,
  getSummaryByParking,
  totalCount,
} from "@/lib/bigCarTags";

const ALL_KINDS: BigCarTagKind[] = [
  "spacious",
  "tight",
  "stuck",
  "noMechanical",
  "actualSize",
];

interface Props {
  parkingId: string;
}

export function BigCarTagPanel({ parkingId }: Props) {
  const [summary, setSummary] = useState<TagSummary>({
    spacious: 0,
    tight: 0,
    stuck: 0,
    noMechanical: 0,
    actualSize: 0,
  });
  const [toast, setToast] = useState<string | null>(null);

  useEffect(() => {
    setSummary(getSummaryByParking(parkingId));
  }, [parkingId]);

  const total = totalCount(summary);
  const max = Math.max(1, ...ALL_KINDS.map((k) => summary[k]));

  const handlePost = (kind: BigCarTagKind) => {
    const result = addTag({ parkingId, kind });
    if (result.ok) {
      setSummary(getSummaryByParking(parkingId));
      setToast(`「${BIG_CAR_TAG_LABELS[kind]}」を投稿しました`);
    } else if (result.reason === "duplicate") {
      setToast("同じタグは1日1回までです");
    } else {
      setToast("投稿に失敗しました");
    }
    setTimeout(() => setToast(null), 2500);
  };

  return (
    <section className="space-y-4 rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
      <header>
        <h2 className="text-base font-bold text-slate-900">
          🏷 大型車視点タグ
          <span className="ml-2 text-xs font-normal text-slate-500">
            （{total}件の声）
          </span>
        </h2>
        <p className="mt-1 text-xs text-slate-500">
          実際に駐車したドライバーからの大型車視点の声をボタン1タップで投稿・閲覧できます。
        </p>
      </header>

      <div className="space-y-2">
        {ALL_KINDS.map((kind) => (
          <div key={kind} className="flex items-center gap-3 text-sm">
            <span className="w-28 shrink-0 text-slate-700">
              {BIG_CAR_TAG_EMOJI[kind]} {BIG_CAR_TAG_LABELS[kind]}
            </span>
            <div className="h-3 flex-1 overflow-hidden rounded-full bg-slate-100">
              <div
                className="h-full bg-brand transition-all"
                style={{ width: `${(summary[kind] / max) * 100}%` }}
              />
            </div>
            <span className="w-8 shrink-0 text-right text-xs font-semibold text-slate-600">
              {summary[kind]}
            </span>
          </div>
        ))}
      </div>

      <div>
        <p className="mb-2 text-xs font-semibold text-slate-700">投稿する</p>
        <div className="flex flex-wrap gap-2">
          {ALL_KINDS.map((kind) => (
            <button
              key={kind}
              type="button"
              onClick={() => handlePost(kind)}
              className="rounded-lg border border-brand bg-white px-3 py-1.5 text-xs font-semibold text-brand hover:bg-brand hover:text-white"
            >
              {BIG_CAR_TAG_EMOJI[kind]} {BIG_CAR_TAG_LABELS[kind]}
            </button>
          ))}
        </div>
      </div>

      {toast && (
        <div className="rounded-lg bg-slate-900 px-3 py-2 text-xs text-white">
          {toast}
        </div>
      )}

      <p className="text-[10px] text-slate-400">
        ※ MVP版: タグはあなたのブラウザにのみ保存され、他ユーザーとは共有されません。
      </p>
    </section>
  );
}
