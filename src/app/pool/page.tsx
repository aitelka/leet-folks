import { Suspense } from "react";
import Link from "next/link";
import AuthButton from "@/components/AuthButton";
import LeaderboardClient from "@/components/LeaderboardClient";
import LeaderboardSkeleton from "@/components/LeaderboardSkeleton";
import Sidebar from "@/components/Sidebar";
import { getSession } from "@/lib/session";
import { getPoolPage } from "@/lib/pool-data";
import { redirect } from "next/navigation";

export default async function PoolPage() {
  const session = await getSession();

  if (!session) {
    redirect("/");
  }

  // Kick off page 1 during render; the promise streams into the client
  // component below instead of the client fetching it after mount.
  const initialData = getPoolPage(session, { page: 1 });

  return (
    <section className="poolPage" id="poolPage">
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
      <div className="md:pl-64">
        <div className="poolContainer" id="poolContainer">
          <div className="poolHeader">
            <h1 className="poolTitle cyberpunk-text">
              Pool <span className="accent">Leaderboard</span>
            </h1>
            <p className="poolSubtitle">
              Top performers from 42 pools
            </p>
          </div>

          <Suspense fallback={<LeaderboardSkeleton />}>
            <LeaderboardClient dataSource="pool" initialData={initialData} />
          </Suspense>
        </div>
      </div>
    </section>
  );
}
