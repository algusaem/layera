import Link from "next/link";
import { ChevronLeft, ChevronRight, Search } from "lucide-react";
import PerfumeCard from "./PerfumeCard";
import type { Perfume, PaginationData } from "@/types";
import NoPerfume from "../NoPerfume";
import clsx from "clsx";

type Props = {
  perfumes: Perfume[];
  pagination: PaginationData;
  basePath?: string;
};

const SearchBar = () => (
  <label className="input w-full border-base-content/10 bg-base-200">
    <Search size={20} className="text-secondary/40" />
    <input type="search" required placeholder="Search" />
  </label>
);

const Pagination = ({
  page,
  totalPages,
  basePath,
}: PaginationData & { basePath: string }) => (
  <div className="flex justify-end">
    <div className="join">
      <Link
        href={`${basePath}?page=${page - 1}`}
        className={clsx(
          "join-item btn btn-sm",
          page <= 1 ? "btn-disabled" : ""
        )}
      >
        <ChevronLeft size={16} />
      </Link>

      <span className="join-item btn btn-sm btn-disabled">
        {page} / {totalPages || 1}
      </span>

      <Link
        href={`${basePath}?page=${page + 1}`}
        className={clsx(
          "join-item btn btn-sm",
          page >= totalPages ? "btn-disabled" : ""
        )}
      >
        <ChevronRight size={16} />
      </Link>
    </div>
  </div>
);

const PerfumeGrid = ({
  perfumes,
  pagination,
  basePath = "/collection/browse",
}: Props) => {
  return (
    <>
      <SearchBar />
      <div className="space-y-8">
        {perfumes.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {perfumes.map((perfume) => (
              <PerfumeCard key={perfume.id} perfume={perfume} />
            ))}
          </div>
        ) : (
          <NoPerfume />
        )}
        <Pagination
          page={pagination.page}
          totalPages={pagination.totalPages}
          basePath={basePath}
        />
      </div>
    </>
  );
};

export default PerfumeGrid;
