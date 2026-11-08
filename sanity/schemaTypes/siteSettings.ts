import { defineArrayMember, defineField, defineType } from "sanity";

/** Singleton. Optional fields left empty are simply not rendered on the site. */
export const siteSettings = defineType({
  name: "siteSettings",
  title: "網站設定",
  type: "document",
  groups: [
    { name: "shop", title: "店家", default: true },
    { name: "contact", title: "聯絡" },
    { name: "shipping", title: "運送與付款" },
    { name: "wall", title: "商品牆" },
  ],
  fields: [
    defineField({ name: "shopName", title: "店名", type: "string", group: "shop", initialValue: "減屋", validation: (r) => r.required() }),
    defineField({ name: "tagline", title: "標語", type: "string", group: "shop", initialValue: "意識如錢一般在流動。", validation: (r) => r.required() }),
    defineField({ name: "footerText", title: "頁尾文字（選填）", type: "text", rows: 2, group: "shop" }),

    defineField({ name: "email", title: "訂購信箱", type: "string", group: "contact", initialValue: "jian2survey@gmail.com", validation: (r) => r.required().email() }),
    defineField({ name: "phone", title: "電話（選填）", type: "string", group: "contact" }),
    defineField({ name: "address", title: "地址（選填）", type: "text", rows: 2, group: "contact" }),
    defineField({
      name: "socialLinks",
      title: "社群連結（選填）",
      type: "array",
      group: "contact",
      of: [
        defineArrayMember({
          type: "object",
          name: "socialLink",
          fields: [
            defineField({ name: "label", title: "名稱", type: "string", validation: (r) => r.required() }),
            defineField({ name: "url", title: "網址", type: "url", validation: (r) => r.required() }),
          ],
          preview: { select: { title: "label", subtitle: "url" } },
        }),
      ],
    }),
    defineField({ name: "newsletterUrl", title: "電子報訂閱連結（選填）", type: "url", group: "contact" }),

    defineField({
      name: "shipping",
      title: "運送",
      type: "object",
      group: "shipping",
      fields: [
        defineField({ name: "method", title: "寄送方式", type: "string", initialValue: "超商店到店" }),
        defineField({ name: "dispatchTime", title: "出貨時間（選填）", description: "例如：確認付款後 3 個工作天內寄出", type: "string" }),
      ],
    }),
    defineField({
      name: "shippingNotes",
      title: "運送與付款說明頁內容",
      description: "付款方式一律以 Email 回覆告知；此處請勿填寫帳號或付款資訊。",
      type: "array",
      group: "shipping",
      of: [defineArrayMember({ type: "block" })],
    }),
    defineField({
      name: "returnsPolicy",
      title: "退換貨說明",
      type: "array",
      group: "shipping",
      of: [defineArrayMember({ type: "block" })],
    }),

    defineField({
      name: "wallTiles",
      title: "穿插圖片（選填）",
      description: "只放圖、不連結的畫面（書架一角、陳列、書脊特寫），穿插在商品牆中製造節奏。",
      type: "array",
      group: "wall",
      of: [
        defineArrayMember({
          type: "object",
          name: "wallTile",
          fields: [
            defineField({
              name: "image",
              title: "圖片",
              type: "image",
              options: { hotspot: true },
              fields: [defineField({ name: "alt", title: "替代文字（alt）", type: "string", validation: (r) => r.required() })],
              validation: (r) => r.required(),
            }),
            defineField({ name: "position", title: "插在第幾件商品之後", type: "number", validation: (r) => r.required().integer().min(0) }),
          ],
          preview: {
            select: { media: "image", title: "image.alt", position: "position" },
            prepare: ({ media, title, position }) => ({ media, title, subtitle: `第 ${position} 件之後` }),
          },
        }),
      ],
    }),
  ],
  preview: { prepare: () => ({ title: "網站設定" }) },
});
