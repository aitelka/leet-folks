"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import UserProfileModal, { ModalUser } from "./UserProfileModal";

interface PoolUser {
  id: number;
  login: string;
  displayname: string;
  imageUrl: string | null;
  level: number;
  validatedPool: boolean;
}

interface PoolData {
  poolMonth: string;
  poolYear: string;
  total: number;
  users: PoolUser[];
}

export default function PoolGrid() {
  const [data, setData] = useState<PoolData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [sortOrder, setSortOrder] = useState<"name_asc" | "name_desc" | "level_asc" | "level_desc">("name_asc");
  const [levelFilter, setLevelFilter] = useState<"all" | "0-5" | "5-10" | "10+">("all");
  const [validatedFilter, setValidatedFilter] = useState<"all" | "validated" | "not_validated">("all");

  const [selectedUser, setSelectedUser] = useState<ModalUser | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    async function fetchPool() {
      try {
        const res = await fetch("/api/pool");
        if (!res.ok) {
          const err = await res.json();
          if (res.status === 401) {
            window.location.href = "/api/auth/login";
            return;
          }
          throw new Error(err.error || "Failed to load pool");
        }
        const poolData: PoolData = await res.json();
        setData(poolData);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Something went wrong");
      } finally {
        setLoading(false);
      }
    }
    fetchPool();
  }, []);

  if (loading) {
    const skeletons = Array.from({ length: 12 }, (_, i) => i);
    return (
      <div className="poolLoadingContainer">
        <h3 className="poolLoadingText">Loading your pool mates...</h3>
        <div className="poolGrid">
          {skeletons.map((i) => (
            <div className="poolCard shimmerCard" key={i}>
              <div className="poolCardImageContainer shimmer"></div>
              <div className="poolCardInfo">
                <div className="shimmerText shimmerName shimmer"></div>
                <div className="shimmerText shimmerLogin shimmer"></div>
                <div className="poolCardBadges">
                  <div className="shimmerBadge shimmer"></div>
                </div>
              </div>
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
        <a href="/api/auth/login" className="poolRetryBtn">
          Sign in again
        </a>
      </div>
    );
  }

  if (!data || data.users.length === 0) {
    return (
      <div className="poolEmpty">
        <p>No pool mates found.</p>
      </div>
    );
  }

  let filteredUsers = data.users.filter(
    (user) =>
      user.login.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.displayname.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (levelFilter !== "all") {
    filteredUsers = filteredUsers.filter((user) => {
      if (levelFilter === "0-5") return user.level >= 0 && user.level < 5;
      if (levelFilter === "5-10") return user.level >= 5 && user.level < 10;
      if (levelFilter === "10+") return user.level >= 10;
      return true;
    });
  }

  if (validatedFilter !== "all") {
    filteredUsers = filteredUsers.filter((user) => {
      if (validatedFilter === "validated") return user.validatedPool;
      if (validatedFilter === "not_validated") return !user.validatedPool;
      return true;
    });
  }

  filteredUsers.sort((a, b) => {
    if (sortOrder === "name_asc") return a.login.localeCompare(b.login);
    if (sortOrder === "name_desc") return -a.login.localeCompare(b.login);
    if (sortOrder === "level_asc") return a.level - b.level;
    if (sortOrder === "level_desc") return b.level - a.level;
    return 0;
  });

  return (
    <>
      {/* Stats bar */}
      <div className="poolStats">
        <div className="poolStatItem">
          <span className="poolStatValue">{data.total}</span>
          <span className="poolStatLabel">Pool Mates</span>
        </div>
        <div className="poolStatDivider" />
        <div className="poolStatItem">
          <span className="poolStatValue">
            {data.poolMonth.charAt(0).toUpperCase() + data.poolMonth.slice(1)}
          </span>
          <span className="poolStatLabel">Month</span>
        </div>
        <div className="poolStatDivider" />
        <div className="poolStatItem">
          <span className="poolStatValue">{data.poolYear}</span>
          <span className="poolStatLabel">Year</span>
        </div>
      </div>

      {/* Controls: Search and View Toggle */}
      <div className="poolControls">
        <div className="poolSearchContainer">
          <div className="poolSearchIcon">
            <svg
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <circle cx="11" cy="11" r="8" />
              <path d="m21 21-4.3-4.3" />
            </svg>
          </div>
          <input
            type="text"
            className="poolSearchInput"
            placeholder="Search by login or name..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            id="poolSearchInput"
          />
          {searchQuery && (
            <button
              className="poolSearchClear"
              onClick={() => setSearchQuery("")}
              aria-label="Clear search"
            >
              ✕
            </button>
          )}
        </div>

        <div className="viewToggle">
          <button 
            className="viewToggleBtn"
            onClick={() => setViewMode(viewMode === "grid" ? "list" : "grid")}
            aria-label={viewMode === "grid" ? "Switch to List View" : "Switch to Grid View"}
          >
            {viewMode === "grid" ? (
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="8" y1="6" x2="21" y2="6"></line>
                <line x1="8" y1="12" x2="21" y2="12"></line>
                <line x1="8" y1="18" x2="21" y2="18"></line>
                <line x1="3" y1="6" x2="3.01" y2="6"></line>
                <line x1="3" y1="12" x2="3.01" y2="12"></line>
                <line x1="3" y1="18" x2="3.01" y2="18"></line>
              </svg>
            ) : (
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="3" y="3" width="7" height="7"></rect>
                <rect x="14" y="3" width="7" height="7"></rect>
                <rect x="14" y="14" width="7" height="7"></rect>
                <rect x="3" y="14" width="7" height="7"></rect>
              </svg>
            )}
          </button>
        </div>
      </div>

      <div className="poolFilters">
        <select 
          className="poolFilterSelect" 
          value={sortOrder} 
          onChange={(e) => setSortOrder(e.target.value as "name_asc" | "name_desc" | "level_asc" | "level_desc")}
        >
          <option value="name_asc">Name (A-Z)</option>
          <option value="name_desc">Name (Z-A)</option>
          <option value="level_desc">Level (High-Low)</option>
          <option value="level_asc">Level (Low-High)</option>
        </select>
        <select 
          className="poolFilterSelect" 
          value={levelFilter} 
          onChange={(e) => setLevelFilter(e.target.value as "all" | "0-5" | "5-10" | "10+")}
        >
          <option value="all">All Levels</option>
          <option value="0-5">Level 0 - 5</option>
          <option value="5-10">Level 5 - 10</option>
          <option value="10+">Level 10+</option>
        </select>
        <select 
          className="poolFilterSelect" 
          value={validatedFilter} 
          onChange={(e) => setValidatedFilter(e.target.value as "all" | "validated" | "not_validated")}
        >
          <option value="all">Validation: All</option>
          <option value="validated">Validated Pool</option>
          <option value="not_validated">Not Validated</option>
        </select>
      </div>

      {/* Results count */}
      {searchQuery && (
        <p className="poolResultCount">
          {filteredUsers.length} result{filteredUsers.length !== 1 ? "s" : ""}{" "}
          found
        </p>
      )}

      {/* User grid/list */}
      <div className={`poolGrid ${viewMode === "list" ? "poolList" : ""}`} id="poolGrid">
        {filteredUsers.map((user, index) => (
          <div
            className="poolCard"
            key={user.id}
            style={{ animationDelay: `${Math.min(index * 0.03, 1)}s`, cursor: "pointer" }}
            onClick={() => {
              setSelectedUser(user);
              setIsModalOpen(true);
            }}
          >
            <div className="poolCardImageContainer">
              <Image
                src={
                  user.imageUrl ||
                  `https://ui-avatars.com/api/?name=${user.login}&background=0a0a0a&color=00babc&size=200&bold=true`
                }
                alt={user.displayname}
                width={120}
                height={120}
                className="poolCardImage"
              />
              <div className="poolCardImageGlow" />
            </div>
            <div className="poolCardInfo">
              <span className="poolCardName">{user.displayname}</span>
              <span className="poolCardLogin">@{user.login}</span>
              <div className="poolCardBadges">
                <span className="poolCardLevel">Lvl {user.level.toFixed(1)}</span>
                {user.validatedPool && (
                  <span className="poolCardValidated">
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="20 6 9 17 4 12"></polyline>
                    </svg>
                    Validated
                  </span>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredUsers.length === 0 && searchQuery && (
        <div className="poolNoResults">
          <p>No users match &quot;{searchQuery}&quot;</p>
        </div>
      )}

      <UserProfileModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        user={selectedUser} 
      />
    </>
  );
}
