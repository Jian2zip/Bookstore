import { SiteImage } from "@/components/SiteImage";
import { assetUrl } from "@/lib/paths";
import type { GalleryEntry } from "@/lib/types";

/**
 * The long scroll. Landscape frames (16:9) span the column; portrait frames
 * (4:5) take ~70% and alternate left/right, so the rhythm reads
 * wide → narrow-left → wide → narrow-right. Each frame carries its alt text as
 * a small caption — on a secondhand item, "書口，略有淡黃" is information.
 */
export function ItemGallery({ entries, label }: { entries: GalleryEntry[]; label: string }) {
  let portraitIndex = 0;

  return (
    <section aria-label={label}>
      <ul className="grid gap-[calc(var(--spacing-wall)*2.5)]">
        {entries.map((entry, i) => {
          const landscape = entry.orientation === "landscape";
          const side = landscape ? "" : portraitIndex++ % 2 === 0 ? "md:mr-auto" : "md:ml-auto";
          return (
            <li key={i} className={landscape ? "w-full" : `w-full md:w-[70%] ${side}`}>
              <figure>
                <div className={landscape ? "aspect-video" : "aspect-[4/5]"}>
                  {entry.kind === "video" ? (
                    <video
                      src={assetUrl(entry.src)}
                      poster={entry.poster ? assetUrl(entry.poster.src) : undefined}
                      controls
                      muted
                      playsInline
                      preload="none"
                      aria-label={entry.alt}
                      className="h-full w-full bg-placeholder object-cover"
                    />
                  ) : (
                    <SiteImage
                      image={entry}
                      cover
                      sizes={landscape ? "(min-width: 64rem) 66vw, 100vw" : "(min-width: 64rem) 46vw, (min-width: 48rem) 70vw, 100vw"}
                    />
                  )}
                </div>
                {entry.alt && <figcaption className="mt-2 text-meta text-muted">{entry.alt}</figcaption>}
              </figure>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
