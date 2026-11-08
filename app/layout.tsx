import type { Metadata, Viewport } from "next";
import { Instrument_Serif, Noto_Sans_TC, Noto_Serif_TC } from "next/font/google";
import { defaultLocale, getDictionary, htmlLang } from "@/lib/i18n";
import "./globals.css";

const instrumentSerif = Instrument_Serif({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-instrument-serif",
  display: "swap",
});

// CJK fonts are served by Google in unicode-range slices, so only the glyphs a
// page actually uses are downloaded. No subset to preload.
const notoSerifTC = Noto_Serif_TC({
  weight: ["400"],
  variable: "--font-noto-serif-tc",
  display: "swap",
  preload: false,
});

const notoSansTC = Noto_Sans_TC({
  weight: ["400", "500"],
  variable: "--font-noto-sans-tc",
  display: "swap",
  preload: false,
});

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: { default: "減屋", template: "%s｜減屋" },
  description: "減屋——二手書與雜貨。意識如錢一般在流動。",
};

export const viewport: Viewport = {
  viewportFit: "cover", // lets the mobile order bar respect the home indicator
  themeColor: [
    { media: "(prefers-color-scheme: dark)", color: "#1d1717" },
    { media: "(prefers-color-scheme: light)", color: "#f4f0ea" },
  ],
};

/**
 * Applies the saved theme before first paint (no flash). Dark is the default;
 * the visitor's choice is remembered in localStorage.
 */
const themeScript = `try{var t=localStorage.getItem("theme");if(t==="light"||t==="dark")document.documentElement.dataset.theme=t}catch(e){}`;

export default function SiteLayout({ children }: { children: React.ReactNode }) {
  const t = getDictionary(defaultLocale);
  return (
    <html
      lang={htmlLang[defaultLocale]}
      data-theme="dark"
      suppressHydrationWarning
      className={`${instrumentSerif.variable} ${notoSerifTC.variable} ${notoSansTC.variable}`}
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
        {/* Without JS the fade-in never triggers; show images immediately. */}
        <noscript>
          <style>{`.img-fade{opacity:1}`}</style>
        </noscript>
      </head>
      <body className="min-h-dvh">
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-50 focus:bg-fg focus:px-3 focus:py-2 focus:text-bg"
        >
          {t.nav.skipToContent}
        </a>
        {children}
      </body>
    </html>
  );
}
