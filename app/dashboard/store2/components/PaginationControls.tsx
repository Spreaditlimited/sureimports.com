"use client";

import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
  PaginationEllipsis,
} from "./ui/pagination";

interface PaginationControlsProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export function PaginationControls({
  currentPage,
  totalPages,
  onPageChange,
}: PaginationControlsProps) {
  if (totalPages <= 1) return null;

  const getVisiblePages = () => {
    const visiblePages: (number | string)[] = [];
    
    if (totalPages <= 7) {
      // Show all pages if 7 or fewer
      for (let i = 1; i <= totalPages; i++) {
        visiblePages.push(i);
      }
    } else {
      // Show first page
      visiblePages.push(1);
      
      if (currentPage <= 4) {
        // Show pages 1-5 + ... + last
        for (let i = 2; i <= 5; i++) {
          visiblePages.push(i);
        }
        visiblePages.push("ellipsis");
        visiblePages.push(totalPages);
      } else if (currentPage >= totalPages - 3) {
        // Show first + ... + last 5 pages
        visiblePages.push("ellipsis");
        for (let i = totalPages - 4; i <= totalPages; i++) {
          visiblePages.push(i);
        }
      } else {
        // Show first + ... + current-1, current, current+1 + ... + last
        visiblePages.push("ellipsis");
        for (let i = currentPage - 1; i <= currentPage + 1; i++) {
          visiblePages.push(i);
        }
        visiblePages.push("ellipsis");
        visiblePages.push(totalPages);
      }
    }
    
    return visiblePages;
  };

  const visiblePages = getVisiblePages();

  return (
    <Pagination className="mt-8">
      <PaginationContent>
        <PaginationItem>
          <PaginationPrevious
            onClick={(e) => {
              e.preventDefault();
              if (currentPage > 1) onPageChange(currentPage - 1);
            }}
            className={
              currentPage <= 1
                ? "pointer-events-none opacity-50"
                : "cursor-pointer"
            }
          />
        </PaginationItem>

        {visiblePages.map((page, index) => (
          <PaginationItem key={index}>
            {page === "ellipsis" ? (
              <PaginationEllipsis />
            ) : (
              <PaginationLink
                onClick={(e) => {
                  e.preventDefault();
                  onPageChange(page as number);
                }}
                isActive={currentPage === page}
                className="cursor-pointer"
              >
                {page}
              </PaginationLink>
            )}
          </PaginationItem>
        ))}

        <PaginationItem>
          <PaginationNext
            onClick={(e) => {
              e.preventDefault();
              if (currentPage < totalPages) onPageChange(currentPage + 1);
            }}
            className={
              currentPage >= totalPages
                ? "pointer-events-none opacity-50"
                : "cursor-pointer"
            }
          />
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  );
}