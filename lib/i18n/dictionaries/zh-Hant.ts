/** UI strings. Content (product copy, about text) comes from the CMS, not here. */
const dictionary = {
  nav: {
    products: "商品",
    about: "關於",
    orderList: "訂購清單",
    skipToContent: "跳到主要內容",
    themeToDark: "切換為深色",
    themeToLight: "切換為淺色",
  },
  wall: {
    all: "全部",
    books: "書",
    goods: "雜貨",
    newest: "最新",
    empty: "目前沒有商品。",
  },
  item: {
    sold: "此商品已售出",
    backToWall: "回到商品",
    orderByEmail: "Email 訂購",
    copyEmail: "複製信箱",
    addToList: "加入訂購清單",
    quantity: "數量",
    similar: "相似商品",
    conditionGrades: "品相分級",
    noHold: "商品不保留，先確認付款者先得。",
    fields: {
      author: "作者",
      translator: "譯者",
      publisher: "出版社",
      year: "出版年",
      edition: "版次",
      language: "語言",
      isbn: "ISBN",
      condition: "品相",
      conditionNotes: "品相說明",
      name: "品名",
      category: "分類",
      dimensions: "尺寸",
      material: "材質",
      origin: "產地",
      sku: "編號",
      price: "售價",
    },
  },
  common: {
    copy: "複製",
    copied: "已複製",
    tbd: "待定",
  },
  footer: {
    shippingPayment: "運送與付款",
    returns: "退換貨",
    privacy: "隱私權政策",
    cookies: "Cookie 設定",
  },
} as const;

export default dictionary;
export type Dictionary = typeof dictionary;
