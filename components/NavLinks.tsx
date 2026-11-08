"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

interface Props {
  links: { href: string; label: string; /** Also active on these path prefixes. */ match?: string[] }[];
}

export function NavLinks({ links }: Props) {
  const pathname = usePathname();
  return (
    <ul className="flex items-center gap-5 sm:gap-7">
      {links.map(({ href, label, match = [] }) => {
        const active =
          pathname === href || match.some((m) => pathname.startsWith(m));
        return (
          <li key={href}>
            <Link
              href={href}
              aria-current={active ? "page" : undefined}
              className={`transition-colors hover:text-fg ${active ? "text-fg" : "text-muted"}`}
            >
              {label}
            </Link>
          </li>
        );
      })}
    </ul>
  );
}
