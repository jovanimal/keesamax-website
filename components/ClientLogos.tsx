import Image from "next/image";
import { clients } from "@/data/clients";

export function ClientLogos() {
  return (
    <section className="border-b border-[var(--color-slate-200)]/60 bg-[var(--color-cream)] py-20">
      <div className="container-base">
        <div className="mx-auto mb-12 max-w-[640px] text-center">
          <div className="eyebrow">Trusted By Leading Brands</div>
          <h2 className="mb-4">
            Partnering with global
            <br />
            organisations.
          </h2>
          <p className="section-lead mx-auto">
            We help industry leaders across APAC and EMEA transform careers
            and build world-class teams.
          </p>
        </div>

        <ul className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
          {clients.map((client) => (
            <li
              key={client.name}
              className="group relative flex aspect-[5/2] items-center justify-center rounded-[var(--radius-md)] border border-[var(--color-slate-200)]/60 bg-white px-6 py-5 transition-all duration-[250ms] ease-[var(--ease-brand)] hover:-translate-y-0.5 hover:border-[var(--color-slate-300)] hover:shadow-[var(--shadow-sm)]"
            >
              <Image
                src={client.logo}
                alt={client.name}
                fill
                sizes="(max-width: 640px) 45vw, (max-width: 1024px) 30vw, 210px"
                className="object-contain p-6 opacity-60 grayscale transition-all duration-[250ms] ease-[var(--ease-brand)] group-hover:opacity-100 group-hover:grayscale-0"
              />
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
