import { defineField, defineType } from "sanity";
import { orientationField } from "./galleryImage";

export const galleryVideo = defineType({
  name: "galleryVideo",
  title: "影片",
  type: "object",
  fields: [
    defineField({
      name: "file",
      title: "影片檔",
      type: "file",
      options: { accept: "video/mp4,video/webm" },
      validation: (r) => r.required(),
    }),
    defineField({
      name: "poster",
      title: "封面圖",
      type: "image",
      options: { hotspot: true },
    }),
    defineField({
      name: "alt",
      title: "影片說明",
      type: "string",
      validation: (r) => r.required(),
    }),
    orientationField,
  ],
  preview: {
    select: { title: "alt", media: "poster" },
    prepare: ({ title, media }) => ({ title: title ?? "影片", subtitle: "影片", media }),
  },
});
