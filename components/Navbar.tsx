import { Menu } from "lucide-react";
import Link from "next/link";
import { auth } from "@/lib/auth";
import UserAvatar from "./UserAvatar";

const NavLink = ({ children, href }: { children: string; href: string }) => (
  <Link
    href={href}
    className="text-lg lg:text-base hover:text-accent transition-colors"
  >
    {children}
  </Link>
);

const links = [
  { href: "/ask", label: "Find your scent" },
  { href: "/collection", label: "Collection" },
];

const Navbar = async () => {
  const session = await auth();
  const user = session?.user;

  return (
    <div className="drawer">
      <input id="nav-drawer" type="checkbox" className="drawer-toggle" />

      <div className="drawer-content flex justify-center w-full">
        {/* Navbar */}
        <nav className="navbar border-b border-base-content/20 max-w-6xl">
          <div className="container mx-auto px-4 flex items-center justify-center">
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

            {/* Logo */}
            <div className="flex-1 w-full flex justify-center lg:justify-start">
              <Link
                href="/"
                className="text-xl hover:text-accent transition-colors bg-transparent"
              >
                Layera
              </Link>
            </div>

            {/* Desktop menu */}
            <div className="hidden lg:flex gap-6 items-center">
              {links.map((link) => (
                <NavLink key={link.href} href={link.href}>
                  {link.label}
                </NavLink>
              ))}

              {/* Auth section */}
              {user ? (
                <UserAvatar name={user.name} email={user.email} />
              ) : (
                <NavLink href="/collection/login">Log In</NavLink>
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
          {/* Drawer header */}
          <p className="text-xl mb-8">Layera</p>

          {/* Drawer menu */}
          <div className="flex flex-col gap-4">
            {links.map((link) => (
              <NavLink key={link.href} href={link.href}>
                {link.label}
              </NavLink>
            ))}

            {/* Auth section for mobile */}
            <div className="mt-4 pt-4 border-t border-base-content/10">
              {user ? (
                <UserAvatar name={user.name} email={user.email} />
              ) : (
                <NavLink href="/collection/login">Log In</NavLink>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Navbar;
