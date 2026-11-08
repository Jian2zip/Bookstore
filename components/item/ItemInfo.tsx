import { conditionLabel, CONDITIONS } from "@/lib/condition";
import type { Dictionary } from "@/lib/i18n";
import type { Item } from "@/lib/types";

type Row = [label: string, value: string | number | undefined];

/** Specification table + condition grades. Empty fields are simply omitted. */
export function ItemInfo({ item, t }: { item: Item; t: Dictionary["item"] }) {
  const f = t.fields;
  const rows: Row[] =
    item.type === "book"
      ? [
          [f.author, item.author],
          [f.translator, item.translator],
          [f.publisher, item.publisher],
          [f.year, item.year],
          [f.edition, item.edition],
          [f.language, item.language],
          [f.isbn, item.isbn],
          [f.condition, conditionLabel(item.condition)],
          [f.conditionNotes, item.conditionNotes],
          [f.sku, item.sku],
        ]
      : [
          [f.name, item.title],
          [f.category, item.category],
          [f.dimensions, item.dimensions],
          [f.material, item.material],
          [f.origin, item.origin],
          [t.usage, conditionLabel(item.condition)],
          [t.flaws, item.conditionNotes],
          [f.sku, item.sku],
        ];

  return (
    <section aria-labelledby="item-info" className="grid gap-10">
      <div>
        <h2 id="item-info" className="mb-4 font-sans text-meta text-muted">
          {item.type === "book" ? t.bookInfo : t.goodsInfo}
        </h2>
        <dl className="text-meta">
          {rows
            .filter(([, v]) => v !== undefined && v !== "")
            .map(([label, value]) => (
              <div key={label} className="grid grid-cols-[6.5rem_1fr] gap-4 border-t border-line py-3 last:border-b">
                <dt className="text-muted">{label}</dt>
                <dd className={typeof value === "number" || label === f.isbn || label === f.sku ? "tabular" : ""}>
                  {value}
                </dd>
              </div>
            ))}
        </dl>
      </div>

      <details className="group text-meta">
        <summary className="flex cursor-pointer list-none items-center gap-2 text-muted transition-colors hover:text-fg [&::-webkit-details-marker]:hidden">
          <span aria-hidden="true" className="inline-block w-3 transition-transform duration-[var(--dur-hover)] group-open:rotate-45">
            +
          </span>
          {t.conditionGrades}
        </summary>
        <dl className="mt-4 grid gap-2 pl-5">
          {CONDITIONS.map((c) => {
            const current = c.value === item.condition;
            return (
              <div key={c.value} className={`grid grid-cols-[4.5rem_1fr] gap-4 ${current ? "text-fg" : "text-muted"}`}>
                <dt>
                  {c.label}
                  {current && <span className="sr-only">（本商品）</span>}
                </dt>
                <dd>{c.description}</dd>
              </div>
            );
          })}
        </dl>
      </details>
    </section>
  );
}
