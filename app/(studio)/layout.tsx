/** Separate root layout so the Studio gets none of the site's chrome or CSS. */
export default function StudioLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="zh-Hant-TW">
      <body style={{ margin: 0 }}>{children}</body>
    </html>
  );
}
