import Image from "next/image";
import Link from "next/link";
import type { ReactNode } from "react";
import PolicyContents from "@/components/PolicyContents";
import Star from "@/components/Star";
import { otherPolicies } from "@/lib/policies";

export type DocSection = {
  /** Anchor, also the contents-rail target. */
  id: string;
  title: string;
  body: ReactNode;
};

export type DocMeta = {
  /** Small label above the title — what kind of document this is. */
  kind: string;
  title: string;
  nativeTitle?: string;
  icon?: string;
  effective: string;
  updated: string;
  /** Extra mono facts for the header strip, e.g. the package id. */
  facts?: { label: string; value: string }[];
  /** Paragraphs that sit above section 1. */
  intro: ReactNode;
  /** The pulled-out plain-language summary. */
  summary?: ReactNode;
  /** The closing scope note under the last section. */
  note: ReactNode;
};

/** A bordered aside. `warn` swaps the accent rule for clay. */
export function Callout({
  label,
  tone = "note",
  children,
}: {
  label?: string;
  tone?: "note" | "warn";
  children: ReactNode;
}) {
  return (
    <aside className={`callout ${tone === "warn" ? "callout--warn" : ""}`}>
      {label ? <span className="callout__label">{label}</span> : null}
      {children}
    </aside>
  );
}

/**
 * The "what these services collect" table. Three columns of prose cannot be
 * made to fit a phone honestly, so the table stays a real table inside a
 * keyboard-reachable scroll region rather than being restacked into divs.
 */
export function DataTable({
  caption,
  rows,
}: {
  caption: string;
  rows: { service: string; collects: string; why: string }[];
}) {
  return (
    <div className="tableWrap">
      <div
        className="tableScroll"
        role="region"
        aria-label={caption}
        tabIndex={0}
      >
        <table className="dataTable">
          <caption className="sr-only">{caption}</caption>
          <thead>
            <tr>
              <th scope="col">Service</th>
              <th scope="col">What it collects</th>
              <th scope="col">Why</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <tr key={row.service}>
                <th scope="row">{row.service}</th>
                <td>{row.collects}</td>
                <td>{row.why}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p className="tableHint">Scroll the table sideways →</p>
    </div>
  );
}

export default function PolicyDocument({
  slug,
  meta,
  sections,
}: {
  slug: string;
  meta: DocMeta;
  sections: DocSection[];
}) {
  const others = otherPolicies(slug);

  return (
    <>
      <header className="docHead">
        <Star className="docHead__star" detailed strokeWidth={2} />
        <div className="shell">
          {meta.icon ? (
            <Image
              src={meta.icon}
              alt=""
              width={64}
              height={64}
              className="docHead__icon"
              aria-hidden="true"
            />
          ) : null}

          <span className="docHead__eyebrow">
            <em>Privacy</em> · {meta.kind}
          </span>

          <h1 className="docHead__title">
            {meta.title}
            {meta.nativeTitle ? (
              <span className="docHead__native" lang="ar" dir="rtl">
                {meta.nativeTitle}
              </span>
            ) : null}
          </h1>

          <div className="docHead__meta">
            <span>
              Effective <b>{meta.effective}</b>
            </span>
            <span>
              Last updated <b>{meta.updated}</b>
            </span>
            {meta.facts?.map((fact) => (
              <span key={fact.label}>
                {fact.label} <b>{fact.value}</b>
              </span>
            ))}
          </div>
        </div>
      </header>

      <div className="shell doc">
        <PolicyContents
          items={sections.map((s) => ({ id: s.id, title: s.title }))}
        />

        <article>
          <div className="prose">{meta.intro}</div>

          {meta.summary ? (
            <Callout label="The short version">{meta.summary}</Callout>
          ) : null}

          {sections.map((section, i) => (
            <section className="docSection" id={section.id} key={section.id}>
              <div className="docSection__head">
                <span className="docSection__num">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <h2 className="docSection__title">{section.title}</h2>
              </div>
              <div className="prose">{section.body}</div>
            </section>
          ))}

          <div className="docFoot">{meta.note}</div>

          <div className="related">
            <h2 className="related__title">The other policies</h2>
            <p className="related__lede">
              Every app we publish carries its own policy, because Google Play
              requires one per listing and because each app handles different
              data. The website has its own as well. This is the full set.
            </p>
            <div className="related__grid">
              {others.map((policy) => (
                <Link
                  className="policyCard"
                  href={policy.href}
                  key={policy.slug}
                >
                  {policy.icon ? (
                    <Image
                      src={policy.icon}
                      alt=""
                      width={44}
                      height={44}
                      className="policyCard__icon"
                      aria-hidden="true"
                    />
                  ) : (
                    <Star
                      className="policyCard__icon"
                      strokeWidth={6}
                    />
                  )}
                  <span className="policyCard__name">
                    {policy.name}
                    <i aria-hidden="true">→</i>
                  </span>
                  <span className="policyCard__meta">{policy.scope}</span>
                </Link>
              ))}
            </div>
          </div>
        </article>
      </div>
    </>
  );
}
