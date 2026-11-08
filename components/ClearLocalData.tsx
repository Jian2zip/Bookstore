"use client";

import { useState } from "react";

/** "Cookie settings": the site stores only theme + order list in localStorage. */
export function ClearLocalData({ label, doneLabel }: { label: string; doneLabel: string }) {
  const [done, setDone] = useState(false);
  return (
    <button
      type="button"
      onClick={() => {
        try {
          localStorage.clear();
        } catch {}
        document.documentElement.dataset.theme = "dark";
        setDone(true);
      }}
      className="justify-self-start underline underline-offset-4 hover:text-fg"
    >
      <span aria-live="polite">{done ? doneLabel : label}</span>
    </button>
  );
}
