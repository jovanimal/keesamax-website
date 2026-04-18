import Link from "next/link";
import Image from "next/image";
import { site } from "@/data/site";

const navCols: { title: string; links: { label: string; href: string }[] }[] = [
  {
    title: "Navigation",
    links: [
      { label: "Services", href: "#services" },
      { label: "Why Us", href: "#why-us" },
      { label: "About", href: "#about" },
      { label: "Jobs", href: "#jobs" },
      { label: "Contact", href: "#contact" },
    ],
  },
  {
    title: "Services",
    links: [
      { label: "Recruitment", href: "#services" },
      { label: "Executive Search", href: "#services" },
      { label: "Career Coaching", href: "#services" },
    ],
  },
];

export function Footer() {
  return (
    <footer className="bg-[var(--color-navy-950)] px-0 pb-7 pt-[72px] text-white/65">
      <div className="container-base">
        <div className="mb-14 grid gap-10 md:grid-cols-2 lg:grid-cols-[2fr_1fr_1fr_1.3fr] lg:gap-14">
          <div>
            <Link href="/" aria-label="Keesamax · Home" className="mb-5 flex items-center">
              <Image
                src="/images/keesamax-logo-white.webp"
                alt="Keesamax"
                width={512}
                height={153}
                sizes="180px"
                className="h-10 w-auto"
              />
            </Link>
            <p className="mb-5 max-w-[320px] text-[0.9375rem] leading-[1.7]">
              A Malaysia-based recruitment firm connecting exceptional
              talent with leading companies across Southeast Asia since{" "}
              {site.founded}.
            </p>
            <div className="flex gap-2.5">
              <SocialIcon href={site.whatsapp.url} label="WhatsApp">
                <WhatsAppGlyph />
              </SocialIcon>
              <SocialIcon href={`mailto:${site.email.andrew}`} label="Email">
                <MailGlyph />
              </SocialIcon>
            </div>
          </div>

          {navCols.map((col) => (
            <div key={col.title}>
              <h4 className="mb-5 font-body text-sm font-bold uppercase tracking-[0.08em] text-white">
                {col.title}
              </h4>
              {col.links.map((l) => (
                <Link
                  key={l.label}
                  href={l.href}
                  className="mb-3 block text-[0.9375rem] text-white/65 transition-colors hover:text-white"
                >
                  {l.label}
                </Link>
              ))}
            </div>
          ))}

          <div>
            <h4 className="mb-5 font-body text-sm font-bold uppercase tracking-[0.08em] text-white">
              Get in Touch
            </h4>
            <a
              href={site.whatsapp.url}
              className="mb-3 block text-[0.9375rem] text-white/65 transition-colors hover:text-white"
            >
              {site.whatsapp.display}
            </a>
            <a
              href={`mailto:${site.email.andrew}`}
              className="mb-3 block text-[0.9375rem] text-white/65 transition-colors hover:text-white"
            >
              {site.email.andrew}
            </a>
            <div className="mb-3 block text-[0.9375rem] text-white/65">
              {site.legalName}
            </div>
            <div className="block text-[0.9375rem] text-white/65">
              {site.registration}
            </div>
          </div>
        </div>

        <div className="flex flex-col items-center justify-between gap-2 border-t border-white/10 pt-7 text-[0.8125rem] sm:flex-row">
          <span>
            &copy; {new Date().getFullYear()} {site.legalName} All rights reserved.
          </span>
          <span>Malaysia · Recruitment Specialists · Since {site.founded}</span>
        </div>
      </div>
    </footer>
  );
}

interface SocialIconProps {
  href: string;
  label: string;
  children: React.ReactNode;
}

function SocialIcon({ href, label, children }: SocialIconProps) {
  return (
    <a
      href={href}
      aria-label={label}
      target={href.startsWith("http") ? "_blank" : undefined}
      rel={href.startsWith("http") ? "noopener noreferrer" : undefined}
      className="flex size-[38px] items-center justify-center rounded-lg bg-white/8 text-white transition-colors hover:bg-white/20"
    >
      {children}
    </a>
  );
}

function MailGlyph() {
  return (
    <svg viewBox="0 0 24 24" className="size-4" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <rect x="3" y="5" width="18" height="14" rx="2" />
      <path d="m3 7 9 6 9-6" />
    </svg>
  );
}

function WhatsAppGlyph() {
  return (
    <svg viewBox="0 0 24 24" className="size-4" fill="currentColor" aria-hidden>
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z" />
      <path d="M12 0C5.373 0 0 5.373 0 12c0 2.125.553 4.12 1.522 5.857L.06 23.488a.5.5 0 00.612.612l5.631-1.462A11.947 11.947 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 22c-1.94 0-3.782-.546-5.382-1.564l-.386-.236-3.346.869.87-3.346-.236-.386A9.95 9.95 0 012 12C2 6.486 6.486 2 12 2s10 4.486 10 10-4.486 10-10 10z" />
    </svg>
  );
}
