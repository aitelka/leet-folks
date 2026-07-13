import Link from "next/link";
import AuthButton from "@/components/AuthButton";
import LeaderboardClient from "@/components/LeaderboardClient";
import { getSession } from "@/lib/session";
import { redirect } from "next/navigation";

export default async function PoolPage() {
  const session = await getSession();

  if (!session) {
    redirect("/");
  }

  return (
    <section className="poolPage" id="poolPage">
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
        <AuthButton
          user={{
            id: session.userId,
            login: session.login,
            avatarUrl: session.avatarUrl,
            isStudent: session.isStudent,
          }}
        />
      </nav>

      {/* Page Content */}
      <div className="poolContainer" id="poolContainer">
        <div className="poolHeader">
          <h1 className="poolTitle cyberpunk-text">
            Pool <span className="accent">Leaderboard</span>
          </h1>
          <p className="poolSubtitle">
            Top performers from 42 pools
          </p>
        </div>

        <LeaderboardClient dataSource="pool" />
      </div>
    </section>
  );
}
