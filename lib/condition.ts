import type { Condition } from "./types";

/**
 * Standardised condition grades. Order matters (best → worst); the same list
 * feeds the Sanity schema options and the explanation block on product pages.
 */
export const CONDITIONS: readonly { value: Condition; label: string; description: string }[] = [
  {
    value: "likeNew",
    label: "近全新",
    description: "幾乎沒有使用痕跡，無劃記、無摺頁，書口乾淨。",
  },
  {
    value: "good",
    label: "良好",
    description: "有輕微翻閱或存放痕跡，內頁完整、無影響閱讀的瑕疵。",
  },
  {
    value: "fair",
    label: "普通",
    description: "可見泛黃、書斑、邊角磨損或少量劃記，不影響閱讀。",
  },
  {
    value: "flawed",
    label: "有瑕疵",
    description: "有明顯瑕疵（水漬、破損、缺頁、大量劃記等），詳見瑕疵說明與照片。",
  },
] as const;

export function conditionLabel(value: Condition): string {
  return CONDITIONS.find((c) => c.value === value)?.label ?? value;
}
