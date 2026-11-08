import { defaultLocale, htmlLang, type Locale } from "./config";
import type { Dictionary } from "./dictionaries/zh-Hant";
import zhHant from "./dictionaries/zh-Hant";

const dictionaries: Record<Locale, Dictionary> = { "zh-Hant": zhHant };

export function getDictionary(locale: Locale = defaultLocale): Dictionary {
  return dictionaries[locale];
}

export function formatPrice(amount: number, locale: Locale = defaultLocale): string {
  return `NT$${new Intl.NumberFormat(htmlLang[locale], { maximumFractionDigits: 0 }).format(amount)}`;
}

export * from "./config";
export type { Dictionary };
