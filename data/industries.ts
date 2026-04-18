export interface Industry {
  name: string;
}

export const industries: Industry[] = [
  { name: "Automotive" },
  { name: "Construction" },
  { name: "Engineering" },
  { name: "Manufacturing" },
  { name: "FMCG" },
  { name: "Information Technology" },
  { name: "Bio Technology" },
  { name: "Consumer Goods" },
  { name: "Logistics" },
  { name: "Education" },
  { name: "Healthcare" },
  { name: "Oil & Gas" },
];

export interface Country {
  name: string;
  flag: string;
}

export const countries: Country[] = [
  { name: "Malaysia", flag: "🇲🇾" },
  { name: "Singapore", flag: "🇸🇬" },
  { name: "Australia", flag: "🇦🇺" },
  { name: "China", flag: "🇨🇳" },
  { name: "Japan", flag: "🇯🇵" },
  { name: "Korea", flag: "🇰🇷" },
  { name: "Hong Kong", flag: "🇭🇰" },
  { name: "India", flag: "🇮🇳" },
  { name: "Thailand", flag: "🇹🇭" },
  { name: "Vietnam", flag: "🇻🇳" },
  { name: "Indonesia", flag: "🇮🇩" },
];
