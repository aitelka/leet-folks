"use client";

import Image from "next/image";
import { use, useEffect, useState, useRef, useCallback } from "react";
import { flushSync } from "react-dom";
import { NavArrowUp, WarningTriangle } from "iconoir-react";
import UserProfileModal, { ModalUser } from "./UserProfileModal";
import FilterDropdown from "./FilterDropdown";
import ChamferFrame from "./ChamferFrame";
import LeaderboardSkeleton from "./LeaderboardSkeleton";

interface LeaderboardUser {
  id: number;
  login: string;
  displayname: string;
  imageUrl: string | null;
  level: number;
  poolYear: string;
}

export type InitialLoadResult =
  | { ok: true; users: LeaderboardUser[]; hasMore: boolean; poolMonth?: string; poolYear?: string }
  | { ok: false; error: string };

export default function LeaderboardClient({
  dataSource = "leaderboard",
  initialData,
}: {
  dataSource?: "leaderboard" | "pool";
  initialData: Promise<InitialLoadResult>;
}) {
  // Resolves during the server-streamed Suspense boundary set up by the page,
  // so page 1 arrives with the initial HTML instead of after a client mount + fetch.
  const initial = use(initialData);

  const [users, setUsers] = useState<LeaderboardUser[]>(initial.ok ? initial.users : []);
  const [loading, setLoading] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState<string | null>(initial.ok ? null : initial.error);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(initial.ok ? initial.hasMore : false);
  const [promoYear, setPromoYear] = useState<string>("all");
  const [selectedPoolMonth, setSelectedPoolMonth] = useState<string>(initial.ok ? initial.poolMonth || "" : "");
  const [selectedPoolYear, setSelectedPoolYear] = useState<string>(initial.ok ? initial.poolYear || "" : "");
  const [selectedCampusId, setSelectedCampusId] = useState<string>("");
  const [campuses, setCampuses] = useState<{ id: number; name: string; city: string; country: string }[]>([]);
  const [promoYears, setPromoYears] = useState<string[]>([]);
  const [myCountry, setMyCountry] = useState<string>("");
  const [clanColors, setClanColors] = useState<Record<number, string>>({});
  const [activeCardId, setActiveCardId] = useState<number | null>(null);
  const [transitioningCardId, setTransitioningCardId] = useState<number | null>(null);
  
  const [selectedUser, setSelectedUser] = useState<ModalUser | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [showScrollTop, setShowScrollTop] = useState(false);
  const activeCardRef = useRef<HTMLDivElement | null>(null);
  const sentinelRef = useRef<HTMLDivElement | null>(null);
  const loadingMoreRef = useRef(false);

  const filteredUsers = promoYear === "all" ? users : users.filter(u => u.poolYear === promoYear);
  const top3 = filteredUsers.slice(0, 3);

  const campusesByCountry = campuses.reduce((groups, c) => {
    const key = c.country === myCountry ? `${myCountry} (My Country)` : c.country;
    (groups[key] ||= []).push(c);
    return groups;
  }, {} as Record<string, typeof campuses>);
  const countryOrder = Object.keys(campusesByCountry).sort((a, b) =>
    a.endsWith("(My Country)") ? -1 : b.endsWith("(My Country)") ? 1 : a.localeCompare(b)
  );
  const remaining = filteredUsers.slice(3);

  useEffect(() => {
    top3.forEach(user => {
      if (user && clanColors[user.id] === undefined) {
        // Mark as fetching to prevent duplicates
        setClanColors(prev => ({ ...prev, [user.id]: "" }));
        fetch(`/api/user/${user.id}/coalition`)
          .then(res => res.json())
          .then(data => {
            if (data.color) {
              setClanColors(prev => ({ ...prev, [user.id]: data.color }));
            }
          })
          .catch(err => console.error("Coalition fetch err", err));
      }
    });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [promoYear, users]);

  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 400);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleUserClick = useCallback((user: LeaderboardUser, cardElement: HTMLDivElement | null) => {
    activeCardRef.current = cardElement;
    
    if (typeof document === 'undefined' || !document.startViewTransition) {
      setActiveCardId(user.id);
      setSelectedUser(user);
      setIsModalOpen(true);
      return;
    }

    flushSync(() => {
      setTransitioningCardId(user.id);
    });

    document.documentElement.classList.add('vt-active');
    const transition = document.startViewTransition(() => {
      flushSync(() => {
        setActiveCardId(user.id);
        setSelectedUser(user);
        setIsModalOpen(true);
        setTransitioningCardId(null);
      });
    });

    transition.finished.finally(() => {
      document.documentElement.classList.remove('vt-active');
    });
  }, []);

  const handleModalClose = useCallback(() => {
    if (typeof document === 'undefined' || !document.startViewTransition) {
      setIsModalOpen(false);
      setTimeout(() => {
        setActiveCardId(null);
        activeCardRef.current = null;
      }, 400);
      return;
    }

    const transition = document.startViewTransition(() => {
      flushSync(() => {
        setIsModalOpen(false);
        setActiveCardId(null);
        setTransitioningCardId(selectedUser?.id || null);
      });
    });

    transition.finished.finally(() => {
      flushSync(() => {
        setTransitioningCardId(null);
        activeCardRef.current = null;
      });
    });
  }, [selectedUser]);

  const fetchLeaderboard = async (pageNum: number, pMonth?: string, pYear?: string, pCampusId?: string) => {
    try {
      let endpoint = dataSource === "pool" ? `/api/pool?page=${pageNum}` : `/api/leaderboard?page=${pageNum}&limit=50`;

      if (dataSource === "pool") {
        const m = pMonth || selectedPoolMonth;
        const y = pYear || selectedPoolYear;
        const c = pCampusId !== undefined ? pCampusId : selectedCampusId;
        endpoint = `/api/pool?page=${pageNum}`;
        if (m && y) endpoint += `&month=${m}&year=${y}`;
        if (c) endpoint += `&campus_id=${c}`;
      }

      const res = await fetch(endpoint);
      if (!res.ok) {
        const err = await res.json();
        if (res.status === 401) {
          window.location.href = "/api/auth/login";
          return;
        }
        throw new Error(err.error || "Failed to load leaderboard");
      }
      const data = await res.json();
      
      if (pageNum === 1) {
        setUsers(data.users);
        if (dataSource === "pool") {
          setSelectedPoolMonth(data.poolMonth);
          setSelectedPoolYear(data.poolYear);
        }
      } else {
        setUsers((prev) => {
          const existingIds = new Set(prev.map((u) => u.id));
          const newUsers = data.users.filter((u: LeaderboardUser) => !existingIds.has(u.id));
          return [...prev, ...newUsers];
        });
      }
      setHasMore(data.hasMore);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setLoading(false);
      setLoadingMore(false);
      loadingMoreRef.current = false;
    }
  };

  useEffect(() => {
    if (dataSource === "pool") {
      fetch("/api/campuses")
        .then((res) => res.json())
        .then((data) => {
          const list = data.campuses || [];
          setCampuses(list);
          setMyCountry(list.find((c: { id: number }) => c.id === data.myCampusId)?.country || "");
        })
        .catch((err) => console.error("Campuses fetch err", err));
    }

    if (dataSource === "leaderboard") {
      fetch("/api/promo-years")
        .then((res) => res.json())
        .then((data) => setPromoYears(data.years || []))
        .catch((err) => console.error("Promo years fetch err", err));
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleCampusChange = (campusId: string) => {
    setSelectedCampusId(campusId);
    setSelectedPoolMonth("");
    setSelectedPoolYear("");
    setPage(1);
    setLoading(true);
    fetchLeaderboard(1, "", "", campusId);
  };

  const loadMore = () => {
    if (loadingMoreRef.current || !hasMore) return;
    loadingMoreRef.current = true;
    setLoadingMore(true);
    const nextPage = page + 1;
    setPage(nextPage);
    fetchLeaderboard(nextPage);
  };

  useEffect(() => {
    const el = sentinelRef.current;
    if (!el || !hasMore || loading) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) loadMore();
      },
      { rootMargin: "200px" }
    );
    observer.observe(el);
    return () => observer.disconnect();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [hasMore, loading, loadingMore, page]);

  const promoYearOptions = [
    { value: "all", label: "All Promo Years" },
    ...promoYears.map((year) => ({ value: year, label: year })),
  ];

  const monthOptions = [
    { value: "january", label: "January" },
    { value: "february", label: "February" },
    { value: "march", label: "March" },
    { value: "april", label: "April" },
    { value: "may", label: "May" },
    { value: "june", label: "June" },
    { value: "july", label: "July" },
    { value: "august", label: "August" },
    { value: "september", label: "September" },
    { value: "october", label: "October" },
    { value: "november", label: "November" },
    { value: "december", label: "December" },
  ];

  const yearOptions = Array.from({ length: new Date().getFullYear() - 2012 }, (_, i) => 2013 + i)
    .reverse()
    .map((year) => ({ value: year.toString(), label: year.toString() }));

  const campusGroups = countryOrder.map((country) => ({
    label: country,
    options: campusesByCountry[country].map((c) => ({ value: c.id.toString(), label: c.city })),
  }));

  const filtersUi = (
    <>
      {dataSource === "leaderboard" && (
        <div className="poolFilters">
          <FilterDropdown
            value={promoYear}
            onChange={(v) => {
              setPromoYear(v);
              setPage(1);
            }}
            options={promoYearOptions}
          />
        </div>
      )}

      {dataSource === "pool" && (
        <div className="poolFilters">
          <FilterDropdown
            value={selectedCampusId}
            onChange={handleCampusChange}
            placeholder="My Campus"
            groups={campusGroups}
            className="filterDropdown--fit"
          />
          <FilterDropdown
            value={selectedPoolMonth}
            onChange={(newMonth) => {
              setSelectedPoolMonth(newMonth);
              setPage(1);
              setLoading(true);
              fetchLeaderboard(1, newMonth, selectedPoolYear, selectedCampusId);
            }}
            options={monthOptions}
            className="filterDropdown--fit"
          />
          <FilterDropdown
            value={selectedPoolYear}
            onChange={(newYear) => {
              setSelectedPoolYear(newYear);
              setPage(1);
              setLoading(true);
              fetchLeaderboard(1, selectedPoolMonth, newYear, selectedCampusId);
            }}
            options={yearOptions}
            className="filterDropdown--narrow"
          />
        </div>
      )}
    </>
  );

  if (loading) {
    return (
      <>
        {filtersUi}
        <LeaderboardSkeleton />
      </>
    );
  }

  if (error) {
    return (
      <div className="poolError">
        <span className="poolErrorIcon"><WarningTriangle /></span>
        <p>{error}</p>
        <button 
          onClick={() => {
            setError(null);
            fetchLeaderboard(1);
          }} 
          className="poolRetryBtn"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="leaderboardContainer" id="leaderboardContainer">
      {/* Filters */}
      {filtersUi}

      {filteredUsers.length === 0 && (
        <div className="poolEmpty">
          <p>No leaderboard data available.</p>
        </div>
      )}

      {/* Top 3 Podium */}
      {top3.length > 0 && (
        <div className="podiumContainer">
          {/* 2nd Place */}
          {top3[1] && (
            <div
              className={`podiumPlace secondPlace ${activeCardId === top3[1].id ? 'cardActive' : ''}`}
              onClick={(e) => handleUserClick(top3[1], e.currentTarget)}
              style={{
                cursor: "pointer",
                ...(clanColors[top3[1].id] ? { '--clan-color': clanColors[top3[1].id] } : {})
              } as React.CSSProperties}
            >
              <ChamferFrame />
              <div
                className="podiumAvatarContainer"
                style={{ viewTransitionName: transitioningCardId === top3[1].id ? `card-${top3[1].id}` : "none" }}
              >
                <div className="podiumRankBadge">2</div>
                <Image
                  src={top3[1].imageUrl || `https://ui-avatars.com/api/?name=${top3[1].login}&background=0a0a0a&color=00babc&size=200&bold=true`}
                  alt={top3[1].displayname}
                  width={120}
                  height={120}
                  className="podiumAvatar"
                  style={{
                    viewTransitionName: transitioningCardId === top3[1].id ? `avatar-${top3[1].id}` : "none"
                  }}
                />
              </div>
              <span 
                className="podiumName"
                style={{
                  viewTransitionName: transitioningCardId === top3[1].id ? `name-${top3[1].id}` : "none"
                }}
              >
                {top3[1].displayname}
              </span>
              <span className="podiumLogin" style={{
                viewTransitionName: transitioningCardId === top3[1].id ? `login-${top3[1].id}` : "none"
              }}>@{top3[1].login}</span>
              <span className="podiumLevel" style={{
                viewTransitionName: transitioningCardId === top3[1].id ? `level-${top3[1].id}` : "none"
              }}>Lvl {top3[1].level.toFixed(2)}</span>
            </div>
          )}
          
          {/* 1st Place */}
          {top3[0] && (
            <div
              className={`podiumPlace firstPlace ${activeCardId === top3[0].id ? 'cardActive' : ''}`}
              onClick={(e) => handleUserClick(top3[0], e.currentTarget)}
              style={{
                cursor: "pointer",
                ...(clanColors[top3[0].id] ? { '--clan-color': clanColors[top3[0].id] } : {})
              } as React.CSSProperties}
            >
              <ChamferFrame />
              <div
                className="podiumAvatarContainer"
                style={{ viewTransitionName: transitioningCardId === top3[0].id ? `card-${top3[0].id}` : "none" }}
              >
                <div className="podiumRankBadge">1</div>
                <Image
                  src={top3[0].imageUrl || `https://ui-avatars.com/api/?name=${top3[0].login}&background=0a0a0a&color=00babc&size=200&bold=true`}
                  alt={top3[0].displayname}
                  width={160}
                  height={160}
                  className="podiumAvatar"
                  style={{
                    viewTransitionName: transitioningCardId === top3[0].id ? `avatar-${top3[0].id}` : "none"
                  }}
                />
              </div>
              <span 
                className="podiumName"
                style={{
                  viewTransitionName: transitioningCardId === top3[0].id ? `name-${top3[0].id}` : "none"
                }}
              >
                {top3[0].displayname}
              </span>
              <span className="podiumLogin" style={{
                viewTransitionName: transitioningCardId === top3[0].id ? `login-${top3[0].id}` : "none"
              }}>@{top3[0].login}</span>
              <span className="podiumLevel" style={{
                viewTransitionName: transitioningCardId === top3[0].id ? `level-${top3[0].id}` : "none"
              }}>Lvl {top3[0].level.toFixed(2)}</span>
            </div>
          )}

          {/* 3rd Place */}
          {top3[2] && (
            <div
              className={`podiumPlace thirdPlace ${activeCardId === top3[2].id ? 'cardActive' : ''}`}
              onClick={(e) => handleUserClick(top3[2], e.currentTarget)}
              style={{
                cursor: "pointer",
                ...(clanColors[top3[2].id] ? { '--clan-color': clanColors[top3[2].id] } : {})
              } as React.CSSProperties}
            >
              <ChamferFrame />
              <div
                className="podiumAvatarContainer"
                style={{ viewTransitionName: transitioningCardId === top3[2].id ? `card-${top3[2].id}` : "none" }}
              >
                <div className="podiumRankBadge">3</div>
                <Image
                  src={top3[2].imageUrl || `https://ui-avatars.com/api/?name=${top3[2].login}&background=0a0a0a&color=00babc&size=200&bold=true`}
                  alt={top3[2].displayname}
                  width={110}
                  height={110}
                  className="podiumAvatar"
                  style={{
                    viewTransitionName: transitioningCardId === top3[2].id ? `avatar-${top3[2].id}` : "none"
                  }}
                />
              </div>
              <span 
                className="podiumName"
                style={{
                  viewTransitionName: transitioningCardId === top3[2].id ? `name-${top3[2].id}` : "none"
                }}
              >
                {top3[2].displayname}
              </span>
              <span className="podiumLogin" style={{
                viewTransitionName: transitioningCardId === top3[2].id ? `login-${top3[2].id}` : "none"
              }}>@{top3[2].login}</span>
              <span className="podiumLevel" style={{
                viewTransitionName: transitioningCardId === top3[2].id ? `level-${top3[2].id}` : "none"
              }}>Lvl {top3[2].level.toFixed(2)}</span>
            </div>
          )}
        </div>
      )}

      {/* Remaining Users List */}
      <div className="leaderboardList">
        {remaining.map((user, index) => (
          <div
            className={`leaderboardItem ${activeCardId === user.id ? 'cardActive' : ''}`}
            key={user.id}
            style={{
              animationDelay: `${Math.min(index * 0.05, 1)}s`,
              cursor: "pointer"
            } as React.CSSProperties}
            onClick={(e) => handleUserClick(user, e.currentTarget)}
          >
            <div className="leaderboardRank">{index + 4}</div>
            <div 
              style={{
                viewTransitionName: transitioningCardId === user.id ? `card-${user.id}` : "none",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                borderRadius: "50%",
                marginRight: "2rem"
              }}
            >
              <Image
                  src={user.imageUrl || `https://ui-avatars.com/api/?name=${user.login}&background=0a0a0a&color=00babc&size=100&bold=true`}
                  alt={user.displayname}
                  width={72}
                  height={72}
                  className="leaderboardAvatar"
                  style={{
                    marginRight: 0, /* We moved the margin to the wrapper */
                    viewTransitionName: transitioningCardId === user.id ? `avatar-${user.id}` : "none"
                  }}
              />
            </div>
            <div className="leaderboardItemInfo">
              <span 
                className="leaderboardItemName"
                style={{
                  viewTransitionName: transitioningCardId === user.id ? `name-${user.id}` : "none"
                }}
              >
                {user.displayname}
              </span>
              <span className="leaderboardItemLogin" style={{
                viewTransitionName: transitioningCardId === user.id ? `login-${user.id}` : "none"
              }}>@{user.login}</span>
            </div>
            <div className="leaderboardItemLevel" style={{
              viewTransitionName: transitioningCardId === user.id ? `level-${user.id}` : "none"
            }}>
              Lvl {user.level.toFixed(2)}
            </div>
          </div>
        ))}
      </div>

      {hasMore && (
        <div className="loadMoreContainer" ref={sentinelRef}>
          <button
            className="loadMoreBtn"
            onClick={loadMore}
            disabled={loadingMore}
          >
            {loadingMore ? <><span className="loadSpinner" />Loading...</> : "Load More"}
          </button>
        </div>
      )}
      {!hasMore && remaining.length > 0 && (
        <div className="endOfList">
          <p>You&apos;ve reached the end of the leaderboard.</p>
        </div>
      )}

      <UserProfileModal 
        isOpen={isModalOpen} 
        onClose={handleModalClose} 
        user={selectedUser} 
        useViewTransition={typeof document !== 'undefined' && !!document.startViewTransition}
      />

      {/* Jump to Top Button */}
      <div 
        className={`jumpToTopBtn ${showScrollTop ? 'visible' : ''}`}
        onClick={scrollToTop}
        title="Jump to Top"
      >
        <NavArrowUp />
      </div>
    </div>
  );
}
