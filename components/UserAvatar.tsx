"use client";

import { logout } from "@/app/actions/auth";
import { LogOut } from "lucide-react";

type Props = {
  name: string | null | undefined;
  email: string | null | undefined;
};

const getInitials = (
  name: string | null | undefined,
  email: string | null | undefined
) => {
  if (name) {
    const parts = name.trim().split(" ");
    if (parts.length >= 2) {
      return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
    }
    return name.slice(0, 2).toUpperCase();
  }
  if (email) {
    return email.slice(0, 2).toUpperCase();
  }
  return "??";
};

const UserAvatar = ({ name, email }: Props) => {
  const initials = getInitials(name, email);

  return (
    <>
      {/* Desktop: Avatar with dropdown */}
      <div className="dropdown dropdown-end hidden lg:block">
        <div
          tabIndex={0}
          role="button"
          className="avatar placeholder cursor-pointer"
        >
          <div className="bg-accent text-accent-content w-8 h-8 rounded-full flex items-center justify-center">
            <span className="text-xs">{initials}</span>
          </div>
        </div>
        <ul
          tabIndex={0}
          className="dropdown-content menu bg-base-200 rounded-box z-10 w-44 p-2 shadow-lg mt-2"
        >
          <li className="menu-title px-2 py-1">
            <span className="text-xs text-secondary/50">{name || email}</span>
          </li>
          <li>
            <button
              onClick={() => logout()}
              className="flex items-center gap-2"
            >
              <LogOut size={16} />
              Logout
            </button>
          </li>
        </ul>
      </div>

      {/* Mobile: Show menu content directly */}
      <div className="lg:hidden flex flex-col gap-2">
        <span className="text-sm text-secondary/50">{name || email}</span>
        <button
          onClick={() => logout()}
          className="text-lg hover:text-accent transition-colors flex items-center gap-2 cursor-pointer"
        >
          <LogOut size={18} />
          Logout
        </button>
      </div>
    </>
  );
};

export default UserAvatar;
