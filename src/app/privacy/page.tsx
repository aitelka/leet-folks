import type { Metadata } from "next";
import PolicyDocument, {
  Callout,
  type DocSection,
} from "@/components/PolicyDocument";
import { appPolicies } from "@/lib/policies";
import { contact } from "@/lib/content";

export const metadata: Metadata = {
  title: "Privacy policy",
  description:
    "Privacy policy for leetfolks.com. No cookies, no analytics, no forms — and links to the separate policies for each app we publish on Google Play.",
  alternates: { canonical: "/privacy" },
};

const sections: DocSection[] = [
  {
    id: "scope",
    title: "What this policy covers",
    body: (
      <>
        <p>
          This policy covers <strong>leetfolks.com</strong> — the site you are
          reading — and the email address we publish on it. It is the policy for
          Leet Folks as a studio.
        </p>
        <p>
          It does <strong>not</strong> cover the apps we publish. Each of those
          is a separate piece of software that handles different data on your
          own phone, and Google Play requires each to carry its own policy at
          its own address. Those three are linked at the foot of this page:{" "}
          {appPolicies.map((policy, i) => (
            <span key={policy.slug}>
              {i > 0 ? (i === appPolicies.length - 1 ? " and " : ", ") : ""}
              <a href={policy.href}>{policy.name}</a>
            </span>
          ))}
          .
        </p>
        <p>
          If you installed one of our apps and want to know what it does with
          your data, that app’s policy is the document you want. This one only
          describes a website.
        </p>
      </>
    ),
  },
  {
    id: "no-collection",
    title: "What this site does not do",
    body: (
      <>
        <p>
          It is a brochure. Every page is prerendered and served as static
          files, and there is nothing on it that collects information about you.
          Concretely, this site has:
        </p>
        <ul>
          <li>
            <strong>No accounts.</strong> There is nothing to sign up for and
            nothing to log in to.
          </li>
          <li>
            <strong>No newsletter, no search, no comments.</strong> There is
            exactly one form on this site — the contact form — and the next
            section describes it in full.
          </li>
          <li>
            <strong>No analytics.</strong> No Google Analytics, no Plausible, no
            Vercel Analytics, no first-party event logging. We do not know how
            many people visit this site or which pages they read.
          </li>
          <li>
            <strong>No advertising and no trackers.</strong> No ad network, no
            pixel, no remarketing tag, no social media embed, no session
            recorder.
          </li>
          <li>
            <strong>No cookies.</strong> This site sets none at all, which is
            why you were not asked to consent to any.
          </li>
        </ul>
      </>
    ),
  },
  {
    id: "contact-form",
    title: "The contact form",
    body: (
      <>
        <p>
          <a href="/contact">/contact</a> asks what you need built, roughly when,
          an optional budget range, your name and email, an optional company,
          and a description of the project. Those answers are assembled into a
          single plain-text message — the page shows you that message as you
          type, and what you see there is exactly what we receive.
        </p>
        <p>
          <strong>Nothing is stored on this site.</strong> There is no database
          behind it and no record kept of submissions. Pressing send composes
          the email and hands it to our delivery provider,{" "}
          <a
            href="https://resend.com/legal/privacy-policy"
            rel="noopener noreferrer"
            target="_blank"
          >
            Resend
          </a>
          , which delivers it to{" "}
          <a href={`mailto:${contact.email}`}>{contact.email}</a>. From that
          point it is an email in our inbox, covered by the next section. Resend
          processes it only to deliver it.
        </p>
        <p>
          Two things guard the form against bots: a field that is hidden from
          people but visible to form-filling scripts, and how long the page was
          open before you pressed send. Neither profiles you, assigns you an
          identifier, or is stored or shared — they are a discarded yes-or-no
          check at the moment you submit.
        </p>
        <Callout label="What we will not do with it">
          <p>
            We use what you send to answer you and to do the work if we end up
            working together. We do not add you to a mailing list, put you in a
            CRM, start an automated follow-up sequence, or pass your details to
            anyone. If you would rather skip the form entirely, the email
            address works just as well.
          </p>
        </Callout>
      </>
    ),
  },
  {
    id: "browser-storage",
    title: "The one thing your browser stores",
    body: (
      <>
        <p>
          The site has a light and a dark theme. When you press the toggle, your
          choice is written to your browser’s <code>localStorage</code> under
          the key <code>theme</code>, with a value of <code>light</code>,{" "}
          <code>dark</code> or <code>system</code>. It is there so the page does
          not flash the wrong colours the next time you open it.
        </p>
        <p>
          That entry never leaves your browser. It is not a cookie, so it is not
          attached to any request and no server ever sees it — not ours, not our
          host’s. You can clear it at any time through your browser’s site data
          settings, and the site will simply follow your operating system’s
          light or dark preference again.
        </p>
      </>
    ),
  },
  {
    id: "hosting",
    title: "Hosting and server logs",
    body: (
      <>
        <p>
          This site is hosted on <strong>Vercel</strong>. As with any web host,
          delivering a page to you means Vercel’s servers handle the request,
          and they keep operational logs of that — typically the IP address, the
          time, the URL requested, the response status, and the browser’s
          user-agent string. That is the ordinary mechanics of the web, not a
          product we have bolted on.
        </p>
        <p>
          We do not add anything to those logs, do not export them, do not
          combine them with anything else, and do not use them to build a
          profile of anyone. Vercel processes them as our hosting provider under
          its own terms; see the{" "}
          <a
            href="https://vercel.com/legal/privacy-policy"
            rel="noopener noreferrer"
            target="_blank"
          >
            Vercel privacy policy
          </a>
          .
        </p>
      </>
    ),
  },
  {
    id: "assets",
    title: "Fonts, images and embedded content",
    body: (
      <>
        <p>
          Everything the page loads comes from this domain. The typefaces are
          compiled into the site at build time and served from here, so opening
          a page does not send a request to Google Fonts or to any other font
          service. The images are our own files. There is no CDN script, no
          embedded video, no map, no comment widget.
        </p>
        <Callout label="Why it matters">
          <p>
            A third-party font or script would let someone else see your IP
            address every time you loaded a page here, whether or not you ever
            clicked anything. Serving it all ourselves is the simplest way to
            make sure that does not happen.
          </p>
        </Callout>
      </>
    ),
  },
  {
    id: "email",
    title: "Email you send us",
    body: (
      <>
        <p>
          Whether it arrives through the contact form or because you wrote to{" "}
          <a href={`mailto:${contact.email}`}>{contact.email}</a> yourself, we
          receive whatever you chose to put in that message — your email
          address, your name, and whatever you tell us about your project. We use it to answer you and to do the work if we end up
          working together. We do not add it to a mailing list and we do not
          pass it to anyone else.
        </p>
        <p>
          That address is a Gmail account, so mail sent to it is received and
          stored by Google on our behalf, under the{" "}
          <a
            href="https://policies.google.com/privacy"
            rel="noopener noreferrer"
            target="_blank"
          >
            Google Privacy Policy
          </a>
          . Correspondence is kept for as long as it is useful for the work or
          for our records, and you can ask us to delete yours at any time.
        </p>
      </>
    ),
  },
  {
    id: "links",
    title: "Links to other sites",
    body: (
      <p>
        This site links out to Google Play listings, to clients’ own websites,
        and to the privacy documentation of services our apps use. Once you
        follow one of those links you are on someone else’s site, under someone
        else’s policy. We have no control over what they collect and this policy
        stops at our boundary.
      </p>
    ),
  },
  {
    id: "children",
    title: "Children",
    body: (
      <p>
        This site is a portfolio for a software studio and is not directed at
        children. Since it collects nothing from anyone, it collects nothing
        from children either.
      </p>
    ),
  },
  {
    id: "rights",
    title: "Your rights",
    body: (
      <>
        <p>
          Depending on where you live, you may have the right to access,
          correct, delete, or port your personal data, to object to or restrict
          its processing, and to withdraw consent. We are based in Morocco and
          handle personal data under Law 09-08 on the protection of individuals
          with regard to the processing of personal data, supervised by the
          CNDP. Residents of the European Economic Area and the United Kingdom
          hold comparable rights under the GDPR, and residents of California
          under the CCPA, including the right not to be discriminated against
          for exercising them. We do not sell personal information.
        </p>
        <p>
          In practice there is very little to exercise those rights over: unless
          you have emailed us, we hold nothing about you at all. If you have,
          write to the address below and we will find it, correct it or delete
          it. You may also complain to the CNDP, or to your own supervisory
          authority.
        </p>
      </>
    ),
  },
  {
    id: "changes",
    title: "Changes to this policy",
    body: (
      <p>
        If the site ever gains something that changes this — analytics, a
        contact form, an embedded service — this policy will be updated before
        that ships, and the effective date at the top will be revised.
      </p>
    ),
  },
  {
    id: "contact",
    title: "Contact",
    body: (
      <p>
        Questions about this policy, about any of our app policies, or about
        data you believe we hold can be sent to{" "}
        <a href={`mailto:${contact.email}`}>{contact.email}</a>. We are Leet
        Folks, a software studio based in {contact.location}.
      </p>
    ),
  },
];

export default function SitePrivacy() {
  return (
    <PolicyDocument
      slug="site"
      sections={sections}
      meta={{
        kind: "leetfolks.com",
        title: "Privacy at Leet Folks",
        effective: "18 September 2026",
        updated: "18 September 2026",
        facts: [
          { label: "Covers", value: "This website" },
          { label: "Cookies set", value: "None" },
          { label: "Analytics", value: "None" },
        ],
        intro: (
          <p>
            This policy explains what happens to information when you visit{" "}
            <code>leetfolks.com</code>. The site is published by Leet Folks
            (“we”, “us”), a software studio in {contact.location}.
          </p>
        ),
        summary: (
          <>
            <p>
              This website sets no cookies and runs no analytics. We do not know
              who you are or that you were here.
            </p>
            <p>
              There is one form, at <a href="/contact">/contact</a>. It stores
              nothing — it composes an email from what you typed and sends it to
              us, and it shows you that email before you press send.
            </p>
            <p>
              Your browser stores one thing — whether you chose the light or the
              dark theme — and that never leaves your device.
            </p>
            <p>
              Our host keeps ordinary server logs, as every web host does. Email
              you send us we obviously read, because that is the point of it.
            </p>
            <p>
              The apps we publish are covered by their own policies, linked at
              the bottom of this page.
            </p>
          </>
        ),
        note: (
          <p>
            Leet Folks is a software studio in {contact.location}. This policy
            covers this website only. Each app we publish carries its own
            policy, as Google Play requires.
          </p>
        ),
      }}
    />
  );
}
