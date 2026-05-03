import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "大型車対応 駐車場ファインダー",
  description:
    "車幅2m近い大型車でも安心して停められる駐車場を、寸法・構造・距離・料金で素早く絞り込めます。",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ja">
      <body className="min-h-screen antialiased">
        <header className="border-b border-slate-200 bg-white">
          <div className="mx-auto max-w-5xl px-4 py-3">
            <h1 className="text-lg font-bold text-brand-dark">
              🚙 大型車対応 駐車場ファインダー
            </h1>
            <p className="text-xs text-slate-500">
              車幅2mでも安心。寸法・構造・距離で素早く絞り込み
            </p>
          </div>
        </header>
        <main className="mx-auto max-w-5xl px-4 py-4">{children}</main>
        <footer className="border-t border-slate-200 bg-white">
          <div className="mx-auto max-w-5xl px-4 py-3 text-xs text-slate-500">
            MVP / サンプルデータ駆動 — 駐車場情報は実在する保証はありません
          </div>
        </footer>
      </body>
    </html>
  );
}
