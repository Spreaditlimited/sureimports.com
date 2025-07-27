import { Button } from '@/components/ui/button';
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
} from '@/components/ui/pagination';
import { ChevronRight, ChevronLeft } from 'lucide-react';

interface PaginationProps {
  handlePrev: () => void;
  handleNext: () => void;
  handleClick: (currentPage: number) => void;
  lastPage: number;
  currentPage: number;
}

const PaginationBar: React.FC<PaginationProps> = ({
  currentPage,
  lastPage,
  handlePrev,
  handleNext,
  handleClick,
}) => {
  return (
    <Pagination className="max-w-1/4 mt-5 flex flex-col items-center justify-between border py-5 pl-[25px] pr-[25px] lg:flex-row">
      Showing 1 to 3 of 3 entries{' '}
      <PaginationContent>
        <PaginationItem>
          {1 !== currentPage && (
            <Button
              variant="outline"
              onClick={handlePrev}
              className="cursor-pointer p-0 px-3 dark:bg-slate-800"
            >
              <ChevronLeft width={16} />
            </Button>
          )}
        </PaginationItem>
        <PaginationItem>
          {Array.from(
            { length: Math.min(2, lastPage - currentPage) },
            (_, index) => (
              <PaginationLink
                key={index}
                isActive={currentPage === currentPage + index}
                onClick={() => handleClick(currentPage + index)}
                className="mx-1 dark:bg-slate-800"
              >
                {currentPage + index}
              </PaginationLink>
            ),
          )}
        </PaginationItem>
        <PaginationItem>
          {currentPage !== lastPage && currentPage !== 0 && (
            <PaginationEllipsis />
          )}
        </PaginationItem>
        <PaginationItem>
          <PaginationLink
            isActive={lastPage === currentPage}
            onClick={() => handleClick(lastPage)}
            className="dark:bg-slate-800"
          >
            {lastPage}
          </PaginationLink>
        </PaginationItem>
        <PaginationItem>
          {currentPage !== lastPage && (
            <Button
              variant="outline"
              onClick={handleNext}
              className="cursor-pointer p-0 px-3 dark:bg-slate-800"
            >
              <ChevronRight width={16} />
            </Button>
          )}
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  );
};

export default PaginationBar;
