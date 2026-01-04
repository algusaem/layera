import { Menu, Home, Sparkles, Library, LogIn } from "lucide-react";
import Link from "next/link";
import { auth } from "@/lib/auth";
import UserAvatar from "./UserAvatar";
import type { LucideIcon } from "lucide-react";

const NavLink = ({
  children,
  href,
  mobile = false,
  icon: Icon,
}: {
  children: string;
  href: string;
  mobile?: boolean;
  icon?: LucideIcon;
}) => (
  <Link
    href={href}
    className={
      mobile
        ? "btn btn-ghost justify-start text-lg"
        : "text-lg lg:text-base hover:text-accent transition-colors flex items-center gap-2"
    }
  >
    {Icon && <Icon size={mobile ? 20 : 18} />}
    {children}
  </Link>
);

const links = [
  { href: "/", label: "Home", icon: Home },
  { href: "/ask", label: "Find your scent", icon: Sparkles },
  { href: "/collection", label: "Collection", icon: Library },
];

const Navbar = async () => {
  const session = await auth();
  const user = session?.user;

  return (
    <div className="drawer drawer-end">
      <input id="nav-drawer" type="checkbox" className="drawer-toggle" />

      <div className="drawer-content flex justify-center w-full">
        {/* Navbar */}
        <nav className="navbar border-b border-base-content/20 max-w-6xl w-full px-4">
          <div className="flex items-center justify-center w-full">
            {/* Logo */}
            <div className="flex-1 w-full flex justify-start">
              <Link
                href="/"
                className="text-xl hover:text-accent transition-colors bg-transparent"
              >
                Layera
              </Link>
            </div>

            {/* Mobile menu button */}
            <div className="flex-none lg:hidden">
              <label
                htmlFor="nav-drawer"
                aria-label="open sidebar"
                className="btn btn-square btn-ghost"
              >
                <Menu size={24} />
              </label>
            </div>

            {/* Desktop menu */}
            <div className="hidden lg:flex gap-6 items-center">
              {links.map((link) => (
                <NavLink key={link.href} href={link.href} icon={link.icon}>
                  {link.label}
                </NavLink>
              ))}

              {/* Auth section */}
              {user ? (
                <UserAvatar name={user.name} email={user.email} />
              ) : (
                <NavLink href="/collection/login" icon={LogIn}>
                  Log In
                </NavLink>
              )}
            </div>
          </div>
        </nav>
      </div>

      {/* Mobile drawer sidebar */}
      <div className="drawer-side z-50">
        <label
          htmlFor="nav-drawer"
          aria-label="close sidebar"
          className="drawer-overlay"
        />
        <div className="min-h-full w-72 bg-base-200 p-6">
          {/* Drawer menu */}
          <div className="flex flex-col gap-2">
            {links.map((link) => (
              <NavLink key={link.href} href={link.href} mobile icon={link.icon}>
                {link.label}
              </NavLink>
            ))}

            {/* Auth section for mobile */}
            <div className="mt-4 pt-4 border-t border-base-content/10">
              {user ? (
                <UserAvatar name={user.name} email={user.email} />
              ) : (
                <NavLink href="/collection/login" mobile icon={LogIn}>
                  Log In
                </NavLink>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Navbar;
