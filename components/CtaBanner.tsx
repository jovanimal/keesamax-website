import { site } from "@/data/site";
import { Button } from "@/components/ui/Button";
import { ScrollReveal } from "@/components/ui/ScrollReveal";

export function CtaBanner() {
  return (
    <section className="relative overflow-hidden bg-[var(--color-navy-900)] py-20 text-white">
      <span
        aria-hidden
        className="pointer-events-none absolute -right-[10%] -top-[50%] size-[500px] rounded-full"
        style={{
          background:
            "radial-gradient(circle, rgba(212,165,116,0.15), transparent 70%)",
        }}
      />
      <div className="container-base relative">
        <ScrollReveal className="grid items-center gap-7 md:grid-cols-[2fr_1fr] md:gap-10">
          <div>
            <h2 className="mb-3.5 text-white">
              Ready to find your next hire
              <br />
              or your next role?
            </h2>
            <p className="max-w-[560px] text-[1.0625rem] leading-[1.6] text-[var(--color-slate-300)]">
              Let&apos;s have a conversation about what you&apos;re looking for —
              whether you&apos;re hiring or exploring your next move.
            </p>
          </div>
          <div className="flex flex-wrap gap-3 md:justify-self-end">
            <Button href="#contact" variant="accent">
              Get in Touch →
            </Button>
            <Button href={site.whatsapp.url} variant="outline-light">
              WhatsApp Us
            </Button>
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}
