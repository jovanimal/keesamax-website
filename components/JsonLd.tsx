import { site } from "@/data/site";

interface OrganizationSchema {
  "@context": "https://schema.org";
  "@type": ["Organization", "ProfessionalService"];
  name: string;
  legalName: string;
  url: string;
  logo: string;
  image: string;
  description: string;
  foundingDate: string;
  areaServed: string[];
  address: {
    "@type": "PostalAddress";
    addressCountry: string;
  };
  contactPoint: Array<{
    "@type": "ContactPoint";
    telephone: string;
    contactType: string;
    email: string;
    availableLanguage: string[];
    areaServed: string[];
  }>;
  sameAs?: string[];
}

interface BreadcrumbSchema {
  "@context": "https://schema.org";
  "@type": "BreadcrumbList";
  itemListElement: Array<{
    "@type": "ListItem";
    position: number;
    name: string;
    item: string;
  }>;
}

export function JsonLd() {
  const org: OrganizationSchema = {
    "@context": "https://schema.org",
    "@type": ["Organization", "ProfessionalService"],
    name: site.name,
    legalName: site.legalName,
    url: site.url,
    logo: `${site.url}/images/keesamax-logo.webp`,
    image: `${site.url}/opengraph-image`,
    description: site.description,
    foundingDate: String(site.founded),
    areaServed: [
      "Malaysia",
      "Singapore",
      "Thailand",
      "Vietnam",
      "Indonesia",
      "Philippines",
      "Hong Kong",
      "Taiwan",
      "China",
      "Germany",
    ],
    address: {
      "@type": "PostalAddress",
      addressCountry: "MY",
    },
    contactPoint: [
      {
        "@type": "ContactPoint",
        telephone: `+${site.whatsapp.number}`,
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
        areaServed: ["MY", "SG", "TH", "VN", "ID", "PH", "HK", "TW", "CN", "DE"],
      },
    ],
  };

  const breadcrumb: BreadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: site.url },
      {
        "@type": "ListItem",
        position: 2,
        name: "Services",
        item: `${site.url}#services`,
      },
      {
        "@type": "ListItem",
        position: 3,
        name: "Open Positions",
        item: `${site.url}#jobs`,
      },
      {
        "@type": "ListItem",
        position: 4,
        name: "Contact",
        item: `${site.url}#contact`,
      },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(org) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumb) }}
      />
    </>
  );
}
