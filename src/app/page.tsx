import Link from "next/link";
import AppShowcase from "@/components/AppShowcase";
import WorkIndex from "@/components/WorkIndex";
import Marquee from "@/components/Marquee";
import PointerField from "@/components/PointerField";
import Kinetic from "@/components/Kinetic";
import CopyEmail from "@/components/CopyEmail";
import Star from "@/components/Star";
import { apps, clients, services, approach, stats, contact } from "@/lib/content";

export default function Home() {
  const tickerNames = clients.map((c) => c.name).concat(apps.map((a) => a.name));

  return (
    <>
      {/* ---------- HERO ---------- */}
        <section className="hero">
          <PointerField />
          <div className="hero__glow" aria-hidden="true" />

          <div className="shell">
            <span className="hero__eyebrow rise">
              <span className="pulse" aria-hidden="true" />
              Two apps live on Google Play
            </span>

            <h1 className="hero__title">
              <Kinetic
                base={120}
                segments={[
                  { text: "We build the apps" },
                  { text: "small teams", em: true },
                  { text: "are told they can’t afford." },
                ]}
              />
            </h1>

            <div className="hero__grid">
              <div className="rise" style={{ animationDelay: "620ms" }}>
                <p className="hero__lede">
                  Leet Folks is a product studio in Agadir. We write one Kotlin
                  Multiplatform core and ship it as a real Android app and a
                  real iOS app — then take it through the store review, the
                  privacy policy and the release track. When the work is on the
                  web instead, it is Next.js, and it is fast.
                </p>
                <div className="hero__ctas">
                  <a href="#apps" className="btn btn--primary">
                    See what we’ve shipped
                    <span className="btn__arrow" aria-hidden="true">
                      →
                    </span>
                  </a>
                  <a href={`mailto:${contact.email}`} className="btn btn--ghost">
                    Talk about your project
                  </a>
                </div>
              </div>

              <div className="rise" style={{ animationDelay: "760ms" }}>
                <div className="ledger">
                  <span className="tick tick--tl" aria-hidden="true" />
                  <span className="tick tick--tr" aria-hidden="true" />
                  <span className="tick tick--bl" aria-hidden="true" />
                  <span className="tick tick--br" aria-hidden="true" />
                  {stats.map((stat) => (
                    <div className="ledger__cell" key={stat.label}>
                      <span className="ledger__value">{stat.value}</span>
                      <span className="ledger__label">{stat.label}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div className="shell hero__base rise" style={{ animationDelay: "900ms" }}>
            <span className="hero__coords">
              <span>{contact.coords}</span>
              <span>{contact.timezone}</span>
            </span>
            <span className="scrollCue">
              Scroll
              <span className="scrollCue__rail" aria-hidden="true" />
            </span>
          </div>
        </section>

        {/* ---------- TICKER ---------- */}
        <Marquee items={tickerNames} />

        {/* ---------- APPS ---------- */}
        <section className="section section--flush" id="apps">
          <div className="shell">
            <div className="sectionHead">
              <span className="sectionIndex">01 — Products</span>
              <div className="sectionHead__text reveal">
                <h2 className="sectionTitle">
                  Three apps we designed, built and <em>published ourselves</em>
                </h2>
                <p className="sectionLede">
                  They are how we learned what actually survives a store review
                  — and what a codebase has to look like to still be pleasant at
                  version four.
                </p>
              </div>
            </div>

            <div className="appList">
              {apps.map((app, i) => (
                <AppShowcase key={app.slug} app={app} index={i} />
              ))}
            </div>
          </div>
        </section>

        {/* ---------- CLIENT WORK ---------- */}
        <section className="section" id="work">
          <div className="shell">
            <div className="sectionHead">
              <span className="sectionIndex">02 — Clients</span>
              <div className="sectionHead__text reveal">
                <h2 className="sectionTitle">
                  Accountants, farmers, hoteliers, <em>agencies</em>
                </h2>
                <p className="sectionLede">
                  Different businesses, same brief: make it work, make it fast,
                  make it yours to maintain.
                </p>
              </div>
            </div>

            <WorkIndex clients={clients} />
          </div>
        </section>

        {/* ---------- SERVICES ---------- */}
        <section className="section" id="services">
          <div className="shell">
            <div className="sectionHead">
              <span className="sectionIndex">03 — Services</span>
              <div className="sectionHead__text reveal">
                <h2 className="sectionTitle">
                  Four things, done <em>properly</em>
                </h2>
                <p className="sectionLede">
                  Rather than a list of everything we could theoretically take
                  on.
                </p>
              </div>
            </div>

            <div className="services reveal">
              {services.map((service, i) => (
                <div className="service" key={service.title}>
                  <span className="service__ghost" aria-hidden="true">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <span className="service__num">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <h3 className="service__title">{service.title}</h3>
                  <p className="service__body">{service.body}</p>
                  <ul className="service__points">
                    {service.points.map((p) => (
                      <li key={p}>{p}</li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ---------- STUDIO ---------- */}
        <section className="section" id="studio">
          <div className="shell">
            <div className="sectionHead">
              <span className="sectionIndex">04 — Studio</span>
              <div className="sectionHead__text reveal">
                <h2 className="sectionTitle">How we work</h2>
              </div>
            </div>
          </div>

          <div className="statement">
            <Star className="statement__star" detailed strokeWidth={2.5} />
            <div className="shell">
              <p className="statement__text">
                Write the logic once. Draw the screens twice.{" "}
                <em>Never ship a port.</em>
              </p>
              <p className="statement__attr">The rule the studio runs on</p>
            </div>
          </div>

          <div className="shell">
            <div className="ladder reveal">
              <span className="ladder__rail" aria-hidden="true" />
              {approach.map((step, i) => (
                <div className="step" key={step.title}>
                  <span className="step__marker" aria-hidden="true">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <h3 className="step__title">{step.title}</h3>
                  <p className="step__body">{step.body}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ---------- CONTACT ---------- */}
        <section className="contact" id="contact">
          <Star className="contact__star" detailed strokeWidth={2} />
          <div className="shell contact__inner">
            <h2 className="contact__title reveal">
              Got something that needs <em>building</em>?
            </h2>
            <p className="contact__lede">
              Tell us what it is and roughly when you need it. We answer every
              message, and we will tell you plainly if we are not the right
              studio for the job.
            </p>

            <div className="contact__ctas">
              <Link href="/contact" className="btn btn--primary">
                Start a project
                <span className="btn__arrow" aria-hidden="true">
                  →
                </span>
              </Link>
              <span className="contact__or">or write to us directly</span>
            </div>

            <div className="contact__row">
              <a href={`mailto:${contact.email}`} className="contact__mail">
                {contact.email}
              </a>
              <CopyEmail email={contact.email} />
            </div>

            <div className="contact__meta">
              <span>
                Based in <b>{contact.location}</b>
              </span>
              <span>
                Working in <b>{contact.timezone}</b>
              </span>
              <span>
                Reply within <b>one working day</b>
              </span>
            </div>
          </div>
        </section>
    </>
  );
}
