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
    image: "/images/service-career-fair.jpg",
    alt: "Recruiter shaking hands with a candidate at a Malaysian career fair",
  },
  {
    number: "02",
    title: "Executive Headhunting",
    description:
      "Our targeted approach identifies and attracts top-tier talent who may not be actively seeking new roles, giving you access to the best from specifically targeted companies.",
    image: "/images/service-lounge-meeting-v2.jpg",
    alt: "Discreet cross-cultural executive meeting over coffee in an upscale Kuala Lumpur hotel lounge",
  },
  {
    number: "03",
    title: "Career Coaching",
    description:
      "Supporting individuals through career and outplacement coaching, from personalized one-on-one sessions to group workshops, empowering professionals on their next career journey.",
    image: "/images/service-workshop.jpg",
    alt: "Career coach leading a workshop with a small group of Malaysian professionals",
  },
];
