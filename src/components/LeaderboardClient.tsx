"use client";

import Image from "next/image";
import { useEffect, useState, useRef, useCallback } from "react";
import { flushSync } from "react-dom";
import UserProfileModal, { ModalUser } from "./UserProfileModal";

interface LeaderboardUser {
  id: number;
  login: string;
  displayname: string;
  imageUrl: string | null;
  level: number;
  poolYear: string;
}

export default function LeaderboardClient({ dataSource = "leaderboard" }: { dataSource?: "leaderboard" | "pool" }) {
  const [users, setUsers] = useState<LeaderboardUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [promoYear, setPromoYear] = useState<string>("all");
  const [clanColors, setClanColors] = useState<Record<number, string>>({});
  const [activeCardId, setActiveCardId] = useState<number | null>(null);
  const [transitioningCardId, setTransitioningCardId] = useState<number | null>(null);
  
  const [selectedUser, setSelectedUser] = useState<ModalUser | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [showScrollTop, setShowScrollTop] = useState(false);
  const activeCardRef = useRef<HTMLDivElement | null>(null);

  const filteredUsers = promoYear === "all" ? users : users.filter(u => u.poolYear === promoYear);
  const top3 = filteredUsers.slice(0, 3);
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

  const fetchLeaderboard = async (pageNum: number) => {
    try {
      const endpoint = dataSource === "pool" ? `/api/pool` : `/api/leaderboard?page=${pageNum}&limit=50`;
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
      } else {
        setUsers((prev) => [...prev, ...data.users]);
      }
      setHasMore(data.hasMore);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  };

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchLeaderboard(1);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const loadMore = () => {
    if (!loadingMore && hasMore) {
      setLoadingMore(true);
      const nextPage = page + 1;
      setPage(nextPage);
      fetchLeaderboard(nextPage);
    }
  };

  if (loading) {
    const shimmerItems = Array.from({ length: 15 }, (_, i) => i);
    return (
      <div className="leaderboardContainer" id="leaderboardContainer">
        {/* Shimmer Filters */}
        {dataSource === "leaderboard" && (
          <div className="poolFilters" style={{ marginBottom: "2rem", justifyContent: "center" }}>
            <div className="shimmer poolFilterSelect" style={{ width: "200px", height: "40px", border: "none" }}></div>
          </div>
        )}

        {/* Shimmer Podium */}
        <div className="podiumContainer">
          {/* 2nd Place Shimmer */}
          <div className="podiumPlace secondPlace shimmerCard">
            <div className="podiumAvatarContainer">
              <div className="podiumAvatar shimmer" style={{ width: 100, height: 100, border: "none" }}></div>
            </div>
            <div className="shimmerText shimmerName shimmer" style={{ width: "80px", marginBottom: "0.5rem" }}></div>
            <div className="shimmerText shimmerLogin shimmer" style={{ width: "60px", marginBottom: "0.5rem" }}></div>
            <div className="shimmerBadge shimmer" style={{ width: "50px", height: "24px" }}></div>
          </div>
          
          {/* 1st Place Shimmer */}
          <div className="podiumPlace firstPlace shimmerCard">
            <div className="podiumAvatarContainer">
              <div className="podiumAvatar shimmer" style={{ width: 130, height: 130, border: "none" }}></div>
            </div>
            <div className="shimmerText shimmerName shimmer" style={{ width: "100px", marginBottom: "0.5rem" }}></div>
            <div className="shimmerText shimmerLogin shimmer" style={{ width: "70px", marginBottom: "0.5rem" }}></div>
            <div className="shimmerBadge shimmer" style={{ width: "60px", height: "28px" }}></div>
          </div>

          {/* 3rd Place Shimmer */}
          <div className="podiumPlace thirdPlace shimmerCard">
            <div className="podiumAvatarContainer">
              <div className="podiumAvatar shimmer" style={{ width: 90, height: 90, border: "none" }}></div>
            </div>
            <div className="shimmerText shimmerName shimmer" style={{ width: "70px", marginBottom: "0.5rem" }}></div>
            <div className="shimmerText shimmerLogin shimmer" style={{ width: "50px", marginBottom: "0.5rem" }}></div>
            <div className="shimmerBadge shimmer" style={{ width: "40px", height: "20px" }}></div>
          </div>
        </div>

        {/* Shimmer List */}
        <div className="leaderboardList">
          {shimmerItems.map((i) => (
            <div className="leaderboardItem shimmerCard" key={i} style={{ animationDelay: `${Math.min(i * 0.05, 1)}s` }}>
              <div className="leaderboardRank shimmer" style={{ width: "30px", height: "24px", color: "transparent", background: "rgba(255, 255, 255, 0.1)", borderRadius: "4px" }}></div>
              <div className="leaderboardAvatar shimmer" style={{ width: 72, height: 72, border: "none" }}></div>
              <div className="leaderboardItemInfo">
                <div className="shimmerText shimmerName shimmer" style={{ width: "120px", marginBottom: "0.5rem" }}></div>
                <div className="shimmerText shimmerLogin shimmer" style={{ width: "80px" }}></div>
              </div>
              <div className="shimmerBadge shimmer" style={{ width: "60px", height: "24px", marginLeft: "auto" }}></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="poolError">
        <span className="poolErrorIcon">⚠</span>
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

  if (filteredUsers.length === 0) {
    return (
      <div className="poolEmpty">
        <p>No leaderboard data available.</p>
      </div>
    );
  }

  return (
    <div className="leaderboardContainer" id="leaderboardContainer">
      {/* Filters */}
      {dataSource === "leaderboard" && (
        <div className="poolFilters" style={{ marginBottom: "2rem", justifyContent: "center" }}>
          <select 
            className="poolFilterSelect" 
            value={promoYear} 
            onChange={(e) => {
              setPromoYear(e.target.value);
              setPage(1);
            }}
          >
            <option value="all">All Promo Years</option>
            <option value="2024">2024</option>
            <option value="2023">2023</option>
            <option value="2022">2022</option>
            <option value="2021">2021</option>
            <option value="2020">2020</option>
            <option value="2019">2019</option>
            <option value="2018">2018</option>
          </select>
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
        <div className="loadMoreContainer">
          <button 
            className="loadMoreBtn" 
            onClick={loadMore} 
            disabled={loadingMore}
          >
            {loadingMore ? "Loading..." : "Load More"}
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
        ↑
      </div>
    </div>
  );
}
