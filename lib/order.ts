/**
 * Email ordering. No payments on site: the button opens the visitor's mail
 * client with a pre-filled order; payment instructions only ever arrive in
 * the shop's reply.
 *
 * Kept free of React so the stage-5 order list can reuse it for multi-item
 * emails.
 */
import { formatPrice } from "./i18n";
import type { Item } from "./types";

export interface OrderLine {
  item: Pick<Item, "title" | "sku" | "price" | "type" | "stock">;
  quantity: number;
}

const NL = "\r\n";

export function orderSubject(lines: OrderLine[]): string {
  if (lines.length === 1) {
    const { title, sku } = lines[0].item;
    return `訂購：${title}（${sku}）`;
  }
  return `訂購：${lines.length} 件商品（${lines.map((l) => l.item.sku).join("、")}）`;
}

export function orderBody(lines: OrderLine[]): string {
  const items = lines.map(({ item, quantity }) => {
    const rows = [`品名：${item.title}`, `編號：${item.sku}`, `售價：${formatPrice(item.price)}`];
    // Quantity is only meaningful for goods with more than one in stock.
    if (item.type === "goods" && item.stock > 1) rows.push(`數量：${quantity}`);
    return rows.join(NL);
  });

  return [
    "你好，我想訂購以下商品：",
    "",
    items.join(NL + NL),
    "",
    "———— 請填寫 ————",
    "姓名：",
    "電話：",
    "取貨門市（超商店到店，請註明超商與門市名稱）：",
    "備註：",
    "",
    "（收到後會回信確認商品是否還在，並告知付款方式。商品不保留，先確認付款者先得。）",
  ].join(NL);
}

export function mailtoHref(email: string, lines: OrderLine[]): string {
  const q = `subject=${encodeURIComponent(orderSubject(lines))}&body=${encodeURIComponent(orderBody(lines))}`;
  return `mailto:${email}?${q}`;
}
