export type Screen =
  | "welcome"
  | "access-check"
  | "no-access"
  | "troubleshoot"
  | "upsell"
  | "project-setup"
  | "cloning"
  | "done"
  | "error";

export interface Template {
  name: string;
  description: string;
  repo: string;
}

export const TEMPLATES: Template[] = [
  {
    name: "🍌 Platano",
    description:
      "A production-ready React Native template with in-app purchases, AI image generation, and App Store assets — ship and monetize from day one.",
    repo: "https://github.com/Code-with-Beto/platano.git",
  },
];

export const URLS = {
  platano: "https://cwb.sh/platano?r=ship-cli",
  pricing: "https://codewithbeto.dev/pricing",
  newsletter: "https://cwb.sh/newsletter?r=ship-cli",
};
