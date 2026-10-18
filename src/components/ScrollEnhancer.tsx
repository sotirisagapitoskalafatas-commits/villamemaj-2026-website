"use client";

import { useEffect } from "react";

/**
 * Small, dependency-free scroll controller.
 * - IntersectionObserver handles one-time entrance reveals.
 * - One requestAnimationFrame loop updates a tiny progress bar and only the
 *   few visible parallax layers; it never reads layout after writing styles.
 * - Reduced-motion users receive the final, readable state immediately.
 */
export default function ScrollEnhancer() {
  useEffect(() => {
    const progress = document.querySelector<HTMLElement>("[data-scroll-progress]");
    const reveals = Array.from(
      document.querySelectorAll<HTMLElement>(
        ".reveal-from-left, .reveal-from-right, .reveal-from-bottom, .reveal-from-top, .scale-reveal, .stagger-reveal"
      )
    );
    const parallax = Array.from(
      document.querySelectorAll<HTMLElement>("[data-parallax]")
    );
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (reducedMotion) {
      reveals.forEach((element) => element.classList.add("is-visible"));
      if (progress) progress.style.transform = "scaleX(1)";
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        });
      },
      { threshold: 0.14, rootMargin: "0px 0px -7% 0px" }
    );

    reveals.forEach((element) => observer.observe(element));

    let frame = 0;
    const update = () => {
      frame = 0;
      const maxScroll = Math.max(
        1,
        document.documentElement.scrollHeight - window.innerHeight
      );
      const ratio = Math.min(1, Math.max(0, window.scrollY / maxScroll));
      if (progress) progress.style.transform = "scaleX(" + ratio + ")";

      const viewport = window.innerHeight;
      parallax.forEach((element) => {
        const rect = element.getBoundingClientRect();
        if (rect.bottom < -120 || rect.top > viewport + 120) return;
        const distance = Number(element.dataset.parallax || 28);
        const visibleTravel = (viewport - rect.top) / (viewport + rect.height);
        const offset = (0.5 - visibleTravel) * distance;
        element.style.setProperty("--parallax-y", offset.toFixed(1) + "px");
      });
    };

    const requestUpdate = () => {
      if (!frame) frame = window.requestAnimationFrame(update);
    };

    update();
    window.addEventListener("scroll", requestUpdate, { passive: true });
    window.addEventListener("resize", requestUpdate, { passive: true });

    return () => {
      observer.disconnect();
      window.removeEventListener("scroll", requestUpdate);
      window.removeEventListener("resize", requestUpdate);
      if (frame) window.cancelAnimationFrame(frame);
    };
  }, []);

  return (
    <div
      data-scroll-progress
      aria-hidden="true"
      className="scroll-progress"
    />
  );
}
