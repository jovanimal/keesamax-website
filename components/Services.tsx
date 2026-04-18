import Image from "next/image";
import { ArrowRight } from "lucide-react";
import { services } from "@/data/services";
import { Button } from "@/components/ui/Button";
import { ScrollReveal } from "@/components/ui/ScrollReveal";

export function Services() {
  return (
    <section id="services" className="section-py bg-white">
      <div className="container-base">
        <ScrollReveal className="mb-16 grid items-end gap-6 md:grid-cols-2 md:gap-14">
          <div>
            <div className="eyebrow">What We Do</div>
            <h2 className="mb-4">
              Tailored talent solutions
              <br />
              for every stage.
            </h2>
            <p className="section-lead">
              From executive search to career transition support, we deliver
              personalized recruitment services aligned with your business goals.
            </p>
          </div>
          <div className="md:justify-self-end">
            <Button href="#contact" variant="outline">
              Discuss Your Needs →
            </Button>
          </div>
        </ScrollReveal>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {services.map((service, i) => (
            <ScrollReveal
              key={service.number}
              delay={(i + 1) as 1 | 2 | 3}
              className="group flex flex-col overflow-hidden rounded-[var(--radius-lg)] border border-[var(--color-slate-200)] bg-white transition-all duration-[400ms] ease-[var(--ease-brand)] hover:-translate-y-1 hover:border-[var(--color-navy-900)] hover:shadow-[var(--shadow-lg)]"
            >
              <div className="relative aspect-[16/10] overflow-hidden bg-[var(--color-slate-100)]">
                <span className="absolute left-4 top-4 z-10 flex size-9 items-center justify-center rounded-lg bg-white font-display text-sm font-bold text-[var(--color-navy-900)]">
                  {service.number}
                </span>
                <Image
                  src={service.image}
                  alt={service.alt}
                  fill
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  className="object-cover transition-transform duration-700 ease-[var(--ease-brand)] group-hover:scale-105"
                />
              </div>
              <div className="flex flex-grow flex-col px-7 py-8">
                <h3 className="mb-3 -tracking-[0.01em]">{service.title}</h3>
                <p className="mb-5 flex-grow text-[0.9375rem] leading-[1.7] text-[var(--color-slate-600)]">
                  {service.description}
                </p>
                {/* <a
                  href="#contact"
                  className="inline-flex items-center gap-2 text-[0.9375rem] font-semibold text-[var(--color-slate-900)] transition-all duration-[250ms] ease-[var(--ease-brand)] group-hover:gap-3.5 group-hover:text-[var(--color-blue-600)]"
                >
                  Learn more
                  <ArrowRight className="size-4" />
                </a> */}
              </div>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  );
}
