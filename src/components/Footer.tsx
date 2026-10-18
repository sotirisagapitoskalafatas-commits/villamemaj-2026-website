import Link from "next/link";
import { SITE_CONFIG, type Locale } from "@/lib/site";
import type { Dictionary } from "@/lib/i18n";

interface FooterProps {
  locale: Locale;
  dict: Dictionary;
}

export default function Footer({ locale, dict }: FooterProps) {
  const year = new Date().getFullYear();

  const links = [
    { href: `/${locale}/rooms`, label: dict.nav.rooms },
    { href: `/${locale}/gallery`, label: dict.nav.gallery },
    { href: `/${locale}/booking`, label: dict.nav.booking },
    { href: `/${locale}/contact`, label: dict.nav.contact },
  ];

  return (
    <footer className="mt-auto bg-olive-dark text-cream/90">
      <div className="mx-auto grid max-w-6xl gap-10 px-4 py-14 sm:px-6 md:grid-cols-3">
        <div>
          <p className="font-display text-2xl font-semibold text-cream">
            {SITE_CONFIG.name}
          </p>
          <p className="mt-3 max-w-xs text-sm leading-relaxed text-cream/70">
            {dict.footer.tagline}
          </p>
        </div>

        <div>
          <p className="section-label text-gold-soft">{dict.footer.quickLinks}</p>
          <ul className="mt-4 space-y-2 text-sm">
            {links.map((link) => (
              <li key={link.href}>
                <Link href={link.href} className="text-cream/80 hover:text-cream">
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <p className="section-label text-gold-soft">{dict.footer.contact}</p>
          <ul className="mt-4 space-y-2 text-sm text-cream/80">
            <li>
              <a href={`tel:${SITE_CONFIG.phone.replace(/\s/g, "")}`}>
                {SITE_CONFIG.phone}
              </a>
            </li>
            <li>
              <a href={`mailto:${SITE_CONFIG.email}`}>{SITE_CONFIG.email}</a>
            </li>
            <li>{SITE_CONFIG.address[locale]}</li>
          </ul>
        </div>
      </div>

      <div className="border-t border-cream/10 py-5 text-center text-xs text-cream/50">
        © {year} {SITE_CONFIG.name}. {dict.footer.rights}
      </div>
    </footer>
  );
}
