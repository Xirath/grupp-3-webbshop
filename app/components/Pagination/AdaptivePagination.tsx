"use client";

import { NumberedPagination } from "./NumberedPagination";
import { SimplifiedPagination } from "./SimplifiedPagination";

const MAX_NUMBERED_PAGES = 100;

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  pageSize: number;
}

export const AdaptivePagination: React.FC<PaginationProps> = ({
  currentPage,
  totalPages,
  totalItems,
  pageSize,
}) => {
  if (totalPages <= MAX_NUMBERED_PAGES) {
    return (
      <NumberedPagination
        currentPage={currentPage}
        totalPages={totalPages}
        totalItems={totalItems}
        pageSize={pageSize}
      />
    );
  } else {
    return (
      <SimplifiedPagination
        currentPage={currentPage}
        totalPages={totalPages}
        totalItems={totalItems}
        pageSize={pageSize}
      />
    );
  }
};
