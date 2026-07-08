"use client";

import Image from "next/image";
import { useEffect, useState } from "react";

export interface ModalUser {
  id: number;
  login: string;
  displayname: string;
  imageUrl: string | null;
  level: number;
  validatedPool?: boolean;
}

interface UserProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: ModalUser | null;
}

export default function UserProfileModal({ isOpen, onClose, user }: UserProfileModalProps) {
  const [isRendered, setIsRendered] = useState(isOpen);
  const [isVisible, setIsVisible] = useState(isOpen);

  if (isOpen && !isRendered) {
    setIsRendered(true);
  }

  useEffect(() => {
    if (isOpen) {
      requestAnimationFrame(() => {
        setIsVisible(true);
      });
      const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth;
      document.body.style.paddingRight = `${scrollbarWidth}px`;
      document.body.style.overflow = 'hidden';
    } else {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setIsVisible(false);
      document.body.style.paddingRight = '0px';
      document.body.style.overflow = 'unset';
      const timeout = setTimeout(() => setIsRendered(false), 300);
      return () => clearTimeout(timeout);
    }
  }, [isOpen]);

  if (!isRendered || !user) return null;

  const defaultAvatar = `https://ui-avatars.com/api/?name=${user.login}&background=0a0a0a&color=00babc&size=250&bold=true`;

  return (
    <div className={`userModalOverlay ${isVisible ? 'visible' : ''}`} onClick={onClose}>
      <div 
        className={`userModalContent ${isVisible ? 'visible' : ''}`} 
        onClick={(e) => e.stopPropagation()}
        style={{ viewTransitionName: isOpen ? `card-${user.id}` : 'none' }}
      >
        <button className="userModalCloseBtn" onClick={onClose}>×</button>
        
        <div className="userModalHeader">
          <div className="userModalAvatarWrapper">
            <Image
              src={user.imageUrl || defaultAvatar}
              alt={user.displayname}
              width={120}
              height={120}
              className="userModalAvatar"
              style={{ viewTransitionName: isOpen ? `avatar-${user.id}` : 'none' }}
            />
          </div>
          <div className="userModalIdentity">
            <h2 className="userModalName" style={{ viewTransitionName: isOpen ? `name-${user.id}` : 'none' }}>{user.displayname}</h2>
            <a 
              href={`https://profile.intra.42.fr/users/${user.login}`} 
              target="_blank" 
              rel="noopener noreferrer"
              className="userModalLogin"
            >
              @{user.login}
            </a>
          </div>
        </div>

        <div className="userModalStats">
          <div className="userModalStatBox">
            <span className="statLabel">Level</span>
            <span className="statValue">{user.level.toFixed(2)}</span>
          </div>
          
          {user.validatedPool !== undefined && (
            <div className="userModalStatBox">
              <span className="statLabel">Status</span>
              <span className={`statValue ${user.validatedPool ? 'statusValid' : 'statusPending'}`}>
                {user.validatedPool ? 'Validated' : 'Pending'}
              </span>
            </div>
          )}
        </div>

        <div className="userModalFooter">
          <a 
            href={`https://profile.intra.42.fr/users/${user.login}`} 
            target="_blank" 
            rel="noopener noreferrer"
            className="userModalActionBtn"
          >
            Intra Profile ↗
          </a>
        </div>
      </div>
    </div>
  );
}
