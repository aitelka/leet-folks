"use server";

import { Resend } from "resend";
import { contact } from "@/lib/content";
import {
  budgets,
  buildMessage,
  platforms,
  projectTypes,
  timelines,
  type Enquiry,
  type EnquiryState,
} from "@/lib/enquiry";

/* A Server Action is a public POST endpoint — anything can call it with any
   payload, so every rule below has to hold here regardless of what the form
   markup allows. The client-side checks are a courtesy, not a gate. */

const ids = (options: { id: string }[]) => new Set(options.map((o) => o.id));

const text = (value: FormDataEntryValue | null) =>
  typeof value === "string" ? value.trim() : "";

/** Deliberately permissive: the real test of an address is a reply arriving. */
const looksLikeEmail = (value: string) =>
  /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(value) && value.length <= 200;

export async function sendEnquiry(
  _prev: EnquiryState,
  formData: FormData,
): Promise<EnquiryState> {
  // Two cheap bot filters before anything else. The honeypot is a field hidden
  // from people but not from form-fillers; the timestamp catches scripts that
  // post the instant the page parses. Neither stops a targeted attacker — if
  // this ever gets abused, put Vercel BotID in front of it.
  if (text(formData.get("company_website"))) {
    return { status: "sent" };
  }

  const startedAt = Number(formData.get("started_at"));
  const elapsed = Date.now() - startedAt;
  if (!Number.isFinite(startedAt) || elapsed < 2_500 || elapsed > 86_400_000) {
    return {
      status: "error",
      errors: { form: "That was submitted too quickly. Please try again." },
    };
  }

  const enquiry: Enquiry = {
    types: formData.getAll("types").map(String),
    platforms: formData.getAll("platforms").map(String),
    timeline: text(formData.get("timeline")),
    budget: text(formData.get("budget")),
    name: text(formData.get("name")),
    email: text(formData.get("email")),
    company: text(formData.get("company")),
    brief: text(formData.get("brief")),
  };

  const errors: Record<string, string> = {};

  const knownTypes = ids(projectTypes);
  if (!enquiry.types.length) {
    errors.types = "Pick at least one thing you need built.";
  } else if (enquiry.types.some((t) => !knownTypes.has(t))) {
    errors.types = "That is not one of the options.";
  }

  const knownPlatforms = ids(platforms);
  if (enquiry.platforms.some((p) => !knownPlatforms.has(p))) {
    errors.platforms = "That is not one of the options.";
  }

  if (!enquiry.timeline) {
    errors.timeline = "Let us know roughly when.";
  } else if (!ids(timelines).has(enquiry.timeline)) {
    errors.timeline = "That is not one of the options.";
  }

  if (enquiry.budget && !ids(budgets).has(enquiry.budget)) {
    errors.budget = "That is not one of the options.";
  }

  if (!enquiry.name) {
    errors.name = "We need something to call you.";
  } else if (enquiry.name.length > 100) {
    errors.name = "That is longer than we can store.";
  }

  if (!enquiry.email) {
    errors.email = "We need an address to reply to.";
  } else if (!looksLikeEmail(enquiry.email)) {
    errors.email = "That does not look like an email address.";
  }

  if (enquiry.company.length > 120) {
    errors.company = "That is longer than we can store.";
  }

  if (enquiry.brief.length < 20) {
    errors.brief = "A sentence or two, so we know what we are looking at.";
  } else if (enquiry.brief.length > 4000) {
    errors.brief = "That is very long — send the detail by email instead.";
  }

  if (Object.keys(errors).length) {
    return { status: "error", errors };
  }

  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    // Surfaces as a real failure rather than a silent success, so a missing
    // key in an environment can never look like a delivered message.
    console.error("[contact] RESEND_API_KEY is not set; enquiry not sent");
    return {
      status: "error",
      errors: {
        form: "Our mail service is not reachable right now. Please email us directly — the address is below.",
      },
    };
  }

  const { subject, body } = buildMessage(enquiry);

  try {
    const resend = new Resend(apiKey);
    const { error } = await resend.emails.send({
      from: process.env.CONTACT_FROM ?? "Leet Folks <contact@leetfolks.com>",
      to: [contact.email],
      // So hitting reply in Gmail goes straight back to the enquirer.
      replyTo: enquiry.email,
      subject,
      text: body,
    });

    if (error) {
      // Log the provider's reason, never the message or the key.
      console.error(
        "[contact] Resend rejected the send:",
        error.name,
        error.message,
      );
      return {
        status: "error",
        errors: {
          form: "We could not send that. Please email us directly — the address is below.",
        },
      };
    }
  } catch (cause) {
    console.error("[contact] send failed:", cause);
    return {
      status: "error",
      errors: {
        form: "We could not send that. Please email us directly — the address is below.",
      },
    };
  }

  return { status: "sent" };
}
