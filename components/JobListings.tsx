"use client";

import { useMemo, useState } from "react";
import { Search } from "lucide-react";
import { jobs, jobCategories, type JobCategory } from "@/data/jobs";
import { JobCard } from "@/components/ui/JobCard";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/utils";

type Filter = "All" | JobCategory;

const filters: Filter[] = ["All", ...jobCategories];

export function JobListings() {
  const [filter, setFilter] = useState<Filter>("All");
  const [query, setQuery] = useState<string>("");
  const [showAll, setShowAll] = useState<boolean>(false);

  const visible = useMemo(() => {
    const q = query.trim().toLowerCase();
    return jobs.filter((job) => {
      if (filter !== "All" && job.category !== filter) return false;
      if (!q) return true;
      return (
        job.title.toLowerCase().includes(q) ||
        job.industry.toLowerCase().includes(q) ||
        job.location.toLowerCase().includes(q)
      );
    });
  }, [filter, query]);

  const shown = showAll ? visible : visible.slice(0, 8);

  return (
    <section id="jobs" className="section-py bg-[var(--color-slate-50)]">
      <div className="container-base">
        <div className="mb-10 flex flex-wrap items-end justify-between gap-6">
          <div>
            <div className="eyebrow">Open Positions</div>
            <h2>
              Find your next
              <br />
              opportunity.
            </h2>
          </div>
          <div className="flex flex-wrap gap-2">
            {filters.map((f) => (
              <button
                key={f}
                type="button"
                onClick={() => {
                  setFilter(f);
                  setShowAll(false);
                }}
                className={cn(
                  "rounded-full border px-[18px] py-[9px] text-[0.8125rem] font-semibold transition-colors duration-200",
                  filter === f
                    ? "border-[var(--color-navy-900)] bg-[var(--color-navy-900)] text-white"
                    : "border-[var(--color-slate-200)] bg-white text-[var(--color-slate-600)] hover:border-[var(--color-navy-900)] hover:bg-[var(--color-navy-900)] hover:text-white",
                )}
              >
                {f === "All" ? "All Roles" : f}
              </button>
            ))}
          </div>
        </div>

        <div className="mb-6 flex items-center gap-3 rounded-[var(--radius-md)] border border-[var(--color-slate-200)] bg-white px-4 py-3 shadow-[var(--shadow-xs)] focus-within:border-[var(--color-navy-900)] focus-within:shadow-[0_0_0_3px_rgba(15,35,65,0.08)]">
          <Search className="size-[18px] text-[var(--color-slate-400)]" />
          <input
            type="search"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setShowAll(false);
            }}
            placeholder="Search by title, industry, or location..."
            className="flex-grow bg-transparent text-[0.9375rem] text-[var(--color-slate-900)] placeholder:text-[var(--color-slate-400)] focus:outline-none"
          />
        </div>

        {shown.length > 0 ? (
          <div className="grid gap-3.5 md:grid-cols-2">
            {shown.map((job) => (
              <JobCard key={job.id} job={job} />
            ))}
          </div>
        ) : (
          <div className="rounded-[var(--radius-md)] border border-dashed border-[var(--color-slate-200)] bg-white p-12 text-center text-[var(--color-slate-500)]">
            No roles match your filters. Try adjusting or{" "}
            <a
              href="#contact"
              className="font-semibold text-[var(--color-blue-600)] hover:underline"
            >
              get in touch
            </a>{" "}
            and we&apos;ll help.
          </div>
        )}

        <div className="mt-10 text-center">
          <p className="mb-[18px] text-[0.9375rem] text-[var(--color-slate-500)]">
            Showing {shown.length} of {visible.length}
            {filter !== "All" || query ? " matching" : ""} position
            {visible.length === 1 ? "" : "s"}
            {filter === "All" && !query ? " across Southeast Asia" : ""}
          </p>
          {visible.length > 8 && !showAll ? (
            <Button variant="outline" onClick={() => setShowAll(true)}>
              View All {visible.length} Positions →
            </Button>
          ) : (
            <Button href="#contact" variant="outline">
              Don&apos;t see your role? Talk to us →
            </Button>
          )}
        </div>
      </div>
    </section>
  );
}
