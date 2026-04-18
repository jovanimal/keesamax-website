import { site } from "@/data/site";
import { jobs } from "@/data/jobs";

interface OrganizationSchema {
  "@context": "https://schema.org";
  "@type": "Organization";
  name: string;
  legalName: string;
  url: string;
  description: string;
  foundingDate: string;
  address: { "@type": "PostalAddress"; addressCountry: string };
  contactPoint: Array<{
    "@type": "ContactPoint";
    telephone: string;
    contactType: string;
    email: string;
    availableLanguage: string[];
  }>;
}

interface JobPostingSchema {
  "@context": "https://schema.org";
  "@type": "JobPosting";
  title: string;
  description: string;
  datePosted: string;
  industry: string;
  hiringOrganization: { "@type": "Organization"; name: string; sameAs: string };
  jobLocation: {
    "@type": "Place";
    address: { "@type": "PostalAddress"; addressLocality: string };
  };
}

export function JsonLd() {
  const org: OrganizationSchema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: site.name,
    legalName: site.legalName,
    url: site.url,
    description: site.description,
    foundingDate: String(site.founded),
    address: { "@type": "PostalAddress", addressCountry: "MY" },
    contactPoint: [
      {
        "@type": "ContactPoint",
        telephone: "+60-16-333-5597",
        contactType: "customer service",
        email: site.email.contact,
        availableLanguage: [
          "English",
          "Malay",
          "Mandarin",
          "Cantonese",
          "Hokkien",
          "German",
        ],
      },
    ],
  };

  const datePosted = new Date().toISOString().split("T")[0];
  const jobPostings: JobPostingSchema[] = jobs.map((job) => ({
    "@context": "https://schema.org",
    "@type": "JobPosting",
    title: job.title,
    description: `${job.title} role in ${job.industry} (${job.experience}).`,
    datePosted,
    industry: job.industry,
    hiringOrganization: {
      "@type": "Organization",
      name: site.legalName,
      sameAs: site.url,
    },
    jobLocation: {
      "@type": "Place",
      address: { "@type": "PostalAddress", addressLocality: job.location },
    },
  }));

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(org) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(jobPostings),
        }}
      />
    </>
  );
}
