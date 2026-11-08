# 減屋

意識如錢一般在流動。

二手書與雜貨的小店網站。Next.js（App Router，靜態輸出）+ TypeScript + Tailwind CSS 4 + Sanity，部署在 GitHub Pages。

網址（啟用後）：https://jian2zip.github.io/Bookstore/

## 上線到 GitHub Pages

1. **啟用 Pages（只需一次）**：repo 的 Settings → Pages → Build and deployment → Source 選 **GitHub Actions**。
2. **合併到 `main`**：`.github/workflows/deploy-pages.yml` 會在 `main` 有新 commit 時自動建置並發布（約 2 分鐘）。也可以在 Actions 分頁手動執行「Deploy to GitHub Pages」。

建置時會自動帶入 Pages 的網址路徑（`/Bookstore`），所有連結、圖片和分享預覽圖都會指到正確位置。

**改用 Sanity 的內容**：在 Settings → Secrets and variables → Actions → Variables 新增 `SANITY_PROJECT_ID`（和 `SANITY_DATASET`，預設 `production`）。沒設定時使用示範資料。

**內容更新**：GitHub Pages 是靜態網站，Sanity 的修改要重新建置才會上線。手動執行一次 workflow 即可；若要商品一標成「已售出」就自動下架，在 Sanity 設定 webhook 呼叫 GitHub 的 `repository_dispatch` API（`event_type: sanity-publish`）。

## 開發

```bash
npm install
cp .env.example .env.local   # 不填 Sanity project ID 也能跑，會使用示範資料
npm run dev                  # http://localhost:3000
```

| 指令 | 用途 |
| --- | --- |
| `npm run dev` | 開發 |
| `npm run build` | 靜態輸出到 `out/` |
| `npm run preview` | 在本機預覽 `out/` |
| `npm run lint` / `typecheck` | 檢查 |
| `npm run studio` / `studio:deploy` | 本機開啟 Sanity Studio／發布到 `*.sanity.studio` |
| `npm run placeholders` | 重新產生示範用佔位圖（`public/placeholder/`） |

本機模擬 GitHub Pages 路徑：`NEXT_PUBLIC_BASE_PATH=/Bookstore npm run build`，再把 `out/` 放在任意靜態伺服器的 `/Bookstore/` 底下。

## 結構

```
app/
  layout.tsx         root layout：字型、主題、skip link
  (site)/            網站頁面與外框（導覽列、頁尾、換頁淡入）
    page.tsx         首頁商品牆（?type=books|goods、?sort=newest，在瀏覽器端篩選）
    item/[slug]/     商品詳細頁（書／雜貨、品相、Email 訂購、已售出提示）
    shipping/        運送與付款（含退換貨）
    privacy/         隱私權政策（含 Cookie 設定）
    styleguide/      design token 與資料檢查（只在開發環境）
  globals.css        design tokens（色彩、三級字級、間距、斷點、動態）
components/          商品牆、導覽、頁尾、SiteImage（延遲載入、模糊佔位、淡入）等
lib/
  data/              唯一的資料入口 index.ts（建置時讀取）；sanity.ts（GROQ + 轉換）；placeholder.ts（示範資料）
  wall.ts            上架判斷、篩選、排序（伺服器與瀏覽器共用）
  paths.ts           GitHub Pages 網址路徑處理
  image-loader.ts    next/image loader：Sanity CDN 縮圖、本機圖片加路徑
  i18n/              語系設定與字典（目前只有繁體中文）
  condition.ts       品相分級（近全新 / 良好 / 普通 / 有瑕疵）
  types.ts           前端資料型別
sanity/
  schemaTypes/       item、siteSettings、aboutPage、gallery 圖片／影片、seo
  structure.ts       Studio 側欄（在庫 / 已售出 / 全部、單例設定）
sanity.config.ts     Studio 設定（獨立執行，不在網站內）
.github/workflows/   GitHub Pages 自動部署
scripts/             佔位圖產生器
```

### 上架 / 售出規則

商品只有兩種狀態：**在庫**、**已售出**。`lib/wall.ts` 的 `isListed()`（`status === "inStock" && stock > 0`）是唯一判斷依據。已售出的商品不會出現在牆面、篩選和相似商品；但仍會輸出它的頁面，讓舊連結顯示「此商品已售出」（noindex），而不是 404。

### 牆面排序

預設依商品的「牆面排序」數字由小到大排列；沒填的排在後面，依上架時間由新到舊。訪客點「最新」則全部改依上架時間排序。

### Email 訂購

「Email 訂購」會開啟訪客的郵件程式，收件人、主旨（`訂購：品名（SKU）`）和內文（品名、編號、售價、雜貨數量，以及要填寫的姓名、電話、取貨門市、備註）都已填好。組信邏輯在 `lib/order.ts`，之後的訂購清單會沿用。網站上不會出現任何付款資訊。

## 進度

- [x] 1. 專案結構、design tokens、Sanity schema、示範資料
- [x] 2. 商品牆（篩選、狀態處理）、導覽與頁尾
- [x] 3. 商品詳細頁（書／雜貨版型、品相、已售出頁）
- [ ] 4. 關於頁（導覽列的「關於」連結先隱藏，完成後再打開）
- [ ] 5. 訂購清單、mailto、線上表單、自動確認信、Google Sheets 紀錄
- [ ] 6. SEO、效能、無障礙檢查與部署說明
