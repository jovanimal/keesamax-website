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
  category: JobCategory;
  location: string;
  experience: string;
  /** Optional company description (left blank until CMS migration) */
  companyDescription?: string;
  /** Optional employment type (e.g., "Full-time", "Hybrid") */
  type?: string;
}

/**
 * All active job listings. Migrated from the legacy WordPress site.
 * Eventually this list will be sourced from a Notion database so non-technical
 * staff can update postings without touching code.
 */
export const jobs: Job[] = [
  // Manufacturing (3)
  {
    id: "engineering-mgr-jb",
    title: "Engineering Manager",
    industry: "Beverage Manufacturing",
    category: "Manufacturing",
    location: "Johor Bahru",
    experience: "10+ years",
  },
  {
    id: "sales-mgr-metal-kl",
    title: "Sales Manager",
    industry: "Metal Manufacturing",
    category: "Manufacturing",
    location: "KL",
    experience: "10+ years",
  },
  {
    id: "sales-engineer-hvac",
    title: "Sales Engineer",
    industry: "HVAC Industry",
    category: "Manufacturing",
    location: "Sungai Buloh",
    experience: "5+ years",
  },

  // FMCG (2)
  {
    id: "procurement-mgr-fmcg-selangor",
    title: "Procurement Manager",
    industry: "FMCG Manufacturing",
    category: "FMCG",
    location: "Selangor",
    experience: "10+ years",
  },
  {
    id: "snr-brand-mgr-fmcg-kepong",
    title: "Senior Brand Manager",
    industry: "FMCG Beverage",
    category: "FMCG",
    location: "Kepong",
    experience: "5+ years",
  },

  // Healthcare (2)
  {
    id: "snr-finance-exec-healthcare-penang",
    title: "Senior Finance Executive",
    industry: "Healthcare",
    category: "Healthcare",
    location: "Penang",
    experience: "7+ years",
  },
  {
    id: "sales-rep-medical-devices",
    title: "Sales Representative",
    industry: "Medical Devices",
    category: "Healthcare",
    location: "Selangor / KL",
    experience: "7+ years",
  },

  // Technology (2)
  {
    id: "lead-software-dev-sg",
    title: "Lead Software Developer",
    industry: "Tech (Python/C++)",
    category: "Technology",
    location: "Singapore",
    experience: "10+ years",
  },
  {
    id: "frontend-dev-pj",
    title: "Front End Developer",
    industry: "Construction Tech (SaaS)",
    category: "Technology",
    location: "PJ · Hybrid",
    experience: "3+ years",
    type: "Hybrid",
  },

  // Construction (2)
  {
    id: "snr-interior-designer-jb",
    title: "Senior Interior Designer",
    industry: "Construction",
    category: "Construction",
    location: "JB",
    experience: "7+ years",
  },
  {
    id: "uiux-product-consultant-pj",
    title: "UI/UX Product Consultant",
    industry: "Construction Tech (SaaS)",
    category: "Construction",
    location: "PJ · Hybrid",
    experience: "7+ years",
    type: "Hybrid",
  },

  // Logistics (1)
  {
    id: "bd-marketing-mgr-shah-alam",
    title: "BD & Marketing Manager",
    industry: "Logistics Hub",
    category: "Logistics",
    location: "Shah Alam",
    experience: "10+ years",
  },

  // Finance (1)
  {
    id: "asset-mgmt-exec-cyberjaya",
    title: "Asset Mgmt Executive",
    industry: "Leasing & Strategy",
    category: "Finance",
    location: "Cyberjaya",
    experience: "3+ years",
  },

  // Other (1)
  {
    id: "hr-mgr-retail-kl",
    title: "HR Manager",
    industry: "Retail",
    category: "Other",
    location: "KL",
    experience: "7+ years",
  },
];

export const jobCategories: JobCategory[] = [
  "Manufacturing",
  "FMCG",
  "Healthcare",
  "Technology",
  "Construction",
];
