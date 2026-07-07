import Countdown from "@/components/Countdown";
import Particles from "@/components/Particles";
import Link from "next/link";
import AuthButton from "@/components/AuthButton";
import { getSession } from "@/lib/session";

export default async function Home() {
  const session = await getSession();
  
  return (
    <section className="hero" id="hero">
      {/* Background effects */}
      <Particles />
      <div className="gridOverlay" />

      {/* Navigation */}
      <nav className="nav" id="nav">
        <Link href="/" className="logo" id="logo">
          <div className="logoIcon">
            
          </div>
          <div className="logoText">
            <span>leet</span>folks
          </div>
        </Link>
        <AuthButton user={session ? { id: session.userId, login: session.login, avatarUrl: session.avatarUrl } : null} />
      </nav>

      {/* Hero Content */}
      <div className="heroContent" id="heroContent">
        <span className="heroTagline">Something big is coming</span>

        <h1 className="heroTitle">
          <span className="line">
            We build <span className="italic">the</span>
          </span>
          <span className="line">
            <span className="accent">future</span>
          </span>
          <span className="line">
            together<span className="cursor" />
          </span>
        </h1>

        <p className="heroSubtitle">
          A peer-driven community redefining what it means to build, learn, and
          grow together. No barriers. No limits. Just people who code.
        </p>

        <Countdown />
      </div>

      {/* Bottom bar */}
      <div className="bottomBar" id="bottomBar">

        <div className="scrollHint">
          <span>Stay tuned</span>
          <div className="scrollLine" />
        </div>
      </div>
    </section>
  );
}
