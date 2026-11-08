import { defineField, defineType } from "sanity";

export const seo = defineType({
  name: "seo",
  title: "SEO",
  type: "object",
  options: { collapsible: true, collapsed: true },
  fields: [
    defineField({
      name: "title",
      title: "頁面標題",
      description: "留空則使用品名。",
      type: "string",
      validation: (r) => r.max(60).warning("建議 60 字元以內"),
    }),
    defineField({
      name: "description",
      title: "頁面描述",
      description: "留空則自動取商品說明前段。",
      type: "text",
      rows: 3,
      validation: (r) => r.max(160).warning("建議 160 字元以內"),
    }),
    defineField({
      name: "ogImage",
      title: "分享圖",
      description: "留空則使用主圖。",
      type: "image",
    }),
  ],
});
