"use client";

import React, { useTransition } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  pageSize: number;
}

export const SimplifiedPagination: React.FC<PaginationProps> = ({
  currentPage,
  totalPages,
}) => {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const [isPending, startTransition] = useTransition();

  const safeTotalPages = Math.max(totalPages, 1);
  const safeCurrentPage = Math.min(Math.max(currentPage, 1), safeTotalPages);

  if (totalPages <= 1) return null;

  const changePage = (page: number) => {
    if (
      page < 1 ||
      page > safeTotalPages ||
      page === safeCurrentPage ||
      isPending
    ) {
      return;
    }

    const params = new URLSearchParams(searchParams.toString());
    params.set("page", String(page));

    startTransition(() => {
      router.replace(`${pathname}?${params.toString()}`, {
        scroll: false,
      });
    });
  };

  const handleJumpAction = (formData: FormData) => {
    const rawValue =
      formData.get("page")?.toString().trim() ?? String(safeCurrentPage);
    const targetPage = Number(rawValue);

    if (!isNaN(targetPage) && targetPage >= 1 && targetPage <= safeTotalPages) {
      changePage(targetPage);
    }
  };

  return (
    <nav
      aria-label="Pagination"
      className="flex flex-col sm:flex-row items-center justify-center gap-4 mt-8 page-container"
    >
      <div className="flex items-center gap-3 px-5">
        {/* Previous Button */}
        <button
          type="button"
          aria-label="Previous page"
          onClick={() => changePage(safeCurrentPage - 1)}
          disabled={safeCurrentPage === 1 || isPending}
          className="w-9 h-9 flex items-center justify-center rounded-md border hover:bg-gray-100 disabled:opacity-40 disabled:cursor-not-allowed"
        >
          <ChevronLeft size={18} />
        </button>

        <form
          action={handleJumpAction}
          className="flex items-center gap-2 text-sm text-gray-700"
        >
          <label htmlFor="jump-to-page" className="sr-only">
            Page number
          </label>
          <span>Page</span>
          <input
            key={safeCurrentPage}
            id="jump-to-page"
            name="page"
            type="number"
            min={1}
            max={safeTotalPages}
            defaultValue={safeCurrentPage}
            disabled={isPending}
            className="w-16 h-9 px-2 text-center border rounded-md font-medium tabular-nums focus:outline-none focus:ring-2 focus:ring-gray-800 disabled:opacity-50"
          />
          <span>of {safeTotalPages.toLocaleString()}</span>
          <button
            type="submit"
            disabled={isPending}
            className="h-9 px-3 text-xs font-semibold uppercase tracking-wider rounded-md border hover:bg-gray-100 disabled:opacity-40 disabled:cursor-not-allowed transition"
          >
            Go
          </button>
        </form>

        {/* Next Button */}
        <button
          type="button"
          aria-label="Next page"
          onClick={() => changePage(safeCurrentPage + 1)}
          disabled={safeCurrentPage === safeTotalPages || isPending}
          className="w-9 h-9 flex items-center justify-center rounded-md border hover:bg-gray-100 disabled:opacity-40 disabled:cursor-not-allowed"
        >
          <ChevronRight size={18} />
        </button>
      </div>
    </nav>
  );
};
