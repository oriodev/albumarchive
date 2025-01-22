// COMPONENTS.
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

export function FullPagination({
  setCurrentPage,
  currentPage,
  total,
  resPerPage = 3,
}: {
  setCurrentPage: (currentPage: number) => void;
  currentPage: number;
  total: number;
  resPerPage: number;
}) {
  const totalPages = Math.ceil(total / resPerPage);

  const handleNextPage = () => {
    const totalPages = Math.ceil(total / resPerPage);
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const handlePreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  return (
    <Pagination>
      <PaginationContent>
        <PaginationItem>
          <PaginationPrevious
            onClick={handlePreviousPage}
            className={`hover:cursor-pointer ${currentPage === 1 ? "opacity-50 hover:cursor-default" : ""}`}
          />
        </PaginationItem>
        <PaginationItem>
          <p>
            {currentPage} of {totalPages}
          </p>{" "}
        </PaginationItem>
        <PaginationItem>
          <PaginationNext
            onClick={handleNextPage}
            className={`hover:cursor-pointer ${currentPage >= totalPages ? "opacity-50 hover:cursor-default" : ""}`}
          />
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  );
}
