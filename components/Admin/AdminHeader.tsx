import clsx from "clsx";
import Link from "next/link";
import { ClipboardCheck, History, Droplets, LucideIcon } from "lucide-react";

interface NavItem {
  href: string;
  label: string;
  key: string;
  icon: LucideIcon;
}

const navItems: NavItem[] = [
  { href: "/admin", label: "Review", key: "review", icon: ClipboardCheck },
  { href: "/admin/perfumes", label: "Perfumes", key: "perfumes", icon: Droplets },
  { href: "/admin/history", label: "Log History", key: "history", icon: History },
];

const AdminHeader = ({ selected }: { selected: string }) => (
  <header className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6">
    <div>
      <p className="text-accent uppercase tracking-widest text-sm mb-2">
        Admin
      </p>
      <h1 className="text-4xl md:text-5xl font-serif italic">Dashboard</h1>
    </div>
    <nav className="flex gap-1 bg-base-200/50 p-1 rounded-lg w-full sm:w-fit">
      {navItems.map((item) => (
        <Link
          key={item.key}
          href={item.href}
          className={clsx(
            "p-2 sm:px-4 sm:py-2 rounded-md text-sm transition-colors flex items-center gap-2",
            selected === item.key
              ? "bg-accent text-accent-content font-medium"
              : "text-secondary/70 hover:text-secondary hover:bg-base-300/50"
          )}
        >
          <item.icon size={18} />
          <span className="hidden sm:inline">{item.label}</span>
        </Link>
      ))}
    </nav>
  </header>
);

export default AdminHeader;
