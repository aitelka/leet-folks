/**
 * The contact form's field definitions and its message template.
 *
 * This module is imported by both the client form and the server action, on
 * purpose: the preview the visitor reads on the page is produced by the same
 * `buildMessage` call that composes the email we receive. There is no second
 * copy of the wording to drift out of sync, and what you see is literally what
 * gets sent.
 */

export type Option = { id: string; label: string; detail?: string };

/** Mirrors the four services on the home page, plus an escape hatch. */
export const projectTypes: Option[] = [
  {
    id: "mobile",
    label: "A mobile app",
    detail: "One Kotlin Multiplatform core, native Android and iOS",
  },
  {
    id: "web",
    label: "A web platform",
    detail: "Marketing site or content platform on Next.js",
  },
  {
    id: "release",
    label: "Getting an app published",
    detail: "Store listing, policy, privacy, release tracks",
  },
  {
    id: "rescue",
    label: "Rescuing something existing",
    detail: "Legacy migration, security findings, performance",
  },
  { id: "other", label: "Something else", detail: "Describe it below" },
];

export const platforms: Option[] = [
  { id: "android", label: "Android" },
  { id: "ios", label: "iOS" },
  { id: "web", label: "Web" },
  { id: "unsure", label: "Not sure yet" },
];

export const timelines: Option[] = [
  { id: "now", label: "Ready to start" },
  { id: "quarter", label: "Within 3 months" },
  { id: "year", label: "Later this year" },
  { id: "exploring", label: "Just exploring" },
];

/* Bands are a starting point, not a quote — edit this array to change them. */
export const budgets: Option[] = [
  { id: "unsure", label: "Not sure yet" },
  { id: "s", label: "Under 30,000 MAD" },
  { id: "m", label: "30,000 – 100,000 MAD" },
  { id: "l", label: "100,000 – 250,000 MAD" },
  { id: "xl", label: "250,000 MAD and up" },
];

export type Enquiry = {
  types: string[];
  platforms: string[];
  timeline: string;
  budget: string;
  name: string;
  email: string;
  company: string;
  brief: string;
};

export const emptyEnquiry: Enquiry = {
  types: [],
  platforms: [],
  timeline: "",
  budget: "",
  name: "",
  email: "",
  company: "",
  brief: "",
};

const labelsFor = (options: Option[], ids: string[]) =>
  options.filter((o) => ids.includes(o.id)).map((o) => o.label);

const labelFor = (options: Option[], id: string) =>
  options.find((o) => o.id === id)?.label ?? "";

/** Pads a key so the values line up in a plain-text mail client. */
function row(key: string, value: string): string {
  return `  ${key.padEnd(11)}${value}`;
}

export type Message = { subject: string; body: string };

/**
 * Turns the answers into the message. Empty fields are dropped rather than
 * printed blank, so a half-filled preview still reads like a real note.
 */
export function buildMessage(enquiry: Enquiry): Message {
  const types = labelsFor(projectTypes, enquiry.types);
  const scope = types.length ? types.join(" · ") : "Not specified yet";
  const who = enquiry.name.trim() || "Someone";

  const subject = types.length
    ? `New project — ${types.join(", ")} — ${who}`
    : `New project enquiry — ${who}`;

  const need = [
    row("Scope", scope),
    enquiry.platforms.length
      ? row("Platforms", labelsFor(platforms, enquiry.platforms).join(", "))
      : "",
    enquiry.timeline ? row("Timeline", labelFor(timelines, enquiry.timeline)) : "",
    enquiry.budget ? row("Budget", labelFor(budgets, enquiry.budget)) : "",
  ].filter(Boolean);

  const contactRows = [
    row("Name", enquiry.name.trim() || "—"),
    row("Email", enquiry.email.trim() || "—"),
    enquiry.company.trim() ? row("Company", enquiry.company.trim()) : "",
  ].filter(Boolean);

  const body = [
    "NEW PROJECT ENQUIRY",
    "",
    "WHAT THEY NEED",
    ...need,
    "",
    "WHO",
    ...contactRows,
    "",
    "THE BRIEF",
    enquiry.brief.trim()
      ? enquiry.brief
          .trim()
          .split("\n")
          .map((line) => `  ${line}`)
          .join("\n")
      : "  —",
    "",
    "—",
    "Sent from the contact form at leetfolks.com/contact",
  ].join("\n");

  return { subject, body };
}

/**
 * The shape the form action hands back to `useActionState`.
 *
 * This lives here rather than beside the action because a "use server" module
 * may only export async functions — exporting the initial-state object from
 * there builds fine but throws on the first submit.
 */
export type EnquiryState = {
  status: "idle" | "error" | "sent";
  /** Keyed by field name, plus "form" for anything that failed as a whole. */
  errors?: Record<string, string>;
};

export const initialEnquiryState: EnquiryState = { status: "idle" };
