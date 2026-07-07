"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

interface User {
  id: number;
  login: string;
  avatarUrl: string;
}

export default function AuthButton({ user }: { user: User | null }) {
  const [dropdownOpen, setDropdownOpen] = useState(false);

  if (!user) {
    return (
      <a href="/api/auth/login" className="signInButton">
        Sign in with 42
      </a>
    );
  }

  return (
    <div className="userMenuContainer" onMouseLeave={() => setDropdownOpen(false)}>
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
            <span className="userRole">42 Student</span>
          </div>
          <hr className="dropdownDivider" />
          <a href="/api/auth/logout" className="signOutBtn">
            Sign out
          </a>
        </div>
      )}
    </div>
  );
}
