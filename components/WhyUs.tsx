import Image from "next/image";
import { Globe, Building2, Users, MapPin } from "lucide-react";
import { ScrollReveal } from "@/components/ui/ScrollReveal";
import type { ReactNode } from "react";

interface Feature {
  icon: ReactNode;
  title: string;
  body: string;
}

const features: Feature[] = [
  {
    icon: <Globe className="size-[22px]" />,
    title: "Multilingual Communication",
    body: "Fluent in English, Malay, Mandarin, Cantonese, Hokkien, and German for effective, personalized engagement across cultures.",
  },
  {
    icon: <Building2 className="size-[22px]" />,
    title: "Cross-Industry Expertise",
    body: "Consultants with diverse corporate backgrounds and deep market knowledge spanning automotive, tech, FMCG, healthcare, and more.",
  },
  {
    icon: <Users className="size-[22px]" />,
    title: "Relationship-First Approach",
    body: "We invest in understanding your team culture and long-term vision, not just filling a seat.",
  },
  {
    icon: <MapPin className="size-[22px]" />,
    title: "Regional Coverage",
    body: "Talent placed across Malaysia, Singapore, Australia, China, Japan, Korea, Hong Kong, India, Thailand, and Vietnam.",
  },
];

export function WhyUs() {
  return (
    <section id="why-us" className="section-py bg-[var(--color-slate-100)]">
      <div className="container-base">
        <div className="grid items-center gap-16 lg:grid-cols-[1fr_1.1fr] lg:gap-20">
          <ScrollReveal>
            <div className="eyebrow">Why Keesamax</div>
            <h2 className="mb-5">
              Boutique attention,
              <br />
              regional reach.
            </h2>
            <p className="mb-10 max-w-[480px] text-[1.05rem] leading-[1.7] text-[var(--color-slate-600)]">
              Unlike volume-driven agencies, we deliver solutions aligned with your
              culture, budget, and requirements. Every client receives our highest
              attention.
            </p>

            <div className="flex flex-col gap-7">
              {features.map((f) => (
                <div key={f.title} className="flex gap-[18px]">
                  <span className="flex size-12 min-w-12 shrink-0 items-center justify-center rounded-[10px] border border-[var(--color-slate-200)] bg-white text-[var(--color-navy-900)] shadow-[var(--shadow-sm)]">
                    {f.icon}
                  </span>
                  <div>
                    <h4 className="mb-1.5 font-display text-[1.0625rem] font-bold text-[var(--color-slate-900)]">
                      {f.title}
                    </h4>
                    <p className="text-[0.9375rem] leading-[1.65] text-[var(--color-slate-600)]">
                      {f.body}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </ScrollReveal>

          <ScrollReveal delay={2} className="relative">
            <div className="relative aspect-[5/4] overflow-hidden rounded-[var(--radius-xl)] shadow-[var(--shadow-xl)]">
              <Image
                src="https://images.unsplash.com/photo-1600880292089-90a7e086ee0c?w=800&h=640&fit=crop"
                alt="Recruitment consultants in conversation"
                fill
                sizes="(max-width: 1024px) 100vw, 50vw"
                className="object-cover"
              />
            </div>
            <div className="absolute -bottom-8 right-0 min-w-[200px] rounded-[var(--radius-lg)] bg-[var(--color-navy-900)] p-7 text-white shadow-[var(--shadow-xl)] lg:-right-8">
              <div className="mb-1.5 font-display text-[2.5rem] font-extrabold leading-none -tracking-[0.03em]">
                10<span className="text-[var(--color-accent)]">+</span>
              </div>
              <div className="text-sm font-medium text-[var(--color-slate-300)]">
                Years of proven placements across APAC
              </div>
            </div>
          </ScrollReveal>
        </div>
      </div>
    </section>
  );
}
