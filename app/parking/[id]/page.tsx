import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { fetchParkingById, fetchParkings } from "@/lib/parkings";
import { GoogleMapEmbed } from "@/components/GoogleMapEmbed";
import { BigCarTagPanel } from "@/components/BigCarTagPanel";
import { formatCmToM, formatKg, formatYen } from "@/lib/format";
import { FACILITY_LABELS, STRUCTURE_LABELS } from "@/lib/labels";

export async function generateStaticParams() {
  const parkings = await fetchParkings();
  return parkings.map((p) => ({ id: p.id }));
}

interface PageProps {
  params: { id: string };
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const parking = await fetchParkingById(params.id);
  if (!parking) {
    return { title: "駐車場が見つかりません | 大型車対応 駐車場ファインダー" };
  }
  const widthM = formatCmToM(parking.vehicleLimit.maxWidthCm);
  const description = `${parking.address} | 平日 ${formatYen(parking.fee.weekdayHourlyYen)}/時・最大車幅 ${widthM}・${FACILITY_LABELS[parking.facilityType]}/${STRUCTURE_LABELS[parking.structure]}`;
  return {
    title: `${parking.name} | 大型車対応 駐車場ファインダー`,
    description,
    openGraph: {
      title: parking.name,
      description,
      type: "website",
    },
  };
}

export default async function ParkingDetailPage({ params }: PageProps) {
  const parking = await fetchParkingById(params.id);
  if (!parking) notFound();

  return (
    <div className="space-y-4">
      <Link
        href="/"
        className="inline-block text-sm text-brand hover:underline"
      >
        ← 一覧に戻る
      </Link>

      <header className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
        <h1 className="text-xl font-bold text-slate-900">{parking.name}</h1>
        <p className="text-sm text-slate-600">{parking.address}</p>
        <dl className="mt-3 grid grid-cols-2 gap-x-4 gap-y-1 text-sm text-slate-700 sm:grid-cols-4">
          <div>
            <dt className="text-xs text-slate-500">種別</dt>
            <dd>
              {FACILITY_LABELS[parking.facilityType]} / {STRUCTURE_LABELS[parking.structure]}
            </dd>
          </div>
          <div>
            <dt className="text-xs text-slate-500">料金 (平日)</dt>
            <dd>{formatYen(parking.fee.weekdayHourlyYen)} / 時</dd>
          </div>
          <div>
            <dt className="text-xs text-slate-500">最大車幅</dt>
            <dd className="font-semibold">
              {formatCmToM(parking.vehicleLimit.maxWidthCm)}
            </dd>
          </div>
          <div>
            <dt className="text-xs text-slate-500">最大重量</dt>
            <dd>{formatKg(parking.vehicleLimit.maxWeightKg)}</dd>
          </div>
        </dl>
        {parking.notes && (
          <p className="mt-3 rounded bg-slate-50 px-3 py-2 text-sm text-slate-700">
            {parking.notes}
          </p>
        )}
      </header>

      <section className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
        <h2 className="mb-2 text-base font-bold text-slate-900">
          📍 一般情報・口コミ・写真（Google マップ）
        </h2>
        <p className="mb-3 text-xs text-slate-500">
          一般的な口コミ・写真・経路は Google マップに任せています。
        </p>
        <GoogleMapEmbed query={`${parking.name} ${parking.address}`} />
      </section>

      <BigCarTagPanel parkingId={parking.id} />
    </div>
  );
}
