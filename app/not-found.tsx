import Link from "next/link";
import { SiteFooter } from "@/components/SiteFooter";
import { SiteHeader } from "@/components/SiteHeader";
import { getDictionary } from "@/lib/i18n";

export default function NotFound() {
  const t = getDictionary();
  return (
    <>
      <SiteHeader />
      <main id="main" className="px-gutter pt-nav">
        <div className="py-section">
          <h1 className="text-display">{t.notFound.title}</h1>
          <p className="mt-4 text-muted">{t.notFound.body}</p>
          <p className="mt-8">
            <Link href="/" className="underline underline-offset-4">
              {t.item.backToWall}
            </Link>
          </p>
        </div>
      </main>
      <SiteFooter />
    </>
  );
}
