import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";
import PerfumeCard from "./PerfumeCard";
import type { Perfume, PaginationData } from "@/types";
import NoPerfume from "../NoPerfume";

type Props = {
  perfumes: Perfume[];
  pagination: PaginationData;
};

const Pagination = ({ page, totalPages }: PaginationData) => (
  <div className="flex justify-end">
    <div className="join">
      <Link
        href={`/collection?page=${page - 1}`}
        className={`join-item btn btn-sm ${page <= 1 ? "btn-disabled" : ""}`}
      >
        <ChevronLeft size={16} />
      </Link>
      <span className="join-item btn btn-sm btn-disabled">
        {page} / {totalPages || 1}
      </span>
      <Link
        href={`/collection?page=${page + 1}`}
        className={`join-item btn btn-sm ${
          page >= totalPages ? "btn-disabled" : ""
        }`}
      >
        <ChevronRight size={16} />
      </Link>
    </div>
  </div>
);

const PerfumeGrid = ({ perfumes, pagination }: Props) => {
  return (
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

      <Pagination page={pagination.page} totalPages={pagination.totalPages} />
    </div>
  );
};

export default PerfumeGrid;
