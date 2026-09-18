import Image from "next/image";
import Link from "next/link";
import TiltFrame from "@/components/TiltFrame";
import type { App } from "@/lib/content";

function Visual({ app }: { app: App }) {
  // Phone screenshots fan out; a single wide graphic sits flat; otherwise the
  // icon carries it on graph paper.
  if (app.shots && app.shots.length > 1) {
    return (
      <div className="shots">
        {app.shots.map((shot) => (
          <span className="shot" key={shot.src}>
            <Image
              src={shot.src}
              alt={shot.alt}
              width={280}
              height={572}
              sizes="(max-width: 1000px) 30vw, 180px"
            />
          </span>
        ))}
      </div>
    );
  }

  if (app.shots && app.shots.length === 1) {
    return (
      <span className="feature">
        <Image
          src={app.shots[0].src}
          alt={app.shots[0].alt}
          width={1024}
          height={500}
          sizes="(max-width: 1000px) 90vw, 440px"
        />
      </span>
    );
  }

  return (
    <div className="placeholder">
      <span className="tick tick--tl" aria-hidden="true" />
      <span className="tick tick--tr" aria-hidden="true" />
      <span className="tick tick--bl" aria-hidden="true" />
      <span className="tick tick--br" aria-hidden="true" />
      <Image
        src={app.icon}
        alt={`${app.name} app icon`}
        width={112}
        height={112}
        className="placeholder__icon"
      />
      <p className="placeholder__text">Screens under wraps until release</p>
    </div>
  );
}

export default function AppShowcase({
  app,
  index,
}: {
  app: App;
  index: number;
}) {
  const live = app.status === "live";

  return (
    <div className="appEntry reveal">
      <div className="appEntry__head">
        <span className="appEntry__num">
          {String(index + 1).padStart(2, "0")} / {app.slug}
        </span>
        <span className="appEntry__rule drawRule" aria-hidden="true" />
        <span className={`badge ${live ? "badge--live" : "badge--dev"}`}>
          <span className="badge__dot" aria-hidden="true" />
          {app.statusLabel}
        </span>
      </div>

      <article className={`app ${index % 2 === 1 ? "app--flip" : ""}`}>
        <div className="app__body">
          <div className="app__head">
            <Image
              src={app.icon}
              alt=""
              width={64}
              height={64}
              className="app__icon"
              aria-hidden="true"
            />
            <div>
              <h3 className="app__name">
                {app.name}
                {app.nativeName ? (
                  <span className="app__native" lang="ar" dir="rtl">
                    {app.nativeName}
                  </span>
                ) : null}
              </h3>
              <div className="app__meta">
                <span>{app.platforms}</span>
                <span aria-hidden="true">·</span>
                <span>{app.packageId}</span>
              </div>
            </div>
          </div>

          <p className="app__tagline">{app.tagline}</p>
          <p className="app__summary">{app.summary}</p>

          <div className="notes">
            {app.highlights.map((h) => (
              <div className="note" key={h.label}>
                <span className="note__label">{h.label}</span>
                <span className="note__detail">{h.detail}</span>
              </div>
            ))}
          </div>

          <ul className="chips">
            {app.stack.map((tech) => (
              <li className="chip" key={tech}>
                {tech}
              </li>
            ))}
          </ul>

          <div className="app__links">
            {app.storeUrl ? (
              <a
                className="textLink"
                href={app.storeUrl}
                target="_blank"
                rel="noreferrer noopener"
              >
                Google Play ↗
              </a>
            ) : null}
            {app.privacyUrl ? (
              <Link className="textLink" href={app.privacyUrl}>
                Privacy policy
              </Link>
            ) : null}
          </div>
        </div>

        <div className="app__visual">
          <TiltFrame>
            <Visual app={app} />
          </TiltFrame>
        </div>
      </article>
    </div>
  );
}
