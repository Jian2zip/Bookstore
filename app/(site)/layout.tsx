import { ViewTransition } from "react";
import { SiteFooter } from "@/components/SiteFooter";
import { SiteHeader } from "@/components/SiteHeader";

/** Site chrome: fixed nav, content (cross-fades between pages), footer. */
export default function SiteLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <SiteHeader />
      <ViewTransition>
        <main id="main" className="px-gutter pt-nav">
          {children}
        </main>
      </ViewTransition>
      <SiteFooter />
    </>
  );
}
