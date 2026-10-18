"use client";

import { useState, type FormEvent } from "react";
import { getSupabase } from "@/lib/supabase";
import type { Dictionary } from "@/lib/i18n";

const inputClass =
  "w-full rounded-xl border border-sand-dark bg-white px-4 py-3 text-sm text-ink outline-none transition-colors focus:border-olive focus:ring-2 focus:ring-olive/20";

export default function ContactForm({ dict }: { dict: Dictionary }) {
  const [status, setStatus] = useState<"idle" | "sending" | "success" | "error">("idle");

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const fd = new FormData(form);

    setStatus("sending");
    const { error } = await getSupabase().from("hotel_contact_messages").insert({
      guest_name: String(fd.get("guest_name") ?? "").trim(),
      guest_email: String(fd.get("guest_email") ?? "").trim(),
      subject: String(fd.get("subject") ?? "").trim() || null,
      message: String(fd.get("message") ?? "").trim(),
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
          {dict.contact.successTitle}
        </p>
        <p className="mt-3 text-sm text-ink-soft">{dict.contact.successText}</p>
        <button
          type="button"
          onClick={() => setStatus("idle")}
          className="mt-6 rounded-full border border-olive/30 px-6 py-2 text-sm font-medium text-olive hover:bg-olive hover:text-cream"
        >
          {dict.contact.newMessage}
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label htmlFor="guest_name" className="mb-1 block text-sm font-medium text-ink">
            {dict.contact.name} *
          </label>
          <input id="guest_name" name="guest_name" required maxLength={120} className={inputClass} />
        </div>
        <div>
          <label htmlFor="guest_email" className="mb-1 block text-sm font-medium text-ink">
            {dict.contact.email} *
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

      <div>
        <label htmlFor="subject" className="mb-1 block text-sm font-medium text-ink">
          {dict.contact.subject}
        </label>
        <input id="subject" name="subject" maxLength={200} className={inputClass} />
      </div>

      <div>
        <label htmlFor="message" className="mb-1 block text-sm font-medium text-ink">
          {dict.contact.message} *
        </label>
        <textarea id="message" name="message" rows={6} required maxLength={3000} className={inputClass} />
      </div>

      {status === "error" && (
        <p className="rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700">{dict.contact.errorText}</p>
      )}

      <button
        type="submit"
        disabled={status === "sending"}
        className="w-full rounded-full bg-olive py-3.5 text-sm font-semibold text-cream transition-colors hover:bg-olive-dark disabled:opacity-60 sm:w-auto sm:px-10"
      >
        {status === "sending" ? dict.contact.sending : dict.contact.submit}
      </button>
    </form>
  );
}
