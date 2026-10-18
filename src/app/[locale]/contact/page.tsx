import type { Metadata } from "next";
import ContactForm from "@/components/ContactForm";
import { getDictionary } from "@/lib/i18n";
import { isLocale, SITE_CONFIG, type Locale } from "@/lib/site";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const dict = await getDictionary(isLocale(locale) ? (locale as Locale) : "el");
  return { title: dict.nav.contact, description: dict.contact.subtitle };
}

export default async function ContactPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!isLocale(locale)) return null;
  const dict = await getDictionary(locale as Locale);

  return (
    <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
      <p className="section-label">{dict.nav.contact}</p>
      <h1 className="mt-3 font-display text-5xl font-semibold text-ink">
        {dict.contact.title}
      </h1>
      <p className="mt-4 max-w-2xl text-ink-soft">{dict.contact.subtitle}</p>

      <div className="mt-12 grid gap-10 lg:grid-cols-5">
        <div className="space-y-6 lg:col-span-2">
          <div className="rounded-2xl border border-sand-dark bg-white p-6">
            <p className="section-label">{dict.contact.phoneLabel}</p>
            <a
              href={`tel:${SITE_CONFIG.phone.replace(/\s/g, "")}`}
              className="mt-2 block text-lg font-medium text-ink hover:text-olive"
            >
              {SITE_CONFIG.phone}
            </a>
          </div>
          <div className="rounded-2xl border border-sand-dark bg-white p-6">
            <p className="section-label">{dict.contact.emailLabel}</p>
            <a
              href={`mailto:${SITE_CONFIG.email}`}
              className="mt-2 block text-lg font-medium text-ink hover:text-olive"
            >
              {SITE_CONFIG.email}
            </a>
          </div>
          <div className="rounded-2xl border border-sand-dark bg-white p-6">
            <p className="section-label">{dict.contact.addressLabel}</p>
            <p className="mt-2 text-lg font-medium text-ink">
              {SITE_CONFIG.address[locale]}
            </p>
          </div>
        </div>

        <div className="rounded-2xl border border-sand-dark bg-sand/40 p-6 sm:p-10 lg:col-span-3">
          <ContactForm dict={dict} />
        </div>
      </div>
    </div>
  );
}
