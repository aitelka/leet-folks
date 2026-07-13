import { Suspense } from "react";
import Link from "next/link";
import AuthButton from "@/components/AuthButton";
import LeaderboardClient from "@/components/LeaderboardClient";
import LeaderboardSkeleton from "@/components/LeaderboardSkeleton";
import Sidebar from "@/components/Sidebar";
import { getSession } from "@/lib/session";
import { getLeaderboardPage } from "@/lib/leaderboard-data";
import { redirect } from "next/navigation";

export default async function LeaderboardPage() {
  const session = await getSession();

  // Protect the route
  if (!session) {
    redirect("/");
  }

  if (!session.isStudent) {
    redirect("/pool");
  }

  // Kick off page 1 during render; the promise streams into the client
  // component below instead of the client fetching it after mount.
  const initialData = getLeaderboardPage(session, { page: 1, limit: 50 });

  return (
    <section className="poolPage" id="leaderboardPage">
      {/* Background */}
      <div className="poolBgGradient cyberpunkBgGradient" />
      <div className="gridOverlay cyberpunkGridOverlay" />

      <Sidebar />

      {/* Navigation */}
      <nav className="nav" id="nav">
        <Link href="/" className="logo" id="logo">
          <div className="logoIcon"></div>
          <div className="logoText">
            <span>leet</span>folks
          </div>
        </Link>
        <AuthButton user={{ id: session.userId, login: session.login, avatarUrl: session.avatarUrl, isStudent: session.isStudent }} />
      </nav>

      <div className="md:pl-64">
        <div className="poolContainer">
          <div className="poolHeader">
            <h1 className="poolTitle cyberpunk-text">
              Campus <span className="accent">Leaderboard</span>
            </h1>
            <p className="poolSubtitle">
              Top performers from your campus
            </p>
          </div>

          <Suspense fallback={<LeaderboardSkeleton />}>
            <LeaderboardClient initialData={initialData} />
          </Suspense>
        </div>
      </div>
    </section>
  );
}
