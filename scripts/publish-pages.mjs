#!/usr/bin/env node
/**
 * Builds the static site and copies it to the repository root, so GitHub Pages
 * set to "Deploy from a branch" (branch root) serves the shop instead of the
 * README.
 *
 *   npm run publish:pages
 *
 * Then commit the generated files and push. If you switch Pages to the
 * "GitHub Actions" source, this script is no longer needed (the workflow in
 * .github/workflows/deploy-pages.yml builds from source).
 */
import { execSync } from "node:child_process";
import { cpSync, existsSync, readdirSync, rmSync } from "node:fs";
import path from "node:path";

const root = path.resolve(path.dirname(new URL(import.meta.url).pathname), "..");
const out = path.join(root, "out");

const repo = process.env.PAGES_REPO || "Bookstore";
const user = process.env.PAGES_USER || "jian2zip";
const env = {
  ...process.env,
  NEXT_PUBLIC_BASE_PATH: `/${repo}`,
  NEXT_PUBLIC_SITE_URL: `https://${user}.github.io/${repo}`,
};

// Never touch source or tooling folders, whatever the build emits.
const PROTECTED = new Set([
  ".git", ".github", ".next", ".claude", "node_modules", "app", "components", "lib",
  "public", "sanity", "scripts", "out", "README.md", "LICENSE", "package.json",
  "package-lock.json", "next.config.ts", "tsconfig.json", "AGENTS.md",
]);

execSync("npm run build", { cwd: root, env, stdio: "inherit" });
if (!existsSync(path.join(out, "index.html"))) throw new Error("Build produced no out/index.html");

for (const name of readdirSync(out)) {
  if (PROTECTED.has(name)) throw new Error(`Build output "${name}" collides with a source path; refusing to overwrite.`);
  // Remove the previous copy so deleted pages (e.g. a removed item) don't linger.
  rmSync(path.join(root, name), { recursive: true, force: true });
}
cpSync(out, root, { recursive: true });

console.log(`\nPublished ${readdirSync(out).length} entries to the repository root (base path /${repo}).`);
