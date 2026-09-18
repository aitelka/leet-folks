/**
 * Every privacy policy we publish, in one place. The related-policies block at
 * the foot of each document, the footer links and the sitemap all read from
 * here, so adding an app means editing one array.
 *
 * The three app policies exist because Google Play requires a reachable policy
 * URL per listing; the site policy covers leetfolks.com itself.
 */
export type PolicyRef = {
  slug: string;
  href: string;
  name: string;
  nativeName?: string;
  /** Store icon, where the policy belongs to an app. */
  icon?: string;
  /** What the document actually covers, set in the card's meta line. */
  scope: string;
};

export const sitePolicy: PolicyRef = {
  slug: "site",
  href: "/privacy",
  name: "Leet Folks",
  scope: "This website",
};

export const appPolicies: PolicyRef[] = [
  {
    slug: "maklafit",
    href: "/privacy/maklafit",
    name: "MaklaFit",
    icon: "/apps/maklafit-icon.png",
    scope: "Android · iOS app",
  },
  {
    slug: "nokhba",
    href: "/privacy/nokhba",
    name: "Nokhba Player",
    icon: "/apps/nokhba-icon.png",
    scope: "Android app",
  },
  {
    slug: "rokhsati",
    href: "/privacy/rokhsati",
    name: "Rokhsati",
    nativeName: "رخصتي",
    icon: "/apps/rokhsati-icon.png",
    scope: "Android · iOS app",
  },
];

export const allPolicies: PolicyRef[] = [sitePolicy, ...appPolicies];

/** The other three policies, for the block at the foot of a document. */
export function otherPolicies(currentSlug: string): PolicyRef[] {
  return allPolicies.filter((p) => p.slug !== currentSlug);
}
