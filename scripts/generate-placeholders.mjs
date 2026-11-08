#!/usr/bin/env node
/**
 * Generates neutral placeholder photographs for the demo data set, plus a
 * manifest with dimensions and a tiny blur placeholder (LQIP) per image.
 *
 *   node scripts/generate-placeholders.mjs
 *
 * Output:
 *   public/placeholder/<name>.jpg
 *   lib/data/placeholder-images.json
 *
 * These are abstract stand-ins (a book shape, a spine, a page edge…) so the
 * layout can be judged without borrowing anyone's photography. Replace them
 * with real photos in Sanity.
 */
import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import sharp from "sharp";

const root = path.resolve(path.dirname(new URL(import.meta.url).pathname), "..");
const outDir = path.join(root, "public/placeholder");
const manifestPath = path.join(root, "lib/data/placeholder-images.json");

const SIZES = {
  "4:5": [1600, 2000],
  "3:4": [1500, 2000],
  "2:3": [1400, 2100],
  "1:1": [1800, 1800],
  "16:9": [1920, 1080],
  "3:2": [1800, 1200],
};

/** Each spec: [name, ratio, kind, hue (0–360), label] */
const specs = [
  // ── Books ─────────────────────────────────────────
  ...book("b001", 18, "4:5"),
  ...book("b002", 205, "2:3"),
  ...book("b003", 32, "3:4"),
  ...book("b004", 110, "4:5", { flaw: true }),
  ...book("b005", 350, "1:1"),
  ...book("b006", 260, "4:5"), // sold
  // ── Goods ─────────────────────────────────────────
  ...goods("g001", 40, "3:4"),
  ...goods("g002", 15, "1:1"),
  ...goods("g003", 190, "4:5"),
  ...goods("g004", 28, "2:3"),
  // ── Interlude tiles (no link) ─────────────────────
  ["tile-shelf", "3:4", "shelf", 25, "shelf corner"],
  ["tile-display", "3:2", "display", 30, "shop display"],
  ["tile-spines", "4:5", "spines", 15, "spines, close"],
];

function book(id, hue, heroRatio, { flaw = false } = {}) {
  return [
    [`${id}-hero`, heroRatio, "cover", hue, `${id} / cover`],
    [`${id}-cover`, "4:5", "cover", hue, `${id} / cover, flat`],
    [`${id}-spine`, "16:9", "spine", hue, `${id} / spine`],
    [`${id}-pages`, "4:5", "pages", hue, `${id} / inside pages`],
    [`${id}-edge`, "16:9", "edge", hue, `${id} / fore-edge`],
    [`${id}-detail`, "4:5", flaw ? "flaw" : "corner", hue, `${id} / ${flaw ? "flaw close-up" : "corner detail"}`],
  ];
}

function goods(id, hue, heroRatio) {
  return [
    [`${id}-hero`, heroRatio, "object", hue, `${id} / front`],
    [`${id}-side`, "16:9", "objectSide", hue, `${id} / side`],
    [`${id}-top`, "4:5", "objectTop", hue, `${id} / top`],
    [`${id}-detail`, "16:9", "texture", hue, `${id} / detail`],
  ];
}

// Deterministic pseudo-random so re-runs produce identical files.
function rng(seed) {
  let s = [...seed].reduce((a, c) => (a * 31 + c.charCodeAt(0)) >>> 0, 7);
  return () => ((s = (s * 1664525 + 1013904223) >>> 0) / 2 ** 32);
}

const hsl = (h, s, l) => `hsl(${h} ${s}% ${l}%)`;

function svg(name, w, h, kind, hue, label) {
  const r = rng(name);
  const bgL = 78 + r() * 8; // warm paper / table top
  const bg = hsl(30 + r() * 10, 12 + r() * 8, bgL);
  const bg2 = hsl(25 + r() * 10, 10 + r() * 6, bgL - 10);
  const ink = hsl(hue, 22 + r() * 18, 28 + r() * 16);
  const inkLight = hsl(hue, 18, 62);
  const paper = hsl(42, 30, 88);
  const shadow = `<filter id="s" x="-20%" y="-20%" width="140%" height="140%"><feDropShadow dx="0" dy="${h * 0.012}" stdDeviation="${h * 0.018}" flood-color="#000" flood-opacity="0.28"/></filter>`;
  const grain = `<filter id="g"><feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="2" stitchTiles="stitch"/><feColorMatrix values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 0.07 0"/></filter>`;
  let body = "";

  if (kind === "cover") {
    const bw = Math.min(w * 0.58, h * 0.48);
    const bh = bw * 1.42;
    const x = (w - bw) / 2 + (r() - 0.5) * w * 0.04;
    const y = (h - bh) / 2;
    body = `<g filter="url(#s)" transform="rotate(${(r() - 0.5) * 3} ${w / 2} ${h / 2})">
      <rect x="${x}" y="${y}" width="${bw}" height="${bh}" fill="${ink}"/>
      <rect x="${x}" y="${y}" width="${bw * 0.05}" height="${bh}" fill="#000" opacity="0.18"/>
      <rect x="${x + bw * 0.16}" y="${y + bh * 0.14}" width="${bw * 0.68}" height="${bh * 0.012}" fill="${paper}" opacity="0.85"/>
      <rect x="${x + bw * 0.16}" y="${y + bh * 0.2}" width="${bw * 0.42}" height="${bh * 0.05}" fill="${paper}" opacity="0.9"/>
      <rect x="${x + bw * 0.16}" y="${y + bh * 0.82}" width="${bw * 0.26}" height="${bh * 0.02}" fill="${paper}" opacity="0.7"/>
    </g>`;
  } else if (kind === "spine") {
    const sh = h * 0.16;
    const y = (h - sh) / 2;
    body = `<g filter="url(#s)">
      <rect x="${w * 0.08}" y="${y}" width="${w * 0.84}" height="${sh}" rx="${sh * 0.08}" fill="${ink}"/>
      <rect x="${w * 0.14}" y="${y + sh * 0.38}" width="${w * 0.3}" height="${sh * 0.24}" fill="${paper}" opacity="0.85"/>
      <rect x="${w * 0.78}" y="${y + sh * 0.3}" width="${w * 0.06}" height="${sh * 0.4}" fill="${paper}" opacity="0.6"/>
    </g>`;
  } else if (kind === "edge") {
    const bh = h * 0.34;
    const y = (h - bh) / 2;
    let lines = "";
    for (let i = 0; i < 60; i++) {
      const ly = y + bh * 0.08 + (bh * 0.84 * i) / 60;
      lines += `<line x1="${w * 0.1}" x2="${w * 0.9}" y1="${ly}" y2="${ly}" stroke="hsl(40 18% ${66 + r() * 10}%)" stroke-width="${h * 0.003}"/>`;
    }
    body = `<g filter="url(#s)"><rect x="${w * 0.1}" y="${y}" width="${w * 0.8}" height="${bh}" fill="${paper}"/>${lines}
      <rect x="${w * 0.1}" y="${y}" width="${w * 0.8}" height="${bh * 0.08}" fill="${ink}"/>
      <rect x="${w * 0.1}" y="${y + bh * 0.92}" width="${w * 0.8}" height="${bh * 0.08}" fill="${ink}"/></g>`;
  } else if (kind === "pages") {
    const pw = w * 0.38;
    const ph = h * 0.66;
    const y = (h - ph) / 2;
    let text = "";
    for (const px of [w / 2 - pw, w / 2]) {
      for (let i = 0; i < 22; i++) {
        const lw = pw * (0.6 + r() * 0.2) * (i % 7 === 6 ? 0.5 : 1);
        text += `<rect x="${px + pw * 0.14}" y="${y + ph * 0.1 + i * ph * 0.036}" width="${lw}" height="${ph * 0.009}" fill="#5a524c" opacity="0.55"/>`;
      }
    }
    body = `<g filter="url(#s)"><rect x="${w / 2 - pw}" y="${y}" width="${pw * 2}" height="${ph}" fill="${paper}"/>
      <rect x="${w / 2 - 1.5}" y="${y}" width="3" height="${ph}" fill="#000" opacity="0.12"/>${text}</g>`;
  } else if (kind === "corner" || kind === "flaw") {
    body = `<rect x="${w * 0.12}" y="${h * 0.18}" width="${w}" height="${h}" fill="${ink}" filter="url(#s)"/>
      <rect x="${w * 0.12}" y="${h * 0.18}" width="${w}" height="${h * 0.01}" fill="${inkLight}" opacity="0.6"/>`;
    if (kind === "flaw") {
      body += `<ellipse cx="${w * 0.42}" cy="${h * 0.42}" rx="${w * 0.16}" ry="${w * 0.12}" fill="hsl(38 40% 72%)" opacity="0.35"/>
        <ellipse cx="${w * 0.42}" cy="${h * 0.42}" rx="${w * 0.16}" ry="${w * 0.12}" fill="none" stroke="hsl(30 30% 40%)" stroke-opacity="0.35" stroke-width="${w * 0.006}"/>
        <path d="M ${w * 0.12} ${h * 0.6} l ${w * 0.08} ${h * 0.03} l ${-w * 0.06} ${h * 0.04}" stroke="${paper}" stroke-width="${w * 0.006}" fill="none" opacity="0.7"/>`;
    }
  } else if (kind === "object" || kind === "objectSide" || kind === "objectTop") {
    const s = Math.min(w, h);
    const cx = w / 2;
    const cy = h / 2 + (kind === "objectTop" ? 0 : h * 0.05);
    const shape =
      kind === "objectTop"
        ? `<circle cx="${cx}" cy="${cy}" r="${s * 0.26}" fill="${ink}"/><circle cx="${cx}" cy="${cy}" r="${s * 0.14}" fill="${inkLight}" opacity="0.5"/>`
        : `<rect x="${cx - s * 0.2}" y="${cy - s * 0.3}" width="${s * 0.4}" height="${s * 0.5}" rx="${s * 0.04}" fill="${ink}"/>
           <rect x="${cx - s * 0.26}" y="${cy + s * 0.18}" width="${s * 0.52}" height="${s * 0.06}" rx="${s * 0.01}" fill="${ink}"/>
           <rect x="${cx - s * 0.17}" y="${cy - s * 0.27}" width="${s * 0.05}" height="${s * 0.4}" fill="#fff" opacity="0.14"/>`;
    body = `<ellipse cx="${cx}" cy="${cy + s * 0.27}" rx="${s * 0.3}" ry="${s * 0.03}" fill="#000" opacity="0.15"/><g filter="url(#s)">${shape}</g>`;
  } else if (kind === "texture") {
    let weave = "";
    for (let i = 0; i < 40; i++) {
      weave += `<rect x="0" y="${(h * i) / 40}" width="${w}" height="${h / 80}" fill="${ink}" opacity="${0.25 + r() * 0.25}"/>`;
    }
    body = `<rect width="${w}" height="${h}" fill="${inkLight}"/>${weave}`;
  } else if (kind === "shelf" || kind === "spines") {
    let x = w * 0.04;
    const base = kind === "shelf" ? h * 0.62 : h * 0.98;
    let books = "";
    while (x < w * 0.96) {
      const bw = w * (kind === "shelf" ? 0.03 + r() * 0.04 : 0.06 + r() * 0.08);
      const bh = h * (kind === "shelf" ? 0.25 + r() * 0.18 : 0.75 + r() * 0.2);
      const bh2 = hue + (r() - 0.5) * 80;
      books += `<rect x="${x}" y="${base - bh}" width="${bw - w * 0.004}" height="${bh}" fill="${hsl(bh2, 15 + r() * 25, 22 + r() * 40)}"/>
        <rect x="${x + bw * 0.2}" y="${base - bh * 0.8}" width="${bw * 0.5}" height="${bh * 0.08}" fill="${paper}" opacity="${0.4 + r() * 0.4}"/>`;
      x += bw;
    }
    body =
      kind === "shelf"
        ? `<rect x="0" y="${h * 0.62}" width="${w}" height="${h * 0.035}" fill="hsl(28 30% 30%)"/>${books}<rect x="0" y="${h * 0.655}" width="${w}" height="${h}" fill="#000" opacity="0.12"/>`
        : books;
  } else if (kind === "display") {
    body = `<rect x="0" y="${h * 0.7}" width="${w}" height="${h * 0.3}" fill="hsl(28 25% 38%)"/>
      <g filter="url(#s)">
        <rect x="${w * 0.14}" y="${h * 0.3}" width="${w * 0.17}" height="${h * 0.4}" fill="${hsl(hue + 180, 25, 35)}"/>
        <rect x="${w * 0.36}" y="${h * 0.38}" width="${w * 0.22}" height="${h * 0.32}" fill="${hsl(hue, 30, 45)}"/>
        <rect x="${w * 0.64}" y="${h * 0.46}" width="${w * 0.1}" height="${h * 0.24}" rx="${w * 0.02}" fill="${hsl(hue + 40, 10, 70)}"/>
        <circle cx="${w * 0.82}" cy="${h * 0.62}" r="${h * 0.08}" fill="${hsl(hue + 90, 20, 30)}"/>
      </g>`;
  }

  return `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}" viewBox="0 0 ${w} ${h}">
  <defs>${shadow}${grain}
    <radialGradient id="bg" cx="50%" cy="40%" r="75%"><stop offset="0" stop-color="${bg}"/><stop offset="1" stop-color="${bg2}"/></radialGradient>
  </defs>
  <rect width="${w}" height="${h}" fill="url(#bg)"/>
  ${body}
  <rect width="${w}" height="${h}" filter="url(#g)"/>
  <text x="${w * 0.03}" y="${h - w * 0.03}" font-family="DejaVu Sans Mono, monospace" font-size="${Math.round(w * 0.018)}" fill="#000" opacity="0.4">PLACEHOLDER · ${label}</text>
</svg>`;
}

await mkdir(outDir, { recursive: true });
const manifest = {};

for (const [name, ratio, kind, hue, label] of specs) {
  const [w, h] = SIZES[ratio];
  const buf = Buffer.from(svg(name, w, h, kind, hue, label));
  await sharp(buf).jpeg({ quality: 78, mozjpeg: true }).toFile(path.join(outDir, `${name}.jpg`));
  const tiny = await sharp(buf).resize(16).blur(1).webp({ quality: 40 }).toBuffer();
  manifest[name] = {
    src: `/placeholder/${name}.jpg`,
    width: w,
    height: h,
    lqip: `data:image/webp;base64,${tiny.toString("base64")}`,
  };
  process.stdout.write(".");
}

await writeFile(manifestPath, JSON.stringify(manifest, null, 2) + "\n");
console.log(`\n${specs.length} images → public/placeholder, manifest → lib/data/placeholder-images.json`);
