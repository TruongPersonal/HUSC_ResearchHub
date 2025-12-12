import { Button } from "@/components/ui/button";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export function Pagination({
  currentPage,
  totalPages,
  onPageChange,
}: PaginationProps) {
  return (
    <div className="flex items-center justify-end space-x-2 py-4">
      <Button
        variant="outline"
        size="sm"
        onClick={() => onPageChange(Math.max(0, currentPage - 1))}
        disabled={currentPage === 0}
      >
        Trước
      </Button>
      <div className="text-sm font-medium">
        Trang {currentPage + 1} / {totalPages || 1}
      </div>
      <Button
        variant="outline"
        size="sm"
        onClick={() =>
          onPageChange(Math.min((totalPages || 1) - 1, currentPage + 1))
        }
        disabled={currentPage >= (totalPages || 1) - 1}
      >
        Sau
      </Button>
    </div>
  );
}
