import { defineField, defineType } from "sanity";

/** Singleton. */
export const aboutPage = defineType({
  name: "aboutPage",
  title: "關於頁",
  type: "document",
  fields: [
    defineField({ name: "tagline", title: "標語", type: "string", initialValue: "意識如錢一般在流動。", validation: (r) => r.required() }),
    defineField({ name: "intro", title: "店家介紹（選填）", description: "空一行分段。", type: "text", rows: 6 }),
    defineField({
      name: "buyingNote",
      title: "收書 / 估價說明（選填）",
      description: "例如：歡迎寄書單與照片到信箱估價。",
      type: "text",
      rows: 4,
    }),
  ],
  preview: { prepare: () => ({ title: "關於頁" }) },
});
