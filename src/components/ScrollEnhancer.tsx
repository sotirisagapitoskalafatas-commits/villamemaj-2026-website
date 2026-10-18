"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

/**
 * Accessible scroll motion:
 * - IntersectionObserver provides one-time reveal states.
 * - GSAP ScrollTrigger scrubs the key editorial layers against page progress.
 * - A single requestAnimationFrame updates a small progress bar and visible
 *   fallback parallax layers; geometry reads happen before style writes.
 * - Reduced-motion users receive the final, readable state without movement.
 */
export default function ScrollEnhancer() {
  const pathname = usePathname();

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

    // ScrollTrigger is reserved for only three prominent visual layers.
    // Scrubbing is smooth but bounded, and every trigger is reverted on route changes.
    const gsapContext = gsap.context(() => {
      document.querySelectorAll<HTMLElement>('[data-scroll-scrub="hero-frame"]').forEach((element) => {
        gsap.to(element, {
          yPercent: 9,
          rotation: -1.5,
          scale: 1.025,
          ease: "none",
          scrollTrigger: {
            trigger: element,
            start: "top bottom",
            end: "bottom top",
            scrub: 0.8,
            invalidateOnRefresh: true,
          },
        });
      });

      document.querySelectorAll<HTMLElement>('[data-scroll-scrub="story-image"]').forEach((element) => {
        gsap.to(element, {
          yPercent: -7,
          rotation: -1,
          ease: "none",
          scrollTrigger: {
            trigger: element,
            start: "top bottom",
            end: "bottom top",
            scrub: 1,
            invalidateOnRefresh: true,
          },
        });
      });

      document.querySelectorAll<HTMLElement>('[data-scroll-scrub="energy-trail"]').forEach((element) => {
        gsap.fromTo(
          element,
          { yPercent: 8, rotation: -4, scaleY: 0.92 },
          {
            yPercent: -12,
            rotation: 5,
            scaleY: 1.04,
            ease: "none",
            scrollTrigger: {
              trigger: element,
              start: "top bottom",
              end: "bottom top",
              scrub: 1.2,
              invalidateOnRefresh: true,
            },
          }
        );
      });
    });

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
      const visible = parallax
        .map((element) => ({ element, rect: element.getBoundingClientRect() }))
        .filter(({ rect }) => rect.bottom >= -120 && rect.top <= viewport + 120);

      visible.forEach(({ element, rect }) => {
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
      gsapContext.revert();
      window.removeEventListener("scroll", requestUpdate);
      window.removeEventListener("resize", requestUpdate);
      if (frame) window.cancelAnimationFrame(frame);
    };
  }, [pathname]);

  return <div data-scroll-progress aria-hidden="true" className="scroll-progress" />;
}
