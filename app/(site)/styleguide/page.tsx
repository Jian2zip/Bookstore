/**
 * Styleguide — design tokens + data check. Development only (404 in production).
 */
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { SiteImage } from "@/components/SiteImage";
import { conditionLabel, CONDITIONS } from "@/lib/condition";
import {
  getAllItemsForDebug,
  getItemBySlug,
  getListedItems,
  getSiteSettings,
  getWallTiles,
  isListed,
} from "@/lib/data";
import { formatPrice, getDictionary } from "@/lib/i18n";
import { isSanityConfigured } from "@/sanity/env";

export const metadata: Metadata = {
  title: "Styleguide",
  robots: { index: false, follow: false },
};

const COLORS = [
  { token: "bg", dark: "#1d1717", light: "#f4f0ea", use: "頁面底色" },
  { token: "surface", dark: "#261f1e", light: "#ebe5dc", use: "抽屜、手機底部訂購列" },
  { token: "fg", dark: "#ece5dc", light: "#1d1717", use: "主要文字" },
  { token: "muted", dark: "#a39890", light: "#685d57", use: "次要文字、說明" },
  { token: "line", dark: "fg 14%", light: "fg 14%", use: "分隔線" },
  { token: "focus", dark: "#e8c48f", light: "#8a4f1d", use: "鍵盤焦點框" },
  { token: "placeholder", dark: "#2a2222", light: "#e4ddd2", use: "圖片載入前底色" },
];

const swatchClass: Record<string, string> = {
  bg: "bg-bg",
  surface: "bg-surface",
  fg: "bg-fg",
  muted: "bg-muted",
  line: "bg-line",
  focus: "bg-focus",
  placeholder: "bg-placeholder",
};

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="border-t border-line pt-6 pb-section">
      <h2 className="mb-8 text-meta text-muted">{title}</h2>
      {children}
    </section>
  );
}

export default async function Styleguide() {
  if (process.env.NODE_ENV === "production") notFound();
  const t = getDictionary();
  const [settings, all, listed, books, goods, tiles, soldLookup] = await Promise.all([
    getSiteSettings(),
    getAllItemsForDebug(),
    getListedItems("all"),
    getListedItems("book"),
    getListedItems("goods"),
    getWallTiles(),
    getItemBySlug("economics-of-silence"),
  ]);
  const hidden = all.filter((i) => !isListed(i));

  return (
    <div>

      <div className="pt-section pb-section">
        <h1 className="text-display">{settings.tagline}</h1>
        <p className="mt-4 max-w-measure text-muted">
          這一頁只在開發環境出現，用來檢查設計 token 與資料。右上角可切換深色與淺色。資料來源：{isSanityConfigured ? "Sanity" : "示範資料"}。
        </p>
      </div>

      {/* Colour */}
      <Section title="01 — 色彩">
        <ul className="grid grid-cols-2 gap-wall sm:grid-cols-4 lg:grid-cols-7">
          {COLORS.map((c) => (
            <li key={c.token}>
              <div className={`aspect-[4/5] border border-line ${swatchClass[c.token]}`} />
              <p className="mt-2 text-meta">{c.token}</p>
              <p className="tabular text-meta text-muted">
                {c.dark} / {c.light}
              </p>
              <p className="text-meta text-muted">{c.use}</p>
            </li>
          ))}
        </ul>
      </Section>

      {/* Type */}
      <Section title="02 — 字級（僅三級）">
        <dl className="grid gap-10">
          <div className="grid gap-2 md:grid-cols-[10rem_1fr]">
            <dt className="text-meta text-muted">display · 28→48px / 1.2</dt>
            <dd className="font-display text-display">河流的文法 A Quiet Room</dd>
          </div>
          <div className="grid gap-2 md:grid-cols-[10rem_1fr]">
            <dt className="text-meta text-muted">body · 15px / 1.85</dt>
            <dd className="max-w-measure">
              1998 年初版一刷，布面精裝。作者沿著一條河寫了十二篇散文，從上游的石頭寫到出海口的鹽。文字很慢，適合在通勤以外的時間讀。
            </dd>
          </div>
          <div className="grid gap-2 md:grid-cols-[10rem_1fr]">
            <dt className="text-meta text-muted">meta · 12px / 1.6</dt>
            <dd className="text-meta">
              河流的文法　林硯 · 良好　<span className="tabular">NT$280</span>
            </dd>
          </div>
        </dl>
      </Section>

      {/* Spacing */}
      <Section title="03 — 間距">
        <ul className="grid gap-4 text-meta">
          {[
            ["gutter", "w-gutter", "頁面左右留白 16→40px"],
            ["wall", "w-wall", "商品牆間距 12→28px"],
            ["nav", "w-nav", "導覽列高度 56px"],
            ["section", "w-section", "段落間距 64→128px"],
          ].map(([name, cls, desc]) => (
            <li key={name} className="flex items-center gap-4">
              <span className="w-20 text-muted">{name}</span>
              <span className={`h-3 bg-fg ${cls}`} />
              <span className="text-muted">{desc}</span>
            </li>
          ))}
          <li className="flex items-center gap-4">
            <span className="w-20 text-muted">measure</span>
            <span className="text-muted">內文欄寬 32em（約 32 個中文字）</span>
          </li>
        </ul>
      </Section>

      {/* Motion */}
      <Section title="04 — 動態">
        <ul className="grid gap-1 text-meta text-muted">
          <li>圖片淡入 700ms · 商品 hover 240ms（圖片微降透明度）· 換頁 280ms（View Transitions）</li>
          <li>單一緩動曲線 cubic-bezier(0.2, 0.6, 0.2, 1)，無彈跳、無視差。</li>
          <li>prefers-reduced-motion 時全部歸零。</li>
        </ul>
      </Section>

      {/* Condition grades */}
      <Section title="05 — 品相分級">
        <dl className="grid max-w-measure gap-3">
          {CONDITIONS.map((c) => (
            <div key={c.value} className="grid grid-cols-[5rem_1fr] gap-4">
              <dt>{c.label}</dt>
              <dd className="text-muted">{c.description}</dd>
            </div>
          ))}
        </dl>
      </Section>

      {/* Data check */}
      <Section title="06 — 資料檢查（隱藏邏輯）">
        <p className="mb-6 tabular text-meta text-muted">
          全部 {all.length} 件 · 牆面顯示 {listed.length} 件（書 {books.length} / 雜貨 {goods.length}）·
          已隱藏 {hidden.length} 件（{hidden.map((i) => i.sku).join(", ") || "無"}）· 穿插圖 {tiles.length} 張
        </p>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[40rem] text-left text-meta">
            <thead className="text-muted">
              <tr className="border-b border-line">
                {["SKU", "類型", "品名", "分類", "品相", "售價", "庫存", "狀態", "牆面"].map((h) => (
                  <th key={h} className="py-2 pr-4 font-normal">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="tabular">
              {all.map((i) => (
                <tr key={i.id} className={`border-b border-line ${isListed(i) ? "" : "text-muted line-through"}`}>
                  <td className="py-2 pr-4">{i.sku}</td>
                  <td className="pr-4">{i.type === "book" ? t.wall.books : t.wall.goods}</td>
                  <td className="pr-4">{i.title}</td>
                  <td className="pr-4">{i.category}</td>
                  <td className="pr-4">{conditionLabel(i.condition)}</td>
                  <td className="pr-4">{formatPrice(i.price)}</td>
                  <td className="pr-4">{i.stock}</td>
                  <td className="pr-4">{i.status === "inStock" ? "在庫" : "已售出"}</td>
                  <td>{isListed(i) ? "顯示" : "隱藏"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="mt-6 text-meta text-muted">
          舊連結測試：/item/economics-of-silence →{" "}
          {soldLookup
            ? soldLookup.status === "sold"
              ? `找得到，狀態為「已售出」，頁面顯示「${t.item.sold}」並設為 noindex。`
              : "找得到，狀態為在庫（不符預期）。"
            : "找不到（不符預期）。"}
        </p>
      </Section>

      {/* Images */}
      <Section title="07 — 圖片（保留原始比例、延遲載入、模糊佔位、淡入）">
        <ul className="grid grid-cols-2 items-start gap-wall md:grid-cols-3 lg:grid-cols-4">
          {listed.map((item, idx) => (
            <li key={item.id}>
              <SiteImage
                image={item.heroImage}
                sizes="(min-width: 64rem) 25vw, (min-width: 48rem) 33vw, 50vw"
                priority={idx < 4}
              />
              <p className="mt-2 text-meta">
                {item.type === "book" ? (
                  <>
                    {item.title}　{item.author} · {conditionLabel(item.condition)}
                  </>
                ) : (
                  <>
                    {item.title} · {item.category}
                  </>
                )}
                　<span className="tabular text-muted">{formatPrice(item.price)}</span>
              </p>
            </li>
          ))}
        </ul>
      </Section>

    </div>
  );
}
