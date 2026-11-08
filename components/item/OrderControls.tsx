"use client";

import { createContext, use, useState } from "react";
import { CopyButton } from "@/components/CopyButton";
import { formatPrice, type Dictionary } from "@/lib/i18n";
import { mailtoHref } from "@/lib/order";
import type { Item } from "@/lib/types";

type OrderItem = Pick<Item, "title" | "sku" | "price" | "type" | "stock">;

/** Shared between the sidebar panel and the mobile bar so both send the same quantity. */
const QuantityContext = createContext<{ quantity: number; setQuantity: (n: number) => void }>({
  quantity: 1,
  setQuantity: () => {},
});

export function OrderProvider({ children }: { children: React.ReactNode }) {
  const [quantity, setQuantity] = useState(1);
  return <QuantityContext value={{ quantity, setQuantity }}>{children}</QuantityContext>;
}

const showQuantity = (item: OrderItem) => item.type === "goods" && item.stock > 1;

function OrderButton({ item, email, label, className = "" }: { item: OrderItem; email: string; label: string; className?: string }) {
  const { quantity } = use(QuantityContext);
  return (
    <a
      href={mailtoHref(email, [{ item, quantity }])}
      className={`inline-flex items-center justify-center bg-fg text-bg transition-opacity duration-[var(--dur-hover)] hover:opacity-85 ${className}`}
    >
      {label}
    </a>
  );
}

/** Desktop: sticky beside the gallery. Mobile: inline after the info block. */
export function OrderPanel({
  item,
  email,
  conditionText,
  t,
  common,
}: {
  item: OrderItem;
  email: string;
  conditionText: string;
  t: Dictionary["item"];
  common: Dictionary["common"];
}) {
  const { quantity, setQuantity } = use(QuantityContext);
  return (
    <div className="grid gap-6">
      <div>
        <p className="font-display text-body">{item.title}</p>
        <p className="mt-1 flex items-baseline justify-between gap-4">
          <span className="text-meta text-muted">{conditionText}</span>
          <span className="tabular">{formatPrice(item.price)}</span>
        </p>
      </div>

      {showQuantity(item) && (
        <label className="flex items-center justify-between border-y border-line py-3 text-meta">
          <span className="text-muted">
            {t.quantity}
            <span className="ml-2">
              （{t.inStockCount} {item.stock}）
            </span>
          </span>
          <select
            value={quantity}
            onChange={(e) => setQuantity(Number(e.target.value))}
            className="tabular border border-line bg-bg px-3 py-1 text-fg"
          >
            {Array.from({ length: item.stock }, (_, i) => i + 1).map((n) => (
              <option key={n} value={n}>
                {n}
              </option>
            ))}
          </select>
        </label>
      )}

      <div className="grid gap-3">
        <OrderButton item={item} email={email} label={t.orderByEmail} className="h-12 w-full" />
        <p className="flex flex-wrap items-baseline justify-between gap-x-3 text-meta">
          <span className="text-muted">{email}</span>
          <CopyButton value={email} label={t.copyEmail} copiedLabel={common.copied} />
        </p>
      </div>

      <ul className="grid gap-1 border-t border-line pt-4 text-meta text-muted">
        <li>{t.noHold}</li>
        <li>{t.orderNote}</li>
      </ul>
    </div>
  );
}

/** Fixed bottom bar on small screens. */
export function OrderBar({ item, email, label }: { item: OrderItem; email: string; label: string }) {
  return (
    <div
      data-order-bar
      className="fixed inset-x-0 bottom-0 z-30 flex items-center justify-between gap-4 border-t border-line bg-surface px-gutter pt-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] lg:hidden"
    >
      <p className="min-w-0 text-meta">
        <span className="block truncate">{item.title}</span>
        <span className="tabular text-muted">{formatPrice(item.price)}</span>
      </p>
      <OrderButton item={item} email={email} label={label} className="h-11 shrink-0 px-6" />
    </div>
  );
}
