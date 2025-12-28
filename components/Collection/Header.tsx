import clsx from "clsx";
import Link from "next/link";

type NavItem = {
  href: string;
  label: string;
  key: string;
};

const navItems: NavItem[] = [
  { href: "/collection", label: "My Collection", key: "collection" },
  { href: "/collection/browse", label: "Browse Database", key: "browse" },
  { href: "/collection/add", label: "Add Perfume", key: "add" },
];

const Header = ({ selected }: { selected: string }) => (
  <header className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6">
    <div>
      <p className="text-accent uppercase tracking-widest text-sm mb-2">
        Your Fragrances
      </p>
      <h1 className="text-4xl md:text-5xl font-serif italic">Collection</h1>
    </div>
    <nav className="flex gap-1 bg-base-200/50 p-1 rounded-lg">
      {navItems.map((item) => (
        <Link
          key={item.key}
          href={item.href}
          className={clsx(
            "px-4 py-2 rounded-md text-sm transition-colors",
            selected === item.key
              ? "bg-accent text-accent-content font-medium"
              : "text-secondary/70 hover:text-secondary hover:bg-base-300/50"
          )}
        >
          {item.label}
        </Link>
      ))}
    </nav>
  </header>
);

export default Header;
