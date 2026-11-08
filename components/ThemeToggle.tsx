"use client";

import { useSyncExternalStore } from "react";

type Theme = "dark" | "light";

function subscribe(onChange: () => void) {
  const observer = new MutationObserver(onChange);
  observer.observe(document.documentElement, { attributes: true, attributeFilter: ["data-theme"] });
  return () => observer.disconnect();
}

const getTheme = (): Theme => (document.documentElement.dataset.theme === "light" ? "light" : "dark");

export function ThemeToggle({ labels }: { labels: { toDark: string; toLight: string } }) {
  const theme = useSyncExternalStore(subscribe, getTheme, () => "dark" as Theme);
  const next: Theme = theme === "dark" ? "light" : "dark";

  return (
    <button
      type="button"
      onClick={() => {
        document.documentElement.dataset.theme = next;
        try {
          localStorage.setItem("theme", next);
        } catch {}
      }}
      aria-label={next === "light" ? labels.toLight : labels.toDark}
      className="text-meta text-muted transition-colors hover:text-fg"
    >
      {/* Half-filled circle: reads as "theme" without words. */}
      <svg width="14" height="14" viewBox="0 0 14 14" aria-hidden="true">
        <circle cx="7" cy="7" r="6" fill="none" stroke="currentColor" />
        <path d="M7 1a6 6 0 0 1 0 12z" fill="currentColor" />
      </svg>
    </button>
  );
}
