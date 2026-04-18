export interface SiteConfig {
  name: string;
  legalName: string;
  registration: string;
  tagline: string;
  description: string;
  url: string;
  whatsapp: {
    display: string;
    number: string;
    url: string;
  };
  email: {
    contact: string;
    [key: string]: string; // For individual team member emails (e.g., "andrew", "may-ann")
  };
  founded: number;
  incorporated: number;
}

export const site: SiteConfig = {
  name: "Keesamax",
  legalName: "Keesamax Sdn. Bhd.",
  registration: "202401002894 (1548744-K)",
  tagline: "Connecting talent, inspiring growth.",
  description:
    "Boutique recruitment firm specializing in executive headhunting, skilled professional placement, and career coaching across Southeast Asia. Based in Malaysia, serving 10+ countries.",
  url: "https://www.keesamax.com",
  whatsapp: {
    display: "+60 16-333 5597",
    number: "60163335597",
    url: "https://wa.me/60163335597",
  },
  email: {
    contact: "contact@keesamax.com",
    andrew: "andrew.keesamax.com",
    mayann: "may-ann.keesamax.com",
},
  founded: 2013,
  incorporated: 2024,
};
