import Image from "next/image";
import { ArrowRight, Briefcase, Star } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { jobs } from "@/data/jobs";

const trustAvatars: string[] = [
  "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=120&h=120&fit=crop&crop=faces",
  "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=120&h=120&fit=crop&crop=faces",
  "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=120&h=120&fit=crop&crop=faces",
  "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=120&h=120&fit=crop&crop=faces",
];

export function Hero() {
  const openRoles = jobs.length;

  return (
    <section
      id="hero"
      className="relative overflow-hidden bg-[var(--color-cream)] pb-24 pt-[140px] md:pb-[100px]"
    >
      <div
        aria-hidden
        className="pointer-events-none absolute inset-y-0 right-0 w-[55%]"
        style={{
          background:
            "radial-gradient(ellipse at top right, rgba(212,165,116,0.12) 0%, transparent 60%), linear-gradient(180deg, rgba(15,35,65,0.02), transparent)",
        }}
      />

      <div className="container-base relative">
        <div className="grid items-center gap-12 lg:grid-cols-[1.1fr_1fr] lg:gap-20">
          <div className="animate-[fadeUp_1s_var(--ease-brand)]">
            <h1 className="mb-6">
              Connecting talent,
              <br />
              inspiring <span className="hero-highlight">growth</span>.
            </h1>

            <p className="mb-9 max-w-[520px] text-[1.125rem] leading-[1.7] text-[var(--color-slate-600)]">
              Based in Malaysia, we help companies across Southeast Asia find
              exceptional talent, from skilled professionals to C-suite
              executives. Relationship-driven. Multilingual. Proven.
            </p>

            <div className="mb-14 flex flex-wrap gap-3.5">
              <Button href="#contact" variant="primary">
                Start a Conversation
                <ArrowRight className="size-4" />
              </Button>
              <Button href="#jobs" variant="outline">
                View Open Positions
              </Button>
            </div>

            <div className="flex flex-col gap-3 border-t border-[var(--color-slate-200)] pt-8 sm:flex-row sm:items-center sm:gap-5">
              <div className="flex">
                {trustAvatars.map((src, i) => (
                  <span
                    key={src}
                    className="size-10 rounded-full border-[2.5px] border-[var(--color-cream)] bg-cover bg-center"
                    style={{
                      backgroundImage: `url(${src})`,
                      marginLeft: i === 0 ? 0 : -10,
                    }}
                  />
                ))}
              </div>
              <div>
                <strong className="block text-[0.9375rem] font-bold text-[var(--color-slate-900)]">
                  Trusted by 40+ leading companies
                </strong>
                <span className="text-[0.8125rem] text-[var(--color-slate-500)]">
                  Placements across 5+ countries in APAC
                </span>
              </div>
            </div>
          </div>

          <div className="relative mx-auto w-full max-w-[440px] lg:max-w-none">
            <span
              aria-hidden
              className="absolute -left-5 -top-5 -z-10 size-full rounded-[var(--radius-xl)] border-2 border-[var(--color-accent)] opacity-40"
            />
            <div className="relative aspect-[4/5] overflow-hidden rounded-[var(--radius-xl)] shadow-[var(--shadow-xl)]">
              <Image
                src="https://images.unsplash.com/photo-1556761175-5973dc0f32e7?w=800&h=1000&fit=crop"
                alt="Business professionals collaborating in a modern office"
                fill
                priority
                sizes="(max-width: 1024px) 100vw, 50vw"
                className="object-cover"
              />
            </div>

            <FloatCard
              className="top-8 right-0 lg:-right-10"
              icon={<Star className="size-5 text-[var(--color-blue-500)]" />}
              iconBg="bg-[var(--color-blue-50)]"
              label="Success Rate"
              value="92% Placement"
            />
            <FloatCard
              className="bottom-10 left-0 lg:-left-8"
              icon={<Briefcase className="size-5 text-[var(--color-emerald-600)]" />}
              iconBg="bg-[var(--color-emerald-50)]"
              label="Active Roles"
              value={`${openRoles} Positions Open`}
            />
          </div>
        </div>
      </div>
    </section>
  );
}

interface FloatCardProps {
  className: string;
  icon: React.ReactNode;
  iconBg: string;
  label: string;
  value: string;
}

function FloatCard({ className, icon, iconBg, label, value }: FloatCardProps) {
  return (
    <div
      className={`absolute flex items-center gap-3.5 rounded-[var(--radius-md)] bg-white px-[22px] py-[18px] shadow-[var(--shadow-lg)] ${className}`}
    >
      <span
        className={`flex size-11 shrink-0 items-center justify-center rounded-[10px] ${iconBg}`}
      >
        {icon}
      </span>
      <div>
        <div className="mb-0.5 text-xs font-medium text-[var(--color-slate-500)]">
          {label}
        </div>
        <div className="font-display text-[1.125rem] font-bold tracking-tight text-[var(--color-slate-900)]">
          {value}
        </div>
      </div>
    </div>
  );
}
