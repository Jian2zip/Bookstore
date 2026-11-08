# 減屋

意識如錢一般在流動。

二手書與雜貨的小店網站。Next.js（App Router）+ TypeScript + Tailwind CSS 4 + Sanity。

## 開發

```bash
npm install
cp .env.example .env.local   # 不填 Sanity project ID 也能跑，會使用示範資料
npm run dev                  # http://localhost:3000
```

| 指令 | 用途 |
| --- | --- |
| `npm run dev` / `build` / `start` | 開發 / 建置 / 啟動 |
| `npm run lint` / `typecheck` | 檢查 |
| `npm run placeholders` | 重新產生示範用佔位圖（`public/placeholder/`） |

Sanity Studio 嵌在 `/studio`，需要先設定 `NEXT_PUBLIC_SANITY_PROJECT_ID`。

## 結構

```
app/
  layout.tsx         root layout：字型、主題、skip link
  (site)/            網站頁面與外框（導覽列、頁尾、換頁淡入）
    page.tsx         首頁商品牆（?type=books|goods、?sort=newest）
    shipping/        運送與付款（含退換貨）
    privacy/         隱私權政策（含 Cookie 設定）
    styleguide/      design token 與資料檢查（只在開發環境）
  studio/            Sanity Studio
  globals.css        design tokens（色彩、三級字級、間距、斷點、動態）
components/          商品牆、導覽、頁尾、SiteImage（延遲載入、模糊佔位、淡入）等
lib/
  data/              唯一的資料入口 index.ts；sanity.ts（GROQ + 轉換）；placeholder.ts（示範資料）
  i18n/              語系設定與字典（目前只有繁體中文）
  condition.ts       品相分級（近全新 / 良好 / 普通 / 有瑕疵）
  types.ts           前端資料型別
sanity/
  schemaTypes/       item、siteSettings、aboutPage、gallery 圖片／影片、seo
  structure.ts       Studio 側欄（在庫 / 已售出 / 全部、單例設定）
scripts/             佔位圖產生器
```

### 上架 / 售出規則

商品只有兩種狀態：**在庫**、**已售出**。`lib/data/index.ts` 的 `isListed()`（`status === "inStock" && stock > 0`）是唯一判斷依據，GROQ 查詢也做同樣的過濾。已售出的商品不會出現在牆面、篩選、相似商品和 sitemap；只有 `getItemBySlug()` 拿得到它，讓舊連結顯示「已售出」。

### 牆面排序

預設依商品的「牆面排序」數字由小到大排列；沒填的排在後面，依上架時間由新到舊。訪客點「最新」則全部改依上架時間排序。

## 進度

- [x] 1. 專案結構、design tokens、Sanity schema、示範資料
- [x] 2. 商品牆（篩選、狀態處理）、導覽與頁尾
- [ ] 3. 商品詳細頁（書／雜貨版型、品相、已售出頁）
- [ ] 4. 關於頁
- [ ] 5. 訂購清單、mailto、線上表單、自動確認信、Google Sheets 紀錄
- [ ] 6. SEO、效能、無障礙檢查與部署說明
