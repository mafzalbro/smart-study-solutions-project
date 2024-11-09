"use client";

export default function Pagination({
  page,
  totalResults,
  count,
  onPageChange,
}) {
  const totalPages = Math.ceil(totalResults / count);

  const handleLoadMore = () => {
    if (page < totalPages) {
      onPageChange(page + 1);
    }
  };

  return (
    page < totalPages && (
      <div className="flex items-center justify-center my-6">
        <button
          onClick={handleLoadMore}
          disabled={page >= totalPages}
          className="inline-flex cursor-pointer items-center space-x-2 py-2 px-4  text-accent-900 bg-accent-100 hover:bg-accent-200 dark:bg-accent-300 dark:hover:bg-accent-400 rounded-lg disabled:opacity-50 disabled:hover:bg-accent-100 disabled:hover:dark:bg-accent-300 disabled:cursor-not-allowed"
        >
          {page < totalPages ? "Load More" : "No More Results"}
        </button>
      </div>
    )
  );
}
