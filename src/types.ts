export type Screen =
  | "welcome"
  | "access-check"
  | "no-access"
  | "troubleshoot"
  | "upsell"
  | "project-setup"
  | "cloning"
  | "onboarding"
  | "configuring"
  | "done"
  | "error";

export interface OnboardingResult {
  appName: string;
  slug: string;
  bundleId: string;
  payments: boolean;
  rcTestKeyIos: string;
  rcTestKeyAndroid: string;
}

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

export function toSlug(name: string): string {
  return name
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

export function toTitleCase(name: string): string {
  return name
    .replace(/[-_.]+/g, " ")
    .replace(/\b\w/g, (c) => c.toUpperCase());
}

export function sanitizeUsername(username: string): string {
  return username.toLowerCase().replace(/[^a-z0-9]/g, "") || "mycompany";
}
