import { Code, FileText } from "lucide-react";
import Link from "next/link";
import PerfumeBottleIcon from "./PerfumeBottleIcon";

const Footer = () => {
  return (
    <footer className="border-t border-base-content/10">
      <div className="container mx-auto max-w-6xl px-4 py-12">
        <div className="flex flex-col md:flex-row justify-between gap-8">
          {/* Brand */}
          <div className="flex flex-col gap-4">
            <Link
              href="/"
              className="hover:opacity-80 transition-opacity flex items-center gap-1"
            >
              <div className="text-accent">
                <PerfumeBottleIcon />
              </div>
              <span className="text-xl font-semibold tracking-wide font-display">
                Layera
              </span>
            </Link>
            <p className="text-sm text-secondary/50 max-w-xs">
              Discover the art of fragrance layering. Find combinations that
              complement, not compete.
            </p>
          </div>

          {/* Links */}
          <div className="flex gap-16">
            <div className="flex flex-col gap-3">
              <h4 className="font-semibold text-sm">Product</h4>
              <Link
                href="/ask"
                className="text-sm text-secondary/50 hover:text-accent transition-colors"
              >
                Find your scent
              </Link>
              <Link
                href="/collection"
                className="text-sm text-secondary/50 hover:text-accent transition-colors"
              >
                Collection
              </Link>
            </div>

            <div className="flex flex-col gap-3">
              <h4 className="font-semibold text-sm">Resources</h4>
              <Link
                href="/changelog"
                className="text-sm text-secondary/50 hover:text-accent transition-colors flex items-center gap-1"
              >
                <FileText size={14} />
                Changelog
              </Link>
              <a
                href="https://github.com/algusaem/layera"
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-secondary/50 hover:text-accent transition-colors flex items-center gap-1"
              >
                <Code size={14} />
                GitHub
              </a>
            </div>
          </div>
        </div>

        {/* Bottom */}
        <div className="mt-6 pt-6 border-t border-base-content/10 flex flex-col sm:flex-row justify-between items-center gap-4">
          <p className="text-xs text-secondary/40">
            © {new Date().getFullYear()} Layera. All rights reserved.
          </p>
          <p className="text-xs text-secondary/40 italic">
            Made with care for fragrance lovers.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
