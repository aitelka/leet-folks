"use client";

import Image from "next/image";
import Link from "next/link";
import { useState, useRef, useEffect } from "react";

interface User {
  id: number;
  login: string;
  avatarUrl: string;
  isStudent: boolean;
}

export default function AuthButton({ user }: { user: User | null }) {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setDropdownOpen(false);
      }
    };
    
    if (dropdownOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [dropdownOpen]);

  if (!user) {
    return (
      <a href="/api/auth/login" className="signInButton">
        Sign in with 42
      </a>
    );
  }

  return (
    <div className="userMenuContainer" ref={menuRef}>
      <button 
        className="userAvatarBtn" 
        onClick={() => setDropdownOpen(!dropdownOpen)}
        aria-label="User menu"
      >
        <Image 
          src={user.avatarUrl || `https://ui-avatars.com/api/?name=${user.login}&background=random`} 
          alt={user.login} 
          width={40} 
          height={40} 
          className="userAvatar"
        />
      </button>

      {dropdownOpen && (
        <div className="userDropdown">
          <div className="userInfo">
            <span className="userLogin">{user.login}</span>
            <span className="userRole">{user.isStudent ? "42 Student" : "42 Pooler"}</span>
          </div>
          <div className="dropdownLinks">
            {user.isStudent && (
              <Link href="/leaderboard" className="dropdownLink" onClick={() => setDropdownOpen(false)}>
                Leaderboard
              </Link>
            )}
            {user.isStudent && (
              <Link href="/pool" className="dropdownLink" onClick={() => setDropdownOpen(false)}>
                My Pool
              </Link>
            )}
          </div>
          <hr className="dropdownDivider" />
          <a href="/api/auth/logout" className="signOutBtn" onClick={() => setDropdownOpen(false)}>
            Sign out
          </a>
        </div>
      )}
    </div>
  );
}
