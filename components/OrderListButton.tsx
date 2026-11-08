/**
 * Order-list icon in the header. Stage 5 turns this into the drawer trigger
 * (with an item count); for now it is shown but inert.
 */
export function OrderListButton({ label }: { label: string }) {
  return (
    <button type="button" disabled aria-label={label} title={label} className="text-muted">
      <svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden="true">
        <path d="M3.5 2.5h11v13h-11z" stroke="currentColor" />
        <path d="M6 6.5h6M6 9h6M6 11.5h3.5" stroke="currentColor" />
      </svg>
    </button>
  );
}
