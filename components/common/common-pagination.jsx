'use client';

import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from 'lucide-react';

export function CommonPagination({ 
  currentPage, 
  totalPages, 
  totalItems, 
  itemsPerPage, 
  onPageChange, 
  loading = false,
  className = "",
  itemLabel = "items", // "notifications", "results", "items", etc.
  type = "items", // Support both itemLabel and type for compatibility
  layout = "responsive" // "responsive" or "vertical" for forced vertical layout
}) {
  const startItem = (currentPage - 1) * itemsPerPage + 1;
  const endItem = Math.min(currentPage * itemsPerPage, totalItems);

  // Use type if provided, otherwise use itemLabel
  const displayLabel = type !== "items" ? type : itemLabel;

  const getVisiblePages = () => {
    const delta = 1; // Reduced for mobile responsiveness
    const range = [];
    const rangeWithDots = [];

    // For mobile, show fewer pages
    const isMobile = typeof window !== 'undefined' && window.innerWidth < 640;
    const maxVisiblePages = isMobile ? 3 : 5;

    if (totalPages <= maxVisiblePages) {
      // Show all pages if total is small
      for (let i = 1; i <= totalPages; i++) {
        range.push(i);
      }
      return range;
    }

    // Calculate range around current page
    for (
      let i = Math.max(2, currentPage - delta);
      i <= Math.min(totalPages - 1, currentPage + delta);
      i++
    ) {
      range.push(i);
    }

    // Add first page and ellipsis if needed
    if (currentPage - delta > 2) {
      rangeWithDots.push(1, '...');
    } else {
      rangeWithDots.push(1);
    }

    // Add middle range
    rangeWithDots.push(...range);

    // Add last page and ellipsis if needed
    if (currentPage + delta < totalPages - 1) {
      rangeWithDots.push('...', totalPages);
    } else if (totalPages > 1) {
      rangeWithDots.push(totalPages);
    }

    // Remove duplicates
    return rangeWithDots.filter((item, index, arr) => {
      if (item === 1) return index === 0 || arr[index - 1] !== 1;
      if (item === totalPages) return index === arr.length - 1 || arr[index + 1] !== totalPages;
      return true;
    });
  };

  // Don't show pagination if only 1 page or no pages, unless there's data to show
  if (totalPages <= 1 && totalItems === 0) {
    return null;
  }

  const visiblePages = getVisiblePages();

  // Determine container layout class based on layout prop
  const containerLayoutClass = layout === "vertical" 
    ? "flex flex-col items-center gap-4 mt-6" 
    : "flex flex-col sm:flex-row items-center justify-between gap-4 mt-6";

  return (
    <div className={`${containerLayoutClass} ${className}`}>
      {/* Results info - show on all screens */}
      <div className="text-sm text-gray-600">
        {loading ? (
          <span>Loading...</span>
        ) : totalItems > 0 ? (
          <>
            Showing <span className="font-medium">{startItem}</span> to{' '}
            <span className="font-medium">{endItem}</span> of{' '}
            <span className="font-medium">{totalItems}</span> {displayLabel}
          </>
        ) : (
          <span></span>
        )}
      </div>

      {/* Mobile-only compact info - hidden for now since we show main info above */}
      <div className="text-xs text-gray-500 hidden">
        {totalPages > 1 ? `Page ${currentPage} of ${totalPages}` : `${totalItems} ${displayLabel}`}
      </div>

      {/* Pagination controls - only show if more than 1 page */}
      {totalPages > 1 && (
        <div className="flex items-center gap-1 sm:gap-2">
          {/* First page - hidden on mobile */}
          <Button
            variant="outline"
            size="sm"
            onClick={() => onPageChange(1)}
            disabled={currentPage === 1 || loading}
            className="hidden md:flex h-8 w-8 p-0"
            title="First page"
          >
            <ChevronsLeft className="h-3 w-3" />
          </Button>

          {/* Previous page */}
          <Button
            variant="outline"
            size="sm"
            onClick={() => onPageChange(currentPage - 1)}
            disabled={currentPage === 1 || loading}
            className="h-8 px-2 sm:px-3"
          >
            <ChevronLeft className="h-3 w-3" />
            <span className="hidden sm:inline ml-1">Previous</span>
          </Button>

          {/* Page numbers - responsive */}
          <div className="flex items-center gap-1">
            {visiblePages.map((page, index) => {
              if (page === '...') {
                return (
                  <span key={`dots-${index}`} className="px-1 sm:px-2 py-1 text-gray-400 text-sm">
                    ...
                  </span>
                );
              }

              return (
                <Button
                  key={page}
                  variant={currentPage === page ? "default" : "outline"}
                  size="sm"
                  onClick={() => onPageChange(page)}
                  disabled={loading}
                  className="h-8 min-w-8 px-2 text-sm"
                >
                  {page}
                </Button>
              );
            })}
          </div>

          {/* Next page */}
          <Button
            variant="outline"
            size="sm"
            onClick={() => onPageChange(currentPage + 1)}
            disabled={currentPage === totalPages || loading}
            className="h-8 px-2 sm:px-3"
          >
            <span className="hidden sm:inline mr-1">Next</span>
            <ChevronRight className="h-3 w-3" />
          </Button>

          {/* Last page - hidden on mobile */}
          <Button
            variant="outline"
            size="sm"
            onClick={() => onPageChange(totalPages)}
            disabled={currentPage === totalPages || loading}
            className="hidden md:flex h-8 w-8 p-0"
            title="Last page"
          >
            <ChevronsRight className="h-3 w-3" />
          </Button>
        </div>
      )}
    </div>
  );
}
