import type { StructureResolver } from "sanity/structure";

export const structure: StructureResolver = (S) =>
  S.list()
    .title("減屋")
    .items([
      S.listItem()
        .title("在庫商品")
        .child(S.documentList().title("在庫商品").filter('_type == "item" && status == "inStock"').defaultOrdering([{ field: "publishedAt", direction: "desc" }])),
      S.listItem()
        .title("已售出")
        .child(S.documentList().title("已售出").filter('_type == "item" && status == "sold"').defaultOrdering([{ field: "publishedAt", direction: "desc" }])),
      S.documentTypeListItem("item").title("全部商品"),
      S.divider(),
      S.listItem().title("網站設定").id("siteSettings").child(S.document().schemaType("siteSettings").documentId("siteSettings")),
      S.listItem().title("關於頁").id("aboutPage").child(S.document().schemaType("aboutPage").documentId("aboutPage")),
    ]);
