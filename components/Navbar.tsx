import { Menu } from "lucide-react";
import Link from "next/link";

const NavLink = ({ children, href }: { children: string; href: string }) => (
  <li>
    <Link href={href} className="text-lg lg:text-base">
      {children}
    </Link>
  </li>
);

const links = [
  { href: "ask", label: "Find your scent" },
  { href: "collection", label: "Collection" },
];

const Navbar = () => {
  return (
    <div className="drawer">
      <input id="nav-drawer" type="checkbox" className="drawer-toggle" />

      <div className="drawer-content">
        {/* Navbar */}
        <nav className="navbar border-b border-base-content/20 flex justify-center">
          <div className="container mx-auto max-w-6xl px-4 flex items-center justify-center">
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
              <Link href="/" className="text-xl ">
                Layera
              </Link>
            </div>

            {/* Desktop menu */}
            <ul className="menu menu-horizontal gap-4 hidden lg:flex">
              {links.map((link) => (
                <NavLink key={link.href} href={link.href}>
                  {link.label}
                </NavLink>
              ))}
            </ul>
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
          <ul className="menu gap-2 p-0">
            {links.map((link) => (
              <NavLink key={link.href} href={link.href}>
                {link.label}
              </NavLink>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Navbar;
