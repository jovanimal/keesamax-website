import type { Job } from "@/lib/jobs";
import { JobListingsClient } from "@/components/JobListingsClient";

interface JobListingsProps {
  jobs: Job[];
}

export function JobListings({ jobs }: JobListingsProps) {
  return <JobListingsClient jobs={jobs} />;
}
