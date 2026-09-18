import Link from "next/link";
import { sitePolicy } from "@/lib/policies";
import { contact } from "@/lib/content";

export default function SiteFooter() {
  return (
    <footer className="footer">
      <div className="shell footer__inner">
        <span className="footer__note">
          © {new Date().getFullYear()} Leet Folks · {contact.location}
        </span>
        <div className="footer__links">
          {/* Only the studio policy belongs here. The three app policies
              exist for the Play listings, and are linked from the foot of
              that page rather than cluttering every footer. */}
          <Link className="footer__link" href={sitePolicy.href}>
            Privacy
          </Link>
          <Link className="footer__link" href="/contact">
            Contact
          </Link>
        </div>
        <a className="toTop" href="#main">
          <span aria-hidden="true">↑</span> Back to top
        </a>
      </div>

      <span className="footer__wordmark" aria-hidden="true">
        leetfolks
      </span>
    </footer>
  );
}
