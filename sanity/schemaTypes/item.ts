import { defineArrayMember, defineField, defineType } from "sanity";
import { CONDITIONS } from "../../lib/condition";

type Doc = { type?: "book" | "goods" } | undefined;
const notBook = ({ document }: { document?: unknown }) => (document as Doc)?.type !== "book";
const notGoods = ({ document }: { document?: unknown }) => (document as Doc)?.type !== "goods";

/** Required only when the item is of the given type. */
const requiredFor =
  (type: "book" | "goods") =>
  (value: unknown, context: { document?: unknown }) =>
    (context.document as Doc)?.type === type && (value === undefined || value === "")
      ? "此欄位必填"
      : true;

export const item = defineType({
  name: "item",
  title: "商品",
  type: "document",
  groups: [
    { name: "main", title: "基本", default: true },
    { name: "media", title: "圖片" },
    { name: "details", title: "規格與品相" },
    { name: "seo", title: "SEO" },
  ],
  fieldsets: [
    { name: "book", title: "書籍資訊", options: { columns: 2 } },
    { name: "goods", title: "雜貨資訊", options: { columns: 2 } },
  ],
  fields: [
    // ── Basic ──────────────────────────────────────────
    defineField({
      name: "type",
      title: "類型",
      type: "string",
      group: "main",
      options: {
        list: [
          { title: "二手書", value: "book" },
          { title: "雜貨", value: "goods" },
        ],
        layout: "radio",
        direction: "horizontal",
      },
      initialValue: "book",
      validation: (r) => r.required(),
    }),
    defineField({
      name: "status",
      title: "狀態",
      description: "設為「已售出」後，商品會立即從牆面、篩選、相似商品和 sitemap 消失。",
      type: "string",
      group: "main",
      options: {
        list: [
          { title: "在庫", value: "inStock" },
          { title: "已售出", value: "sold" },
        ],
        layout: "radio",
        direction: "horizontal",
      },
      initialValue: "inStock",
      validation: (r) => r.required(),
    }),
    defineField({
      name: "title",
      title: "品名 / 書名",
      type: "string",
      group: "main",
      validation: (r) => r.required(),
    }),
    defineField({
      name: "slug",
      title: "網址代稱",
      type: "slug",
      group: "main",
      options: { source: "title", maxLength: 96 },
      validation: (r) => r.required(),
    }),
    defineField({
      name: "sku",
      title: "SKU",
      description: "書籍建議 B 開頭、雜貨 G 開頭，例如 B012。",
      type: "string",
      group: "main",
      validation: (r) =>
        r.required().custom(async (value, context) => {
          if (!value) return true;
          const client = context.getClient({ apiVersion: "2026-11-01" });
          const id = context.document?._id.replace(/^drafts\./, "");
          const count = await client.fetch<number>(
            `count(*[_type == "item" && sku == $sku && !(_id in [$id, "drafts." + $id])])`,
            { sku: value, id },
          );
          return count === 0 ? true : "SKU 已被其他商品使用";
        }),
    }),
    defineField({
      name: "category",
      title: "分類",
      description: "例如：文學、散文、攝影、自然、外文；文具、器物、布物。",
      type: "string",
      group: "main",
      validation: (r) => r.required(),
    }),
    defineField({
      name: "tags",
      title: "標籤",
      type: "array",
      group: "main",
      of: [defineArrayMember({ type: "string" })],
      options: { layout: "tags" },
    }),
    defineField({
      name: "price",
      title: "售價（NT$）",
      type: "number",
      group: "main",
      validation: (r) => r.required().integer().min(0),
    }),
    defineField({
      name: "stock",
      title: "庫存",
      description: "二手書固定為 1。雜貨庫存大於 1 時，訂購區才會顯示數量。",
      type: "number",
      group: "main",
      initialValue: 1,
      validation: (r) =>
        r
          .required()
          .integer()
          .min(0)
          .custom((value, context) =>
            (context.document as Doc)?.type === "book" && value !== 1 ? "二手書庫存必須為 1" : true,
          ),
    }),
    defineField({
      name: "sortOrder",
      title: "牆面排序（選填）",
      description: "數字小的排前面。留空的商品排在後面，依上架時間由新到舊。訪客點「最新」時改依上架時間排序。",
      type: "number",
      group: "main",
      validation: (r) => r.integer(),
    }),
    defineField({
      name: "publishedAt",
      title: "上架時間",
      description: "用於「最新」排序。",
      type: "datetime",
      group: "main",
      initialValue: () => new Date().toISOString(),
    }),

    // ── Media ──────────────────────────────────────────
    defineField({
      name: "heroImage",
      title: "主圖",
      description: "牆面與詳細頁首圖。保留原始比例，不會被裁成統一尺寸。",
      type: "image",
      group: "media",
      options: { hotspot: true },
      fields: [
        defineField({
          name: "alt",
          title: "替代文字（alt）",
          type: "string",
          validation: (r) => r.required(),
        }),
      ],
      validation: (r) => r.required(),
    }),
    defineField({
      name: "gallery",
      title: "圖片長捲",
      description:
        "直幅與橫幅交錯。書籍請包含：封面、書脊、書口、內頁、瑕疵特寫。雜貨請包含各角度與細節。",
      type: "array",
      group: "media",
      of: [defineArrayMember({ type: "galleryImage" }), defineArrayMember({ type: "galleryVideo" })],
      options: { layout: "grid" },
      validation: (r) => r.min(1),
    }),

    // ── Description & condition ────────────────────────
    defineField({
      name: "description",
      title: "簡短說明",
      description:
        "約 50–200 字，空一行分段。書籍：版本資訊與值得一讀的理由。雜貨：材質、用途與來歷。",
      type: "text",
      rows: 6,
      group: "details",
      validation: (r) => r.required().max(600).warning("建議精簡在 200 字左右"),
    }),
    defineField({
      name: "condition",
      title: "品相",
      type: "string",
      group: "details",
      options: {
        list: CONDITIONS.map((c) => ({ title: `${c.label} — ${c.description}`, value: c.value })),
        layout: "radio",
      },
      validation: (r) => r.required(),
    }),
    defineField({
      name: "conditionNotes",
      title: "品相 / 瑕疵說明",
      type: "text",
      rows: 3,
      group: "details",
    }),

    // ── Book-only ──────────────────────────────────────
    defineField({ name: "author", title: "作者", type: "string", group: "details", fieldset: "book", hidden: notBook, validation: (r) => r.custom(requiredFor("book")) }),
    defineField({ name: "translator", title: "譯者", type: "string", group: "details", fieldset: "book", hidden: notBook }),
    defineField({ name: "publisher", title: "出版社", type: "string", group: "details", fieldset: "book", hidden: notBook, validation: (r) => r.custom(requiredFor("book")) }),
    defineField({ name: "year", title: "出版年", type: "number", group: "details", fieldset: "book", hidden: notBook, validation: (r) => r.integer().min(1800).max(2100) }),
    defineField({ name: "edition", title: "版次", description: "例如：初版一刷", type: "string", group: "details", fieldset: "book", hidden: notBook }),
    defineField({ name: "language", title: "語言", type: "string", group: "details", fieldset: "book", hidden: notBook, initialValue: "繁體中文" }),
    defineField({
      name: "isbn",
      title: "ISBN（選填）",
      type: "string",
      group: "details",
      fieldset: "book",
      hidden: notBook,
      validation: (r) =>
        r.custom((v?: string) =>
          !v || /^(97[89])?\d{9}[\dX]$/.test(v.replace(/[-\s]/g, "")) ? true : "ISBN 格式不正確",
        ),
    }),

    // ── Goods-only ─────────────────────────────────────
    defineField({ name: "dimensions", title: "尺寸", description: "例如：寬 10 × 深 8 × 高 14 cm", type: "string", group: "details", fieldset: "goods", hidden: notGoods }),
    defineField({ name: "material", title: "材質", type: "string", group: "details", fieldset: "goods", hidden: notGoods }),
    defineField({ name: "origin", title: "產地 / 來歷（選填）", type: "string", group: "details", fieldset: "goods", hidden: notGoods }),

    // ── SEO ────────────────────────────────────────────
    defineField({ name: "seo", title: "SEO", type: "seo", group: "seo" }),
  ],
  orderings: [
    { title: "牆面排序", name: "wall", by: [{ field: "sortOrder", direction: "asc" }, { field: "publishedAt", direction: "desc" }] },
    { title: "最新上架", name: "newest", by: [{ field: "publishedAt", direction: "desc" }] },
    { title: "SKU", name: "sku", by: [{ field: "sku", direction: "asc" }] },
  ],
  preview: {
    select: { title: "title", sku: "sku", status: "status", price: "price", media: "heroImage" },
    prepare: ({ title, sku, status, price, media }) => ({
      title,
      subtitle: [sku, price != null ? `NT$${price}` : null, status === "sold" ? "已售出" : null]
        .filter(Boolean)
        .join(" · "),
      media,
    }),
  },
});
