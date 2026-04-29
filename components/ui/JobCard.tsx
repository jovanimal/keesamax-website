import {
  ArrowRight,
  MapPin,
  Clock,
  Building2,
  Globe,
  Laptop,
  Briefcase,
  type LucideIcon,
} from "lucide-react";
import type { Job } from "@/lib/jobs";

interface JobCardProps {
  job: Job;
}

const EMPLOYMENT_TYPE_STYLES: Record<string, string> = {
  "Full-time": "bg-blue-50 text-blue-700 ring-blue-600/20",
  "Part-time": "bg-rose-50 text-rose-700 ring-rose-600/20",
  Contract: "bg-amber-50 text-amber-800 ring-amber-600/20",
};

function employmentTypeStyle(type: string): string {
  return (
    EMPLOYMENT_TYPE_STYLES[type] ?? "bg-slate-100 text-slate-700 ring-slate-500/20"
  );
}

const WORK_TYPE_ICONS: Record<string, LucideIcon> = {
  "On-site": Building2,
  Hybrid: Globe,
  Remote: Laptop,
};

function workTypeIcon(workType: string): LucideIcon {
  return WORK_TYPE_ICONS[workType] ?? Briefcase;
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
          {job.workType ? (() => {
            const Icon = workTypeIcon(job.workType);
            return (
              <span className="inline-flex items-center gap-1.5 text-[0.8125rem] text-[var(--color-slate-500)]">
                <Icon className="size-3.5" />
                {job.workType}
              </span>
            );
          })() : null}
        </div>
      </div>
      <div className="flex shrink-0 flex-col items-end gap-2.5">
        {job.type ? (
          <span
            className={`inline-flex items-center rounded-full px-2.5 py-[3px] text-[0.6875rem] font-semibold uppercase tracking-wide ring-1 ring-inset ${employmentTypeStyle(
              job.type,
            )}`}
          >
            {job.type}
          </span>
        ) : null}
        <span className="flex size-10 items-center justify-center rounded-full bg-[var(--color-slate-100)] text-[var(--color-slate-700)] transition-all duration-[250ms] group-hover:translate-x-1 group-hover:bg-[var(--color-navy-900)] group-hover:text-white">
          <ArrowRight className="size-4" />
        </span>
      </div>
    </a>
  );
}
