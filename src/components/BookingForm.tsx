"use client";

import { useState, type FormEvent } from "react";
import { getSupabase } from "@/lib/supabase";
import type { Dictionary } from "@/lib/i18n";
import type { HotelRoom } from "@/lib/types";

const inputClass =
  "w-full rounded-xl border border-sand-dark bg-white px-4 py-3 text-sm text-ink outline-none transition-colors focus:border-olive focus:ring-2 focus:ring-olive/20";

interface BookingFormProps {
  rooms: HotelRoom[];
  dict: Dictionary;
  initialRoomSlug?: string | null;
}

export default function BookingForm({ rooms, dict, initialRoomSlug }: BookingFormProps) {
  const [status, setStatus] = useState<"idle" | "sending" | "success" | "error">("idle");

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const fd = new FormData(form);

    const checkIn = String(fd.get("check_in") ?? "");
    const checkOut = String(fd.get("check_out") ?? "");
    if (checkOut <= checkIn) {
      setStatus("error");
      return;
    }

    setStatus("sending");
    const roomSlug = String(fd.get("room_id") ?? "");
    const room = rooms.find((r) => r.slug === roomSlug);

    const { error } = await getSupabase().from("hotel_bookings").insert({
      room_id: room?.id ?? null,
      guest_name: String(fd.get("guest_name") ?? "").trim(),
      guest_email: String(fd.get("guest_email") ?? "").trim(),
      guest_phone: String(fd.get("guest_phone") ?? "").trim() || null,
      check_in: checkIn,
      check_out: checkOut,
      guests: Number(fd.get("guests") ?? 1),
      message: String(fd.get("message") ?? "").trim() || null,
    });

    if (error) {
      setStatus("error");
      return;
    }
    setStatus("success");
    form.reset();
  }

  if (status === "success") {
    return (
      <div className="rounded-2xl border border-olive/30 bg-white p-8 text-center">
        <p className="font-display text-2xl font-semibold text-olive">
          {dict.booking.successTitle}
        </p>
        <p className="mt-3 text-sm text-ink-soft">{dict.booking.successText}</p>
        <button
          type="button"
          onClick={() => setStatus("idle")}
          className="mt-6 rounded-full border border-olive/30 px-6 py-2 text-sm font-medium text-olive hover:bg-olive hover:text-cream"
        >
          {dict.booking.newRequest}
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="room_id" className="mb-1 block text-sm font-medium text-ink">
          {dict.booking.roomLabel}
        </label>
        <select
          id="room_id"
          name="room_id"
          defaultValue={initialRoomSlug ?? ""}
          className={inputClass}
        >
          <option value="">{dict.booking.anyRoom}</option>
          {rooms.map((room) => (
            <option key={room.id} value={room.slug}>
              {room.name_el} — {room.name_en}
            </option>
          ))}
        </select>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label htmlFor="guest_name" className="mb-1 block text-sm font-medium text-ink">
            {dict.booking.name} *
          </label>
          <input id="guest_name" name="guest_name" required maxLength={120} className={inputClass} />
        </div>
        <div>
          <label htmlFor="guest_email" className="mb-1 block text-sm font-medium text-ink">
            {dict.booking.email} *
          </label>
          <input
            id="guest_email"
            name="guest_email"
            type="email"
            required
            maxLength={200}
            className={inputClass}
          />
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label htmlFor="guest_phone" className="mb-1 block text-sm font-medium text-ink">
            {dict.booking.phone}
          </label>
          <input id="guest_phone" name="guest_phone" type="tel" maxLength={40} className={inputClass} />
        </div>
        <div>
          <label htmlFor="guests" className="mb-1 block text-sm font-medium text-ink">
            {dict.booking.guests} *
          </label>
          <input
            id="guests"
            name="guests"
            type="number"
            min={1}
            max={12}
            defaultValue={2}
            required
            className={inputClass}
          />
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label htmlFor="check_in" className="mb-1 block text-sm font-medium text-ink">
            {dict.booking.checkIn} *
          </label>
          <input id="check_in" name="check_in" type="date" required className={inputClass} />
        </div>
        <div>
          <label htmlFor="check_out" className="mb-1 block text-sm font-medium text-ink">
            {dict.booking.checkOut} *
          </label>
          <input id="check_out" name="check_out" type="date" required className={inputClass} />
        </div>
      </div>

      <div>
        <label htmlFor="message" className="mb-1 block text-sm font-medium text-ink">
          {dict.booking.message}
        </label>
        <textarea
          id="message"
          name="message"
          rows={4}
          maxLength={2000}
          placeholder={dict.booking.messagePlaceholder}
          className={inputClass}
        />
      </div>

      {status === "error" && (
        <p className="rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700">{dict.booking.errorText}</p>
      )}

      <button
        type="submit"
        disabled={status === "sending"}
        className="w-full rounded-full bg-olive py-3.5 text-sm font-semibold text-cream transition-colors hover:bg-olive-dark disabled:opacity-60 sm:w-auto sm:px-10"
      >
        {status === "sending" ? dict.booking.sending : dict.booking.submit}
      </button>
    </form>
  );
}
