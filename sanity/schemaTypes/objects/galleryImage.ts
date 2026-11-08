import { defineField, defineType } from "sanity";

export const orientationField = defineField({
  name: "orientation",
  title: "版型",
  description: "直幅 4:5 或橫幅 16:9。詳細頁會依此交錯排列。",
  type: "string",
  options: {
    list: [
      { title: "直幅 4:5", value: "portrait" },
      { title: "橫幅 16:9", value: "landscape" },
    ],
    layout: "radio",
    direction: "horizontal",
  },
  initialValue: "portrait",
  validation: (r) => r.required(),
});

export const galleryImage = defineType({
  name: "galleryImage",
  title: "圖片",
  type: "image",
  options: { hotspot: true },
  fields: [
    defineField({
      name: "alt",
      title: "替代文字（alt）",
      description: "描述畫面內容，例如「書口，略有淡黃」。",
      type: "string",
      validation: (r) => r.required(),
    }),
    orientationField,
  ],
  preview: {
    select: { media: "asset", title: "alt", subtitle: "orientation" },
  },
});
