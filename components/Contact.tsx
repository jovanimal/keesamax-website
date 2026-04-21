import { Phone, Mail, Building2 } from "lucide-react";
import { site } from "@/data/site";
import { ScrollReveal } from "@/components/ui/ScrollReveal";
import { ContactForm } from "@/components/ContactForm";

interface Method {
  icon: React.ReactNode;
  title: string;
  value: string;
  href?: string;
}

const methods: Method[] = [
  {
    icon: <Building2 className="size-5" />,
    title: "Company",
    value: `${site.legalName} [${site.registration}]`,
  },
];

export function Contact() {
  return (
    <section id="contact" className="section-py bg-[var(--color-cream)]">
      <div className="container-base">
        <div className="grid items-start gap-12 lg:grid-cols-[1fr_1.1fr] lg:gap-[72px]">
          <ScrollReveal>
            <div className="eyebrow">Get in Touch</div>
            <h2 className="mb-4">
              Let&apos;s start a
              <br />
              conversation.
            </h2>
            <p className="mb-10 max-w-[420px] text-[1.0625rem] leading-[1.7] text-[var(--color-slate-600)]">
              Whether you&apos;re looking to fill a critical role or exploring
              your next career move, we&apos;d love to hear from you.
            </p>

            <div className="mb-9 flex flex-col gap-5">
              {methods.map((m) => {
                const content = (
                  <>
                    <span className="flex size-11 shrink-0 items-center justify-center rounded-[10px] bg-white text-[var(--color-navy-900)] shadow-[var(--shadow-xs)]">
                      {m.icon}
                    </span>
                    <div>
                      <strong className="mb-0.5 block text-[0.9375rem] font-bold text-[var(--color-slate-900)]">
                        {m.title}
                      </strong>
                      <span className="text-sm text-[var(--color-slate-500)]">
                        {m.value}
                      </span>
                    </div>
                  </>
                );
                const className =
                  "flex items-center gap-[18px] rounded-[var(--radius-md)] border border-[var(--color-slate-200)]/70 bg-white p-5 transition-all duration-200 hover:border-[var(--color-slate-300)] hover:shadow-[var(--shadow-sm)]";
                return m.href ? (
                  <a
                    key={m.title}
                    href={m.href}
                    className={className}
                    target={m.href.startsWith("http") ? "_blank" : undefined}
                    rel={m.href.startsWith("http") ? "noopener noreferrer" : undefined}
                  >
                    {content}
                  </a>
                ) : (
                  <div key={m.title} className={className}>
                    {content}
                  </div>
                );
              })}
            </div>
          </ScrollReveal>

          <ScrollReveal delay={2}>
            <ContactForm />
          </ScrollReveal>
        </div>
      </div>
    </section>
  );
}

function WhatsAppGlyph({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="currentColor" aria-hidden>
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z" />
      <path d="M12 0C5.373 0 0 5.373 0 12c0 2.125.553 4.12 1.522 5.857L.06 23.488a.5.5 0 00.612.612l5.631-1.462A11.947 11.947 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 22c-1.94 0-3.782-.546-5.382-1.564l-.386-.236-3.346.869.87-3.346-.236-.386A9.95 9.95 0 012 12C2 6.486 6.486 2 12 2s10 4.486 10 10-4.486 10-10 10z" />
    </svg>
  );
}
