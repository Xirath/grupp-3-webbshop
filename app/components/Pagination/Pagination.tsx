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

export const Pagination: React.FC<PaginationProps> = ({
  currentPage,
  totalPages,
  totalItems,
  pageSize,
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

  const startItem = totalItems === 0 ? 0 : (safeCurrentPage - 1) * pageSize + 1;

  const endItem = Math.min(safeCurrentPage * pageSize, totalItems);

  return (
    <nav
      aria-label="Pagination"
      className="flex flex-col sm:flex-row items-center justify-between gap-4 mt-8"
    >
      <p className="text-sm text-gray-600">
        Showing <strong>{startItem}</strong> to <strong>{endItem}</strong> of{" "}
        <strong>{totalItems}</strong> products
      </p>

      <div className="flex items-center gap-2">
        <button
          type="button"
          aria-label="Previous page"
          onClick={() => changePage(safeCurrentPage - 1)}
          disabled={safeCurrentPage === 1 || isPending}
          className="p-2 rounded-md border hover:bg-gray-100 disabled:opacity-40 disabled:cursor-not-allowed"
        >
          <ChevronLeft size={18} />
        </button>
        <div className="hidden sm:flex items-center gap-2">
          {pageNumbers.map((page, index) =>
            page === "..." ? (
              <span
                key={`ellipsis-${index}`}
                aria-hidden="true"
                className="px-2 text-gray-400"
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
                className={`min-w-9 h-9 px-3 rounded-md font-medium transition ${
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
          className="p-2 rounded-md border hover:bg-gray-100 disabled:opacity-40 disabled:cursor-not-allowed"
        >
          <ChevronRight size={18} />
        </button>
      </div>
    </nav>
  );
};
