import { ArrowRight, MapPin, Clock } from "lucide-react";
import type { Job } from "@/data/jobs";

interface JobCardProps {
  job: Job;
}

export function JobCard({ job }: JobCardProps) {
  return (
    <a
      href="#contact"
      className="group flex items-center justify-between gap-5 rounded-[var(--radius-md)] border border-[var(--color-slate-200)] bg-white px-[26px] py-[22px] transition-all duration-300 ease-[var(--ease-brand)] hover:-translate-y-0.5 hover:border-[var(--color-navy-900)] hover:shadow-[var(--shadow-md)]"
    >
      <div className="min-w-0 flex-grow">
        <h4 className="mb-2 font-display text-base font-bold text-[var(--color-slate-900)]">
          {job.title}
        </h4>
        <div className="flex flex-wrap items-center gap-3">
          <span className="rounded-full bg-[var(--color-blue-50)] px-2.5 py-[3px] text-xs font-semibold text-[var(--color-blue-600)]">
            {job.industry}
          </span>
          <span className="inline-flex items-center gap-1.5 text-[0.8125rem] text-[var(--color-slate-500)]">
            <MapPin className="size-3.5" />
            {job.location}
          </span>
          <span className="inline-flex items-center gap-1.5 text-[0.8125rem] text-[var(--color-slate-500)]">
            <Clock className="size-3.5" />
            {job.experience}
          </span>
        </div>
      </div>
      <span className="flex size-10 shrink-0 items-center justify-center rounded-full bg-[var(--color-slate-100)] text-[var(--color-slate-700)] transition-all duration-[250ms] group-hover:translate-x-1 group-hover:bg-[var(--color-navy-900)] group-hover:text-white">
        <ArrowRight className="size-4" />
      </span>
    </a>
  );
}
