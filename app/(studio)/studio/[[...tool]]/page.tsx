/**
 * Sanity Studio at /studio. Requires NEXT_PUBLIC_SANITY_PROJECT_ID; without it
 * the site runs on placeholder data and this page explains what to set.
 */
import { NextStudio } from "next-sanity/studio";
import config from "@/sanity.config";
import { isSanityConfigured } from "@/sanity/env";

export { metadata, viewport } from "next-sanity/studio";

export default function StudioPage() {
  if (!isSanityConfigured) {
    return (
      <main style={{ fontFamily: "system-ui", padding: 32, lineHeight: 1.7 }}>
        <h1>Sanity 尚未設定</h1>
        <p>
          請在 <code>.env.local</code> 設定 <code>NEXT_PUBLIC_SANITY_PROJECT_ID</code>（參考{" "}
          <code>.env.example</code>），重新啟動後即可在此使用 Studio。
        </p>
      </main>
    );
  }
  return <NextStudio config={config} />;
}
