"use client";

import { logout } from "@/app/actions/auth/logout";
import { LogOut } from "lucide-react";

const LogoutButton = () => {
  return (
    <button
      onClick={() => logout()}
      className="hover:text-accent transition-colors cursor-pointer"
    >
      <LogOut size={20} />
    </button>
  );
};

export default LogoutButton;
