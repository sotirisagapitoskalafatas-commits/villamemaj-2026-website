import Link from "next/link";

export default function NotFound() {
  return (
    <div className="mx-auto flex max-w-6xl flex-col items-center px-4 py-32 text-center sm:px-6">
      <p className="section-label">404</p>
      <h1 className="mt-3 font-display text-5xl font-semibold text-ink">
        Villa Memaj
      </h1>
      <p className="mt-4 max-w-md text-ink-soft">
        Η σελίδα δεν βρέθηκε · Page not found
      </p>
      <div className="mt-8 flex gap-4">
        <Link
          href="/el"
          className="rounded-full bg-olive px-8 py-3 text-sm font-semibold text-cream hover:bg-olive-dark"
        >
          Αρχική (EL)
        </Link>
        <Link
          href="/en"
          className="rounded-full border border-olive/30 px-8 py-3 text-sm font-semibold text-olive hover:bg-olive hover:text-cream"
        >
          Home (EN)
        </Link>
      </div>
    </div>
  );
}
