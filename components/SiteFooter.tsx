import Link from "next/link";
import { getSiteSettings } from "@/lib/data";
import { getDictionary } from "@/lib/i18n";
import { CopyButton } from "./CopyButton";

/** Global footer. Optional contact fields render only when set in the CMS. */
export async function SiteFooter() {
  const t = getDictionary();
  const s = await getSiteSettings();

  return (
    <footer className="mt-section border-t border-line px-gutter pt-10 pb-12 text-meta">
      <div className="grid gap-10 md:grid-cols-[2fr_1fr_1fr]">
        <p className="font-display text-body">{s.tagline}</p>

        <section aria-labelledby="footer-contact">
          <h2 id="footer-contact" className="mb-3 font-sans text-meta text-muted">
            {t.footer.contact}
          </h2>
          <ul className="grid gap-1">
            <li className="flex flex-wrap items-baseline gap-x-3">
              <a href={`mailto:${s.email}`} className="hover:underline">
                {s.email}
              </a>
              <CopyButton value={s.email} label={t.common.copy} copiedLabel={t.common.copied} />
            </li>
            {s.phone && (
              <li>
                <a href={`tel:${s.phone.replace(/[^\d+]/g, "")}`} className="hover:underline">
                  {s.phone}
                </a>
              </li>
            )}
            {s.address && <li className="whitespace-pre-line">{s.address}</li>}
            {s.socialLinks.map((l) => (
              <li key={l.url}>
                <a href={l.url} target="_blank" rel="noopener noreferrer" className="hover:underline">
                  {l.label}
                </a>
              </li>
            ))}
          </ul>
        </section>

        <section aria-labelledby="footer-info">
          <h2 id="footer-info" className="mb-3 font-sans text-meta text-muted">
            {t.footer.info}
          </h2>
          <ul className="grid gap-1">
            <li>
              {t.footer.shippingMethod}　{s.shipping.method}
            </li>
            <li>{t.footer.paymentLine}</li>
            <li className="mt-3">
              <Link href="/shipping" className="hover:underline">
                {t.footer.shippingPayment}
              </Link>
            </li>
            <li>
              <Link href="/shipping#returns" className="hover:underline">
                {t.footer.returns}
              </Link>
            </li>
            <li>
              <Link href="/privacy" className="hover:underline">
                {t.footer.privacy}
              </Link>
            </li>
            <li>
              <Link href="/privacy#cookies" className="hover:underline">
                {t.footer.cookies}
              </Link>
            </li>
          </ul>
        </section>
      </div>

      {s.footerText && <p className="mt-10 max-w-measure whitespace-pre-line text-muted">{s.footerText}</p>}
      <p className="mt-10 text-muted">© {s.shopName}</p>
    </footer>
  );
}
