import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ViewTransition } from "react";
import { ItemGallery } from "@/components/item/ItemGallery";
import { ItemInfo } from "@/components/item/ItemInfo";
import { OrderBar, OrderPanel, OrderProvider } from "@/components/item/OrderControls";
import { ProductTile } from "@/components/ProductTile";
import { SiteImage } from "@/components/SiteImage";
import { conditionLabel } from "@/lib/condition";
import { getItemBySlug, getListedSlugs, getSimilarItems, getSiteSettings } from "@/lib/data";
import { formatPrice, getDictionary } from "@/lib/i18n";
import type { Item } from "@/lib/types";

/** Prerender every listed item. Sold or new slugs render on first request. */
export async function generateStaticParams() {
  const slugs = await getListedSlugs();
  // Cache Components needs at least one sample param to validate the route.
  return slugs.length ? slugs.map(({ slug }) => ({ slug })) : [{ slug: "__none__" }];
}

export async function generateMetadata({ params }: PageProps<"/item/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const item = await getItemBySlug(slug);
  if (!item) return {};
  if (item.status === "sold") {
    return { title: "已售出", robots: { index: false, follow: true } };
  }
  const description =
    item.seo?.description ?? item.description.join("").slice(0, 110);
  const og = item.seo?.ogImage ?? item.heroImage;
  return {
    title: item.seo?.title ?? item.title,
    description,
    alternates: { canonical: `/item/${item.slug}` },
    openGraph: {
      title: item.seo?.title ?? item.title,
      description,
      images: [{ url: og.src, width: og.width, height: og.height, alt: og.alt }],
    },
  };
}

export default async function ItemPage({ params }: PageProps<"/item/[slug]">) {
  const { slug } = await params;
  const item = await getItemBySlug(slug);
  if (!item) notFound();
  if (item.status === "sold") return <SoldNotice />;
  return <ItemDetail item={item} />;
}

/** Old links to sold items: only this message and a way back. (noindex above) */
function SoldNotice() {
  const t = getDictionary();
  return (
    <div className="py-section">
      <h1 className="text-display">{t.item.sold}</h1>
      <p className="mt-4 text-muted">{t.item.soldBody}</p>
      <p className="mt-8">
        <Link href="/" className="underline underline-offset-4">
          {t.item.backToWall}
        </Link>
      </p>
    </div>
  );
}

async function ItemDetail({ item }: { item: Item }) {
  const t = getDictionary();
  const [settings, similar] = await Promise.all([getSiteSettings(), getSimilarItems(item)]);
  const condition = conditionLabel(item.condition);
  const subline =
    item.type === "book"
      ? [item.author, item.translator && `${item.translator} 譯`, item.publisher, item.year].filter(Boolean).join(" · ")
      : [item.category, item.material].filter(Boolean).join(" · ");
  const hero = item.heroImage;
  const orderItem = { title: item.title, sku: item.sku, price: item.price, type: item.type, stock: item.stock };

  return (
    <OrderProvider>
      <article>
        {/* Title block */}
        <header className="grid gap-y-3 pt-10 pb-8 md:pt-14 md:pb-10 lg:grid-cols-12 lg:gap-x-wall">
          <p className="text-meta text-muted lg:col-span-12">
            <Link href="/" className="transition-colors hover:text-fg">
              {t.nav.products}
            </Link>
            <span aria-hidden="true"> / </span>
            {item.type === "book" ? t.wall.books : t.wall.goods}
            <span aria-hidden="true"> / </span>
            {item.category}
          </p>
          <h1 className="text-display text-balance lg:col-span-8">{item.title}</h1>
          <p className="flex items-baseline justify-between gap-6 self-end text-meta lg:col-span-4 lg:pb-2">
            <span className="text-muted">{subline}</span>
            <span className="tabular shrink-0">
              {condition}　{formatPrice(item.price)}
            </span>
          </p>
        </header>

        {/* Hero: full width; portrait images are capped at ~85% of the viewport height. */}
        <div className="mx-auto" style={{ maxWidth: `calc(85svh * ${hero.width / hero.height})` }}>
          <ViewTransition name={`item-${item.slug}`} share="morph" default="none">
            <SiteImage image={hero} priority sizes="(min-width: 64rem) 70vw, 100vw" />
          </ViewTransition>
        </div>

        {/* Body: content column + sticky order panel */}
        <div className="mt-section grid gap-y-section lg:grid-cols-12 lg:gap-x-wall">
          <div className="grid gap-y-section lg:col-span-8">
            <div className="grid max-w-measure gap-4">
              {item.description.map((p, i) => (
                <p key={i}>{p}</p>
              ))}
            </div>

            {item.gallery.length > 0 && <ItemGallery entries={item.gallery} label={t.item.images} />}

            <div className="max-w-measure">
              <ItemInfo item={item} t={t.item} />
            </div>
          </div>

          <aside aria-label={t.item.orderByEmail} className="lg:col-span-4">
            <div className="lg:sticky lg:top-[calc(var(--spacing-nav)+2rem)]">
              <OrderPanel
                item={orderItem}
                email={settings.email}
                conditionText={`${item.sku} · ${condition}`}
                t={t.item}
                common={t.common}
              />
            </div>
          </aside>
        </div>

        {/* Similar items, above the footer */}
        {similar.length > 0 && (
          <section aria-labelledby="similar" className="mt-section border-t border-line pt-6">
            <h2 id="similar" className="mb-8 font-sans text-meta text-muted">
              {t.item.similar}
            </h2>
            <ul className="grid grid-cols-1 items-end gap-x-wall gap-y-[calc(var(--spacing-wall)*2.5)] xs:grid-cols-2 lg:grid-cols-4">
              {similar.map((s) => (
                <li key={s.id}>
                  <ProductTile item={s} />
                </li>
              ))}
            </ul>
          </section>
        )}
      </article>

      <OrderBar item={orderItem} email={settings.email} label={t.item.orderByEmail} />
    </OrderProvider>
  );
}
