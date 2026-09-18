import type { Metadata } from "next";
import ContactForm from "@/components/ContactForm";
import Star from "@/components/Star";
import { contact } from "@/lib/content";

export const metadata: Metadata = {
  title: "Start a project",
  description:
    "Tell us what you need built — a mobile app, a web platform, a store release or a rescue — and we answer every message within a working day.",
  alternates: { canonical: "/contact" },
};

export default function ContactPage() {
  return (
    <>
      <header className="docHead">
        <Star className="docHead__star" detailed strokeWidth={2} />
        <div className="shell">
          <span className="docHead__eyebrow">
            <em>Contact</em> · Leet Folks, Agadir
          </span>

          <h1 className="docHead__title">
            Tell us what needs <em>building</em>
          </h1>

          <p className="docHead__lede">
            Answer six short questions and we will have everything we need to
            reply properly rather than asking you five follow-ups. Every message
            is read by the person who would do the work, and we will say plainly
            if we are not the right studio for it.
          </p>

          <div className="docHead__meta">
            <span>
              Goes to <b>{contact.email}</b>
            </span>
            <span>
              Reply within <b>one working day</b>
            </span>
            <span>
              Working in <b>{contact.timezone}</b>
            </span>
          </div>
        </div>
      </header>

      <div className="shell contactBody">
        <ContactForm />
      </div>
    </>
  );
}
