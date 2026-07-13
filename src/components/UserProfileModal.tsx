"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import ChamferFrame from "./ChamferFrame";

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
  useViewTransition?: boolean;
}

export default function UserProfileModal({ isOpen, onClose, user, useViewTransition }: UserProfileModalProps) {
  const [isRendered, setIsRendered] = useState(isOpen);
  const [isVisible, setIsVisible] = useState(isOpen);

  useEffect(() => {
    if (isOpen) {
      const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth;
      document.body.style.paddingRight = `${scrollbarWidth}px`;
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.paddingRight = '0px';
      document.body.style.overflow = 'unset';
    }
  }, [isOpen]);

  useEffect(() => {
    if (useViewTransition) return;

    if (isOpen) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setIsRendered(true);
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          setIsVisible(true);
        });
      });
    } else {
      setIsVisible(false);
      const timeout = setTimeout(() => setIsRendered(false), 400);
      return () => clearTimeout(timeout);
    }
  }, [isOpen, useViewTransition]);

  const activeRender = useViewTransition ? isOpen : isRendered;
  if (!activeRender || !user) return null;

  const defaultAvatar = `https://ui-avatars.com/api/?name=${user.login}&background=0a0a0a&color=00babc&size=250&bold=true`;

  const overlayClass = `userModalOverlay ${useViewTransition ? 'vt-modal' : (isVisible ? 'visible' : '')}`;
  const contentClass = `userModalContent ${useViewTransition ? 'vt-modal' : (isVisible ? 'visible' : '')}`;

  const modalContent = (
    <div className={overlayClass} onClick={onClose} style={{ viewTransitionName: 'modal-overlay' }}>
      <div 
        className={contentClass} 
        onClick={(e) => e.stopPropagation()}
        style={{ viewTransitionName: `card-${user.id}` }}
      >
        <ChamferFrame />
        <button className="userModalCloseBtn" onClick={onClose}>×</button>

        <div className="userModalHeader">
          <div className="userModalAvatarWrapper">
            <Image
              src={user.imageUrl || defaultAvatar}
              alt={user.displayname}
              width={120}
              height={120}
              className="userModalAvatar"
              style={{ viewTransitionName: `avatar-${user.id}` }}
            />
          </div>
          <div className="userModalIdentity">
            <h2 className="userModalName" style={{ viewTransitionName: `name-${user.id}` }}>{user.displayname}</h2>
            <a 
              href={`https://profile.intra.42.fr/users/${user.login}`} 
              target="_blank" 
              rel="noopener noreferrer"
              className="userModalLogin"
              style={{ viewTransitionName: `login-${user.id}` }}
            >
              @{user.login}
            </a>
          </div>
        </div>

        <div className="userModalStats">
          <div className="userModalStatBox">
            <span className="statLabel">Level</span>
            <span className="statValue" style={{ viewTransitionName: `level-${user.id}` }}>{user.level.toFixed(2)}</span>
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

  if (typeof document !== 'undefined') {
    return createPortal(modalContent, document.body);
  }
  
  return null;
}
