import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
  PaginationEllipsis,
} from "@/components/ui/pagination";

export interface PaginationData {
  total: number;
  count: number;
  perPage: number;
  currentPage: number;
  totalPages: number;
}

interface CommonPaginationProps {
  pagination: PaginationData;
  onPageChange: (page: number) => void;
  className?: string;
}

export function CommonPagination({
  pagination,
  onPageChange,
  className,
}: CommonPaginationProps) {
  const { currentPage, totalPages } = pagination;
  if (totalPages <= 1) return null;

  const handlePageChange = (page: number, e: React.MouseEvent) => {
    e.preventDefault();
    if (page >= 1 && page <= totalPages && page !== currentPage) {
      onPageChange(page);
    }
  };

  const renderPageNumbers = () => {
    const pages = [];

    pages.push(
      <PaginationItem key={1}>
        <PaginationLink
          href="#"
          isActive={currentPage === 1}
          onClick={(e) => handlePageChange(1, e)}
        >
          1
        </PaginationLink>
      </PaginationItem>
    );

    if (currentPage > 3) {
      pages.push(
        <PaginationItem key="start-ellipsis">
          <PaginationEllipsis />
        </PaginationItem>
      );
    }

    for (
      let i = Math.max(2, currentPage - 1);
      i <= Math.min(totalPages - 1, currentPage + 1);
      i++
    ) {
      pages.push(
        <PaginationItem key={i}>
          <PaginationLink
            href="#"
            isActive={currentPage === i}
            onClick={(e) => handlePageChange(i, e)}
          >
            {i}
          </PaginationLink>
        </PaginationItem>
      );
    }

    if (currentPage < totalPages - 2) {
      pages.push(
        <PaginationItem key="end-ellipsis">
          <PaginationEllipsis />
        </PaginationItem>
      );
    }

    if (totalPages > 1) {
      pages.push(
        <PaginationItem key={totalPages}>
          <PaginationLink
            href="#"
            isActive={currentPage === totalPages}
            onClick={(e) => handlePageChange(totalPages, e)}
          >
            {totalPages}
          </PaginationLink>
        </PaginationItem>
      );
    }

    return pages;
  };

  return (
    <div className={className}>
      <Pagination>
        <PaginationContent>
          <PaginationPrevious
            href="#"
            disabled={currentPage <= 1}
            onClick={(e) => handlePageChange(currentPage - 1, e)}
          />

          {renderPageNumbers()}

          <PaginationNext
            href="#"
            disabled={currentPage >= totalPages}
            onClick={(e) => handlePageChange(currentPage + 1, e)}
          />
        </PaginationContent>
      </Pagination>
    </div>
  );
}
