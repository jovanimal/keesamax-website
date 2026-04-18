export interface Service {
  number: string;
  title: string;
  description: string;
  image: string;
  alt: string;
}

export const services: Service[] = [
  {
    number: "01",
    title: "Recruitment of Skilled Professionals",
    description:
      "We source and place highly qualified professionals across industries and countries, ensuring the perfect match between candidate expertise and your business needs.",
    image:
      "https://images.unsplash.com/photo-1521737604893-d14cc237f11d?w=600&h=400&fit=crop",
    alt: "Recruitment professionals collaborating",
  },
  {
    number: "02",
    title: "Executive Headhunting",
    description:
      "Our targeted approach identifies and attracts top-tier talent who may not be actively seeking new roles — giving you access to the best from specifically targeted companies.",
    image:
      "https://images.unsplash.com/photo-1600880292203-757bb62b4baf?w=600&h=400&fit=crop",
    alt: "Executive interview in modern office",
  },
  {
    number: "03",
    title: "Career Coaching",
    description:
      "Supporting individuals through career and outplacement coaching — from personalized one-on-one sessions to group workshops, empowering professionals on their next career journey.",
    image:
      "https://images.unsplash.com/photo-1551836022-d5d88e9218df?w=600&h=400&fit=crop",
    alt: "Career coaching session",
  },
];
