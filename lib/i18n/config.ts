/**
 * i18n scaffolding. Only Traditional Chinese ships today; adding a language
 * means adding a dictionary file and a locale here. Routes are not prefixed
 * for the default locale, so current URLs stay stable when more are added.
 */
export const locales = ["zh-Hant"] as const;
export type Locale = (typeof locales)[number];
export const defaultLocale: Locale = "zh-Hant";

/** BCP 47 tag for <html lang> and Intl formatting. */
export const htmlLang: Record<Locale, string> = { "zh-Hant": "zh-Hant-TW" };
