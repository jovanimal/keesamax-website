import { Client } from "@notionhq/client";
import type {
  PageObjectResponse,
  RichTextItemResponse,
} from "@notionhq/client/build/src/api-endpoints";

export type JobCategory =
  | "Manufacturing"
  | "FMCG"
  | "Healthcare"
  | "Technology"
  | "Construction"
  | "Logistics"
  | "Finance"
  | "Other";

export interface Job {
  id: string;
  title: string;
  industry: string;
  category: string;
  location: string;
  experience: string;
  /** Optional employment type (e.g. "Full-time", "Part-time", "Contract"). */
  type?: string;
  /** Optional work arrangement (e.g. "On-site", "Hybrid", "Remote"). */
  workType?: string;
}

// Preferred ordering hint for filter chips. Notion is the source of truth for
// the actual set of categories — anything outside this list still renders.
export const VALID_CATEGORIES: ReadonlyArray<JobCategory> = [
  "Manufacturing",
  "FMCG",
  "Healthcare",
  "Technology",
  "Construction",
  "Logistics",
  "Finance",
  "Other",
];

function plainText(items: RichTextItemResponse[] | undefined): string {
  if (!items || items.length === 0) return "";
  return items.map((item) => item.plain_text).join("").trim();
}

function readTitle(page: PageObjectResponse, name: string): string {
  const prop = page.properties[name];
  if (!prop || prop.type !== "title") return "";
  return plainText(prop.title);
}

function readRichText(page: PageObjectResponse, name: string): string {
  const prop = page.properties[name];
  if (!prop || prop.type !== "rich_text") return "";
  return plainText(prop.rich_text);
}

function readSelect(
  page: PageObjectResponse,
  name: string,
): string | undefined {
  const prop = page.properties[name];
  if (!prop || prop.type !== "select") return undefined;
  return prop.select?.name;
}

function rowToJob(page: PageObjectResponse): Job | null {
  const title = readTitle(page, "Title");
  const industry = readRichText(page, "Industry");
  const location = readRichText(page, "Location");
  const experience = readRichText(page, "Experience");
  const categoryName = readSelect(page, "Category");
  const type = readSelect(page, "Employment Type");
  const workType = readSelect(page, "Work Type");

  if (!title || !industry || !location || !experience) {
    console.warn(
      `[getJobs] Skipping row ${page.id} — missing required text field`,
    );
    return null;
  }
  if (!categoryName) {
    console.warn(
      `[getJobs] Skipping row ${page.id} — missing category`,
    );
    return null;
  }

  const job: Job = {
    id: page.id,
    title,
    industry,
    category: categoryName,
    location,
    experience,
  };
  if (type) job.type = type;
  if (workType) job.workType = workType;
  return job;
}

export async function getJobs(): Promise<Job[]> {
  const token = process.env.NOTION_TOKEN;
  const databaseId = process.env.NOTION_JOBS_DATABASE_ID;
  if (!token || !databaseId) {
    console.error(
      "[getJobs] Missing NOTION_TOKEN or NOTION_JOBS_DATABASE_ID — returning []",
    );
    return [];
  }

  try {
    const notion = new Client({ auth: token });
    const response = await notion.dataSources.query({
      data_source_id: databaseId,
      filter: {
        property: "Status",
        select: { equals: "Live" },
      },
      sorts: [{ timestamp: "created_time", direction: "descending" }],
      page_size: 100,
    });

    const jobs: Job[] = [];
    for (const page of response.results) {
      if (!("properties" in page)) continue;
      const job = rowToJob(page as PageObjectResponse);
      if (job) jobs.push(job);
    }
    return jobs;
  } catch (err) {
    console.error("[getJobs] Notion fetch failed:", err);
    return [];
  }
}
