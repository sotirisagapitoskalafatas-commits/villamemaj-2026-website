import type { Metadata } from "next";
import RoomCard from "@/components/RoomCard";
import { getDictionary } from "@/lib/i18n";
import { getRooms } from "@/lib/data";
import { isLocale, type Locale } from "@/lib/site";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const dict = await getDictionary(isLocale(locale) ? (locale as Locale) : "el");
  return { title: dict.nav.rooms, description: dict.rooms.subtitle };
}

export default async function RoomsPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!isLocale(locale)) return null;
  const dict = await getDictionary(locale as Locale);

  const rooms = await getRooms();

  return (
    <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
      <p className="section-label">{dict.nav.rooms}</p>
      <h1 className="mt-3 font-display text-5xl font-semibold text-ink">
        {dict.rooms.title}
      </h1>
      <p className="mt-4 max-w-2xl text-ink-soft">{dict.rooms.subtitle}</p>

      {rooms.length > 0 ? (
        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {rooms.map((room) => (
            <RoomCard key={room.id} room={room} locale={locale as Locale} dict={dict} />
          ))}
        </div>
      ) : (
        <p className="mt-12 rounded-2xl border border-sand-dark bg-white p-10 text-center text-ink-soft">
          {dict.rooms.empty}
        </p>
      )}
    </div>
  );
}
