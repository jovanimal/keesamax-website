import { Building2, Globe } from "lucide-react";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { ScrollReveal } from "@/components/ui/ScrollReveal";
import { industries, countries } from "@/data/industries";
import { cn } from "@/lib/utils";

interface TimelineEntry {
  year: string;
  title: string;
  body: string;
  accent?: boolean;
}

const timeline: TimelineEntry[] = [
  {
    year: "2013",
    title: "Keesamac Enterprise",
    body: "Started as a sole proprietorship focused on headhunting services and career coaching.",
  },
  {
    year: "2013–2023",
    title: "Growth & Expansion",
    body: "Expanded across industries and countries, placing candidates at all levels including C-suite executives.",
    accent: true,
  },
  {
    year: "2024",
    title: "Keesamax Sdn Bhd",
    body: "Incorporated as Keesamax Sdn Bhd (202401002894) to better serve our growing client base.",
  },
];

export function About() {
  return (
    <section id="about" className="section-py bg-white">
      <div className="container-base">
        <ScrollReveal className="mx-auto mb-[72px] max-w-[680px] text-center">
          <SectionHeading
            align="center"
            eyebrow="Our Story"
            title={
              <>
                A decade of placing
                <br />
                exceptional talent.
              </>
            }
            lead="From a sole proprietorship to an incorporated firm — our journey reflects our commitment to growth, relationships, and excellence."
          />
        </ScrollReveal>

        <ScrollReveal className="relative mb-20 grid gap-8 md:grid-cols-3">
          <span
            aria-hidden
            className="absolute left-[16.67%] right-[16.67%] top-[50px] hidden h-0.5 md:block"
            style={{
              background:
                "linear-gradient(90deg, var(--color-slate-200), var(--color-accent), var(--color-slate-200))",
            }}
          />
          {timeline.map((item, i) => (
            <div
              key={item.year}
              className={cn(
                "relative md:text-center",
                "max-md:border-l-2 max-md:border-[var(--color-slate-200)] max-md:pb-7 max-md:pl-8",
                i === timeline.length - 1 && "max-md:border-l-transparent max-md:pb-0",
              )}
            >
              <div className="font-display text-[2rem] font-extrabold leading-none -tracking-[0.03em] text-[var(--color-navy-900)]">
                {item.year}
              </div>
              <div
                className={cn(
                  "relative z-10 size-4 rounded-full border-[3px] bg-white shadow-[0_0_0_6px_white] max-md:absolute max-md:-left-[9px] max-md:top-1.5 max-md:m-0 md:mx-auto md:mb-6 md:mt-[42px]",
                  item.accent
                    ? "border-[var(--color-accent)]"
                    : "border-[var(--color-navy-900)]",
                )}
              />
              <h4 className="mb-2.5 mt-1 font-display text-[1.125rem] font-bold text-[var(--color-slate-900)]">
                {item.title}
              </h4>
              <p className="mx-auto max-w-[300px] text-sm leading-[1.6] text-[var(--color-slate-600)] max-md:mx-0">
                {item.body}
              </p>
            </div>
          ))}
        </ScrollReveal>

        <ScrollReveal className="grid gap-6 md:grid-cols-2">
          <ReachCard
            icon={<Building2 className="size-5 text-[var(--color-blue-600)]" />}
            title="Industries We Serve"
            items={industries.map((i) => i.name)}
          />
          <ReachCard
            icon={<Globe className="size-5 text-[var(--color-blue-600)]" />}
            title="Countries We Reach"
            items={countries.map((c) => `${c.flag} ${c.name}`)}
          />
        </ScrollReveal>
      </div>
    </section>
  );
}

interface ReachCardProps {
  icon: React.ReactNode;
  title: string;
  items: string[];
}

function ReachCard({ icon, title, items }: ReachCardProps) {
  return (
    <div
      id={title === "Industries We Serve" ? "industries" : undefined}
      className="rounded-[var(--radius-lg)] border border-[var(--color-slate-100)] bg-[var(--color-slate-50)] p-9"
    >
      <h3 className="mb-5 flex items-center gap-2.5">
        {icon}
        {title}
      </h3>
      <div className="flex flex-wrap gap-2">
        {items.map((label) => (
          <span
            key={label}
            className="rounded-full border border-[var(--color-slate-200)] bg-white px-3.5 py-2 text-[0.8125rem] font-medium text-[var(--color-slate-700)] transition-all duration-200 hover:border-[var(--color-navy-900)] hover:bg-[var(--color-navy-900)] hover:text-white"
          >
            {label}
          </span>
        ))}
      </div>
    </div>
  );
}
