"use client";

import { useEffect, useRef, useState } from "react";

interface Props {
  value: string;
  label: string;
  copiedLabel: string;
  className?: string;
}

/** Copies `value`; the label reads "已複製" for ~2s, announced to screen readers. */
export function CopyButton({ value, label, copiedLabel, className = "" }: Props) {
  const [copied, setCopied] = useState(false);
  const timer = useRef<ReturnType<typeof setTimeout>>(undefined);

  useEffect(() => () => clearTimeout(timer.current), []);

  async function copy() {
    try {
      await navigator.clipboard.writeText(value);
    } catch {
      // Fallback for browsers/contexts without the async clipboard API.
      const el = document.createElement("textarea");
      el.value = value;
      el.setAttribute("readonly", "");
      el.style.position = "fixed";
      el.style.opacity = "0";
      document.body.appendChild(el);
      el.select();
      document.execCommand("copy");
      el.remove();
    }
    setCopied(true);
    clearTimeout(timer.current);
    timer.current = setTimeout(() => setCopied(false), 2000);
  }

  return (
    <button
      type="button"
      onClick={copy}
      className={`text-muted underline decoration-line underline-offset-4 transition-colors hover:text-fg ${className}`}
    >
      <span aria-live="polite">{copied ? copiedLabel : label}</span>
    </button>
  );
}
