export const SITE_CONFIG = {
  name: "Villa Memaj",
  tagline: {
    el: "Ησυχία, φως και θάλασσα σε ένα μέρος",
    en: "Peace, light and sea in one place",
  },
  email: "info@villamemaj.com",
  phone: "+355 69 000 0000",
  address: {
    el: "Αλβανία",
    en: "Albania",
  },
  currency: "€",
} as const;

export type Locale = "el" | "en";

export const LOCALES: Locale[] = ["el", "en"];
export const DEFAULT_LOCALE: Locale = "el";

export function isLocale(value: string): value is Locale {
  return LOCALES.includes(value as Locale);
}
