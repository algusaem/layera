import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";
import clsx from "clsx";

interface Props {
  page: number;
  totalPages: number;
  basePath: string;
}

const Pagination = ({ page, totalPages, basePath }: Props) => (
  <div className="flex justify-end">
    <div className="join border border-base-content/10">
      <Link
        href={`${basePath}?page=${page - 1}`}
        className={clsx(
          "join-item btn btn-sm btn-accent btn-ghost",
          page <= 1 &&
            "text-gray-500/40 cursor-not-allowed hover:bg-transparent hover:border-transparent"
        )}
      >
        <ChevronLeft size={16} />
      </Link>

      <span className="join-item btn btn-sm btn-ghost pointer-events-none font-medium">
        {page} / {totalPages || 1}
      </span>

      <Link
        href={`${basePath}?page=${page + 1}`}
        className={clsx(
          "join-item btn btn-sm btn-accent btn-ghost",
          page >= totalPages &&
            "text-gray-500/40 cursor-not-allowed hover:bg-transparent hover:border-transparent"
        )}
      >
        <ChevronRight size={16} />
      </Link>
    </div>
  </div>
);

export default Pagination;
