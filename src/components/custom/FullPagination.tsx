import clsx from "clsx";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { FC, useEffect, useState } from "react";
import { Button } from "../ui/button";

interface FullPaginationProps {
  pagination: any;
  canEdit?: boolean;
  onPrevious: () => void;
  onNext: () => void;
  onGoto: (pageNumber: number) => void;
  onPerPage?: (value: number) => void;
}

const FullPagination: FC<FullPaginationProps> = ({
  pagination,
  canEdit = false,
  onPrevious,
  onNext,
  onGoto,
  onPerPage = (value: number) => {},
}) => {
  const previous = () => {
    window.scroll({ top: 0, behavior: "smooth" });
    onPrevious();
  };

  const next = () => {
    window.scroll({ top: 0, behavior: "smooth" });
    onNext();
  };

  const goTo = (pageNumber: number) => {
    window.scroll({ top: 0, behavior: "smooth" });
    onGoto(pageNumber);
  };

  const [perPage, setPerPage] = useState<number>(pagination.perPage);

  useEffect(() => {
    console.log(pagination.perPage);
    console.log(perPage);
  }, []);

  return (
    <div className="flex items-center  justify-between">
      {canEdit && (
        <div className="flex items-center space-x-3">
          <span className="text-muted-foreground">Showing</span>
          <select
            className="px-4 py-2 bg-gray-100 rounded-lg"
            value={perPage}
            onChange={(e: any) => {
              setPerPage(e.target.value);
            }}
          >
            <option value={10}>10</option>
            <option value={15}>15</option>
            <option value={20}>20</option>
            <option value={50}>50</option>
            <option value={100}>100</option>
            <option value={pagination.total}>All</option>
          </select>
          {pagination.perPage != perPage && (
            <Button onClick={() => onPerPage(perPage)}> Show </Button>
          )}
          <span className="text-muted-foreground"> of {pagination.total}</span>
        </div>
      )}

      <ul className="flex items-center  h-10 text-base space-x-2">
        {pagination.currentPage != 1 ? (
          <li>
            <Button onClick={previous} className="">
              <ChevronLeft />
            </Button>
          </li>
        ) : null}

        {Array.from({
          length: pagination.lastPage,
        })
          .map((_, index) => index + 1)
          .map((pageNumber) => (
            <li key={`pageNumber${pageNumber}`}>
              <Button
                onClick={() => goTo(pageNumber)}
                className={clsx(" ", {
                  "text-muted-foreground bg-white":
                    pagination.currentPage != pageNumber,
                })}
              >
                {pageNumber}
              </Button>
            </li>
          ))}

        {pagination.currentPage != pagination.lastPage ? (
          <li>
            <Button onClick={next} className="bg-white">
              <ChevronRight />
            </Button>
          </li>
        ) : null}
      </ul>
    </div>
  );
};

export default FullPagination;
