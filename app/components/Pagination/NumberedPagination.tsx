"use client";

import React, { useMemo, useTransition } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  pageSize: number;
}

// Note: Button-text overflows at > 999 pages, use SimplifiedPagination instead
export const NumberedPagination: React.FC<PaginationProps> = ({
  currentPage,
  totalPages,
}) => {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const [isPending, startTransition] = useTransition();

  const safeTotalPages = Math.max(totalPages, 1);

  const safeCurrentPage = Math.min(Math.max(currentPage, 1), safeTotalPages);

  const pageNumbers = useMemo(() => {
    const pages: (number | "...")[] = [];

    if (safeTotalPages <= 7) {
      for (let i = 1; i <= safeTotalPages; i++) {
        pages.push(i);
      }

      return pages;
    }

    if (safeCurrentPage <= 4) {
      pages.push(1, 2, 3, 4, 5, "...", safeTotalPages);
      return pages;
    }

    if (safeCurrentPage >= safeTotalPages - 3) {
      pages.push(
        1,
        "...",
        safeTotalPages - 4,
        safeTotalPages - 3,
        safeTotalPages - 2,
        safeTotalPages - 1,
        safeTotalPages,
      );

      return pages;
    }

    pages.push(
      1,
      "...",
      safeCurrentPage - 1,
      safeCurrentPage,
      safeCurrentPage + 1,
      "...",
      safeTotalPages,
    );

    return pages;
  }, [safeCurrentPage, safeTotalPages]);

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

  return (
    <nav
      aria-label="Pagination"
      className="flex flex-col sm:flex-row items-center justify-center gap-4 mt-8 page-container"
    >
      <div className="flex items-center gap-2 px-5">
        <button
          type="button"
          aria-label="Previous page"
          onClick={() => changePage(safeCurrentPage - 1)}
          disabled={safeCurrentPage === 1 || isPending}
          className="w-9 h-9 flex items-center justify-center rounded-md border hover:bg-gray-100 disabled:opacity-40 disabled:cursor-not-allowed"
        >
          <ChevronLeft size={18} />
        </button>
        <div className="hidden sm:flex items-center gap-2">
          {pageNumbers.map((page, index) =>
            page === "..." ? (
              <span
                key={`ellipsis-${index}`}
                aria-hidden="true"
                className="w-9 h-9 flex items-center justify-center text-gray-400"
              >
                ...
              </span>
            ) : (
              <button
                type="button"
                key={`page-${page}`}
                onClick={() => changePage(page)}
                aria-current={page === safeCurrentPage ? "page" : undefined}
                aria-label={`Go to page ${page}`}
                disabled={isPending && page !== safeCurrentPage}
                className={`w-9 h-9 flex items-center justify-center tabular-nums rounded-md font-medium transition ${
                  page === safeCurrentPage
                    ? "bg-gray-800 text-white"
                    : "border hover:bg-gray-100"
                } disabled:opacity-50 disabled:cursor-not-allowed`}
              >
                {page}
              </button>
            ),
          )}
        </div>
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
