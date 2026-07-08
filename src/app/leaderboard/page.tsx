import Link from "next/link";
import AuthButton from "@/components/AuthButton";
import LeaderboardClient from "@/components/LeaderboardClient";
import { getSession } from "@/lib/session";
import { redirect } from "next/navigation";

export default async function LeaderboardPage() {
  const session = await getSession();

  // Protect the route
  if (!session) {
    redirect("/");
  }

  return (
    <section className="poolPage" id="leaderboardPage">
      {/* Background */}
      <div className="poolBgGradient cyberpunkBgGradient" />
      <div className="gridOverlay cyberpunkGridOverlay" />

      {/* Navigation */}
      <nav className="nav" id="nav">
        <Link href="/" className="logo" id="logo">
          <div className="logoIcon"></div>
          <div className="logoText">
            <span>leet</span>folks
          </div>
        </Link>
        <AuthButton user={{ id: session.userId, login: session.login, avatarUrl: session.avatarUrl }} />
      </nav>

      <div className="poolContainer">
        <div className="poolHeader">
          <span className="poolBadge">Global Rankings</span>
          <h1 className="poolTitle cyberpunk-text">
            Campus <span className="accent">Leaderboard</span>
          </h1>
          <p className="poolSubtitle">
            Top performers from your campus
          </p>
        </div>

        <LeaderboardClient />
      </div>
    </section>
  );
}
