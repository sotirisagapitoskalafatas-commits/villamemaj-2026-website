import type { Metadata } from "next";
import Image from "next/image";
import { getDictionary } from "@/lib/i18n";
import { assetSrc } from "@/lib/assets";
import { getGalleryImages } from "@/lib/data";
import { isLocale, SITE_CONFIG, type Locale } from "@/lib/site";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const dict = await getDictionary(isLocale(locale) ? (locale as Locale) : "el");
  return { title: dict.nav.gallery, description: dict.gallery.subtitle };
}

export default async function GalleryPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!isLocale(locale)) return null;
  const dict = await getDictionary(locale as Locale);

  const images = await getGalleryImages();

  return (
    <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
      <p className="section-label">{dict.nav.gallery}</p>
      <h1 className="mt-3 font-display text-5xl font-semibold text-ink">
        {dict.gallery.title}
      </h1>
      <p className="mt-4 max-w-2xl text-ink-soft">{dict.gallery.subtitle}</p>

      {images.length > 0 ? (
        <div className="mt-12 grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
          {images.map((image, index) => (
            <figure
              key={image.id}
              className={`relative overflow-hidden rounded-2xl bg-sand ${
                index % 5 === 0 ? "col-span-2 row-span-2 aspect-square" : "aspect-[3/4]"
              }`}
            >
              <Image
                src={assetSrc(image.image_url)}
                alt={
                  (locale === "el" ? image.caption_el : image.caption_en) ??
                  `${SITE_CONFIG.name} ${index + 1}`
                }
                fill
                sizes="(max-width: 768px) 50vw, 25vw"
                className="object-cover transition-transform duration-500 hover:scale-105"
              />
              {(image.caption_el || image.caption_en) && (
                <figcaption className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/60 to-transparent p-4 text-sm text-white">
                  {locale === "el" ? image.caption_el : image.caption_en}
                </figcaption>
              )}
            </figure>
          ))}
        </div>
      ) : (
        <p className="mt-12 rounded-2xl border border-sand-dark bg-white p-10 text-center text-ink-soft">
          {dict.gallery.empty}
        </p>
      )}
    </div>
  );
}
