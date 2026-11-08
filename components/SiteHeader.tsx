import Link from "next/link";
import { getSiteSettings } from "@/lib/data";
import { getDictionary } from "@/lib/i18n";
import { NavLinks } from "./NavLinks";
import { OrderListButton } from "./OrderListButton";
import { ThemeToggle } from "./ThemeToggle";

export async function SiteHeader() {
  const t = getDictionary();
  const { shopName } = await getSiteSettings();

  return (
    <header className="fixed inset-x-0 top-0 z-40 bg-bg">
      <div className="flex h-nav items-center justify-between gap-6 px-gutter">
        <Link href="/" className="font-display text-body tracking-[0.08em]" aria-label={`${shopName} ${t.nav.home}`}>
          {shopName}
        </Link>
        <nav aria-label={t.nav.label} className="flex items-center gap-5 sm:gap-7">
          <NavLinks
            links={[
              { href: "/", label: t.nav.products, match: ["/item/"] },
              { href: "/about", label: t.nav.about },
            ]}
          />
          <ThemeToggle labels={{ toDark: t.nav.themeToDark, toLight: t.nav.themeToLight }} />
          <OrderListButton label={t.nav.orderList} />
        </nav>
      </div>
    </header>
  );
}
