import { clients } from "@/data/clients";

export function ClientLogos() {
  // Render twice for a seamless scroll loop
  const loop = [...clients, ...clients];
  return (
    <section className="border-b border-[var(--color-slate-100)] bg-white py-14">
      <div className="mb-8 text-center text-[0.8125rem] font-semibold uppercase tracking-[0.08em] text-[var(--color-slate-500)]">
        Trusted by leading global brands
      </div>
      <div className="logo-mask overflow-hidden">
        <div className="logo-track flex items-center gap-16">
          {loop.map((client, i) => (
            <span
              key={`${client.name}-${i}`}
              className="shrink-0 select-none whitespace-nowrap font-display text-base font-bold tracking-[0.02em] text-[var(--color-slate-400)] transition-colors duration-300 hover:text-[var(--color-slate-900)]"
            >
              {client.name}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
