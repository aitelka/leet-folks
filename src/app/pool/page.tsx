import Link from "next/link";
import AuthButton from "@/components/AuthButton";
import PoolGrid from "@/components/PoolGrid";
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
      <div className="poolBgGradient" />
      <div className="gridOverlay" />

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
          }}
        />
      </nav>

      {/* Page Content */}
      <div className="poolContainer" id="poolContainer">
        <div className="poolHeader">
          <span className="poolBadge">
            {session.poolMonth} {session.poolYear}
          </span>
          <h1 className="poolTitle">
            My <span className="accent">Pool</span>
          </h1>
          <p className="poolSubtitle">
            All the peers who started their journey with you
          </p>
        </div>

        <PoolGrid />
      </div>
    </section>
  );
}
