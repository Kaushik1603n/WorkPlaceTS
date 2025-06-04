import { ChevronLeft, ChevronRight } from 'lucide-react';
import React from 'react';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  maxVisiblePages?: number;
}

const Pagination: React.FC<PaginationProps> = ({
  currentPage,
  totalPages,
  onPageChange,
  maxVisiblePages = 5,
}) => {
  const getPageNumbers = () => {
    const half = Math.floor(maxVisiblePages / 2);
    let start = Math.max(currentPage - half, 1);
    const end = Math.min(start + maxVisiblePages - 1, totalPages);

    if (end - start + 1 < maxVisiblePages) {
      start = Math.max(end - maxVisiblePages + 1, 1);
    }

    return Array.from({ length: end - start + 1 }, (_, i) => start + i);
  };

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      onPageChange(page);
    }
  };

  if (totalPages <= 1) return null;

  const pageNumbers = getPageNumbers();

  return (
    <div className="flex items-center justify-center gap-2 mt-6">
      <button
        onClick={() => handlePageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className={`p-2 rounded-md ${currentPage === 1 ? 'text-gray-400 cursor-not-allowed' : 'text-gray-700 hover:bg-gray-100'}`}
      >
        <ChevronLeft className="w-5 h-5" />
      </button>

      {!pageNumbers.includes(1) && (
        <>
          <button
            onClick={() => handlePageChange(1)}
            className={`w-10 h-10 rounded-md ${1 === currentPage ? 'bg-blue-500 text-white' : 'text-gray-700 hover:bg-gray-100'}`}
          >
            1
          </button>
          {!pageNumbers.includes(2) && <span className="px-2">...</span>}
        </>
      )}

      {pageNumbers.map((page) => (
        <button
          key={page}
          onClick={() => handlePageChange(page)}
          className={`w-10 h-10 rounded-md ${page === currentPage ? 'bg-blue-500 text-white' : 'text-gray-700 hover:bg-gray-100'}`}
        >
          {page}
        </button>
      ))}

      {!pageNumbers.includes(totalPages) && (
        <>
          {!pageNumbers.includes(totalPages - 1) && <span className="px-2">...</span>}
          <button
            onClick={() => handlePageChange(totalPages)}
            className={`w-10 h-10 rounded-md ${totalPages === currentPage ? 'bg-blue-500 text-white' : 'text-gray-700 hover:bg-gray-100'}`}
          >
            {totalPages}
          </button>
        </>
      )}

      <button
        onClick={() => handlePageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className={`p-2 rounded-md ${currentPage === totalPages ? 'text-gray-400 cursor-not-allowed' : 'text-gray-700 hover:bg-gray-100'}`}
      >
        <ChevronRight className="w-5 h-5" />
      </button>
    </div>
  );
};

export default  React.memo(Pagination);