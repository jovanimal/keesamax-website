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
  // ── General Listings ──────────────────────────────────────────
  {
    id: "finance-mgr-bandung",
    title: "Finance Manager",
    industry: "Apparel Manufacturing",
    category: "Manufacturing",
    location: "Bandung, Indonesia",
    experience: "5+ years",
  },
  {
    id: "lead-software-dev-sg",
    title: "Lead Software Developer",
    industry: "Tech (Python/C++)",
    category: "Technology",
    location: "Singapore",
    experience: "10+ years",
  },
  {
    id: "bd-marketing-mgr-shah-alam",
    title: "BD & Marketing Manager",
    industry: "Logistics Hub",
    category: "Logistics",
    location: "Shah Alam",
    experience: "10+ years",
  },
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
    id: "procurement-mgr-fmcg-selangor",
    title: "Procurement Manager",
    industry: "FMCG Manufacturing",
    category: "FMCG",
    location: "Selangor",
    experience: "10+ years",
  },
  {
    id: "finance-exec-healthcare-selangor",
    title: "Finance Executive",
    industry: "Healthcare",
    category: "Healthcare",
    location: "Selangor",
    experience: "5+ years",
  },
  {
    id: "snr-finance-exec-healthcare-penang",
    title: "Senior Finance Executive",
    industry: "Healthcare",
    category: "Healthcare",
    location: "Penang",
    experience: "7+ years",
  },
  {
    id: "sales-mgr-it-kl",
    title: "Sales Manager",
    industry: "Information Technology",
    category: "Technology",
    location: "KL",
    experience: "10+ years",
  },
  {
    id: "hr-mgr-retail-kl",
    title: "HR Manager",
    industry: "Retail",
    category: "Other",
    location: "KL",
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
  {
    id: "warehouse-snr-mgr-fmcg-jb",
    title: "Warehouse Senior Manager",
    industry: "FMCG Manufacturing",
    category: "FMCG",
    location: "JB",
    experience: "10+ years",
  },
  {
    id: "legal-counsel-fmcg-selangor",
    title: "Legal Counsel Manager",
    industry: "FMCG Manufacturing",
    category: "FMCG",
    location: "Selangor",
    experience: "5+ years",
  },
  {
    id: "asset-mgmt-exec-cyberjaya",
    title: "Asset Mgmt Executive",
    industry: "Leasing & Strategy",
    category: "Finance",
    location: "Cyberjaya",
    experience: "3+ years",
  },
  {
    id: "sales-engineer-hvac",
    title: "Sales Engineer",
    industry: "HVAC Industry",
    category: "Manufacturing",
    location: "Sungai Buloh",
    experience: "5+ years",
  },
  {
    id: "sales-coordinator-hvac",
    title: "Sales Coordinator",
    industry: "HVAC Industry",
    category: "Manufacturing",
    location: "Sungai Buloh",
    experience: "3+ years",
  },
  {
    id: "snr-brand-mgr-fmcg-kepong",
    title: "Senior Brand Manager",
    industry: "FMCG Beverage",
    category: "FMCG",
    location: "Kepong",
    experience: "5+ years",
  },
  {
    id: "marketing-exec-fmcg-kepong",
    title: "Marketing Executive",
    industry: "FMCG Beverage",
    category: "FMCG",
    location: "Kepong",
    experience: "2+ years",
  },
  {
    id: "asst-procurement-mgr-shah-alam",
    title: "Asst. Procurement Manager",
    industry: "Manufacturing",
    category: "Manufacturing",
    location: "Shah Alam",
    experience: "5+ years",
  },
  {
    id: "snr-finance-exec-mfg-pj",
    title: "Senior Finance Executive",
    industry: "Manufacturing",
    category: "Manufacturing",
    location: "Petaling Jaya",
    experience: "5+ years",
  },
  {
    id: "finance-mgr-mfg-shah-alam",
    title: "Finance Manager",
    industry: "Manufacturing",
    category: "Manufacturing",
    location: "Shah Alam",
    experience: "7+ years",
  },
  {
    id: "hr-mgr-ecom-klang",
    title: "HR Manager",
    industry: "E-Commerce / Logistics",
    category: "Logistics",
    location: "Klang",
    experience: "5+ years",
  },
  {
    id: "accounts-admin-exec-klang",
    title: "Accounts & Admin Executive",
    industry: "E-Commerce / Logistics",
    category: "Logistics",
    location: "Klang",
    experience: "5+ years",
  },
  {
    id: "snr-hr-admin-construction-klang",
    title: "Senior HR & Admin Executive",
    industry: "Construction",
    category: "Construction",
    location: "Klang",
    experience: "5+ years",
  },
  {
    id: "sales-interior-designer-jb",
    title: "Sales Interior Designer",
    industry: "Construction",
    category: "Construction",
    location: "JB",
    experience: "3-5 years",
  },
  {
    id: "snr-interior-designer-jb",
    title: "Senior Interior Designer",
    industry: "Construction",
    category: "Construction",
    location: "JB",
    experience: "7+ years",
  },
  {
    id: "gen-modern-trade-mgr-fmcg-jb",
    title: "Gen & Modern Trade Manager",
    industry: "FMCG Beverage",
    category: "FMCG",
    location: "JB",
    experience: "5+ years",
  },
  {
    id: "china-bd-mgr-fmcg-jb",
    title: "China BD Manager",
    industry: "FMCG Beverage",
    category: "FMCG",
    location: "JB",
    experience: "5+ years",
  },
  {
    id: "product-specialist-fmcg-jb",
    title: "Product Specialist",
    industry: "FMCG",
    category: "FMCG",
    location: "JB",
    experience: "5+ years",
  },
  {
    id: "sales-mgr-mfg-penang",
    title: "Sales Manager",
    industry: "Manufacturing",
    category: "Manufacturing",
    location: "Penang",
    experience: "7+ years",
  },
  {
    id: "procurement-mgr-mfg-penang",
    title: "Procurement Manager",
    industry: "Manufacturing",
    category: "Manufacturing",
    location: "Penang",
    experience: "7+ years",
  },

  // ── Construction Tech (SaaS) — Petaling Jaya, Hybrid ──────────
  {
    id: "uiux-product-consultant-pj",
    title: "UI/UX Product Consultant",
    industry: "Construction Tech (SaaS)",
    category: "Construction",
    location: "PJ — Hybrid",
    experience: "7+ years",
    type: "Hybrid",
  },
  {
    id: "frontend-dev-pj",
    title: "Front End Developer",
    industry: "Construction Tech (SaaS)",
    category: "Technology",
    location: "PJ — Hybrid",
    experience: "3+ years",
    type: "Hybrid",
  },
  {
    id: "solution-consultant-pj",
    title: "Solution Consultant",
    industry: "Construction Tech (SaaS)",
    category: "Construction",
    location: "PJ — Hybrid",
    experience: "5+ years",
    type: "Hybrid",
  },
  {
    id: "customer-success-mgr-pj",
    title: "Customer Success Manager",
    industry: "Construction Tech (SaaS)",
    category: "Construction",
    location: "PJ — Hybrid",
    experience: "7+ years",
    type: "Hybrid",
  },
  {
    id: "product-marketing-pj",
    title: "Product Marketing",
    industry: "Construction Tech (SaaS)",
    category: "Construction",
    location: "PJ — Hybrid",
    experience: "7+ years",
    type: "Hybrid",
  },
  {
    id: "hr-finance-mgr-pj",
    title: "HR / Finance Manager",
    industry: "Construction Tech (SaaS)",
    category: "Construction",
    location: "PJ — Hybrid",
    experience: "5+ years",
    type: "Hybrid",
  },
  {
    id: "sales-coordinator-pj",
    title: "Sales Coordinator",
    industry: "Construction Tech (SaaS)",
    category: "Construction",
    location: "PJ — Hybrid",
    experience: "2+ years",
    type: "Hybrid",
  },
  {
    id: "implementer-qs-pm-pj",
    title: "Implementer / QS — PM",
    industry: "Construction Tech (SaaS)",
    category: "Construction",
    location: "PJ — Hybrid",
    experience: "5+ years",
    type: "Hybrid",
  },
];

export const jobCategories: JobCategory[] = [
  "Manufacturing",
  "FMCG",
  "Healthcare",
  "Technology",
  "Construction",
];
