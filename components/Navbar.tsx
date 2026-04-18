"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Menu, X } from "lucide-react";
import { cn } from "@/lib/utils";

const navLinks: { label: string; href: string }[] = [
  { label: "Services", href: "#services" },
  { label: "Why Us", href: "#why-us" },
  { label: "About", href: "#about" },
  { label: "Jobs", href: "#jobs" },
];

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const onScroll = (): void => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = mobileOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileOpen]);

  return (
    <nav
      className={cn(
        "fixed inset-x-0 top-0 z-50 transition-all duration-300 ease-[var(--ease-brand)]",
        scrolled
          ? "bg-white/95 py-[14px] shadow-[0_1px_0_rgba(15,23,42,0.06)] backdrop-blur-xl backdrop-saturate-150"
          : "py-5",
      )}
    >
      <div className="container-base">
        <div className="flex items-center justify-between">
          <Link href="#" className="flex items-center gap-2.5">
            <span className="relative flex size-9 items-center justify-center overflow-hidden rounded-lg bg-[var(--color-navy-900)] font-display text-base font-extrabold text-white">
              <span className="pointer-events-none absolute -right-1/2 -top-1/2 size-full rotate-45 bg-[var(--color-accent)] opacity-40" />
              <span className="relative">K</span>
            </span>
            <span className="font-display text-[1.375rem] font-extrabold tracking-tight text-[var(--color-slate-900)]">
              Keesamax
            </span>
          </Link>

          <ul className="hidden items-center gap-10 md:flex">
            {navLinks.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className="text-[0.9375rem] font-medium text-[var(--color-slate-600)] transition-colors hover:text-[var(--color-slate-900)]"
                >
                  {link.label}
                </Link>
              </li>
            ))}
            <li>
              <Link
                href="#contact"
                className="inline-flex items-center justify-center gap-2 rounded-[var(--radius-sm)] bg-[var(--color-navy-900)] px-5 py-2.5 text-sm font-semibold text-white shadow-[0_2px_8px_rgba(15,35,65,0.2)] transition-all duration-[250ms] ease-[var(--ease-brand)] hover:-translate-y-px hover:bg-[var(--color-navy-800)] hover:shadow-[0_6px_20px_rgba(15,35,65,0.3)]"
              >
                Get in Touch
              </Link>
            </li>
          </ul>

          <button
            type="button"
            aria-label={mobileOpen ? "Close menu" : "Open menu"}
            aria-expanded={mobileOpen}
            onClick={() => setMobileOpen((v) => !v)}
            className="flex size-8 items-center justify-center text-[var(--color-slate-900)] md:hidden"
          >
            {mobileOpen ? <X className="size-6" /> : <Menu className="size-6" />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      <div
        className={cn(
          "fixed inset-x-0 top-[calc(100%+0px)] z-40 origin-top bg-white/98 backdrop-blur-xl transition-all duration-300 md:hidden",
          mobileOpen
            ? "pointer-events-auto h-screen opacity-100"
            : "pointer-events-none h-0 opacity-0",
        )}
      >
        <ul className="container-base flex flex-col gap-1 py-6">
          {navLinks.map((link) => (
            <li key={link.href}>
              <Link
                href={link.href}
                onClick={() => setMobileOpen(false)}
                className="block rounded-lg px-3 py-3 text-base font-medium text-[var(--color-slate-700)] transition-colors hover:bg-[var(--color-slate-50)]"
              >
                {link.label}
              </Link>
            </li>
          ))}
          <li className="mt-2">
            <Link
              href="#contact"
              onClick={() => setMobileOpen(false)}
              className="block rounded-[var(--radius-sm)] bg-[var(--color-navy-900)] px-4 py-3 text-center text-base font-semibold text-white"
            >
              Get in Touch
            </Link>
          </li>
        </ul>
      </div>
    </nav>
  );
}
