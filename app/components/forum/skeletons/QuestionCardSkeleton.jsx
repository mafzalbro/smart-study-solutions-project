import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

export const QuestionCardSkeleton = () => {
  return (
    <div className="flex flex-col md:flex-row w-full gap-6 animate-pulse">
      {/* Sidebar Skeleton */}
      <div className="hidden md:block md:w-1/4 h-full sticky top-0">
        <Skeleton height={500} width="100%" />
      </div>

      {/* Main Content Skeleton */}
      <div className="flex w-full md:w-1/2 lg:w-1/3 xl:w-1/4 h-full space-y-6 md:ml-4">
        {[...Array(3)].map((_, idx) => (
          <div key={idx} className="flex flex-col gap-4 p-4 rounded-lg shadow-sm">
            {/* Title Skeleton */}
            <Skeleton height={24} width="80%" className="rounded-md" />

            {/* Metadata Skeleton */}
            <div className="flex items-center gap-2">
              <Skeleton circle height={20} width={20} />
              <Skeleton height={20} width="30%" />
              <Skeleton height={20} width="20%" />
            </div>

            {/* Description Skeleton */}
            <Skeleton count={3} height={16} width="100%" className="rounded-md" />

            {/* Button Skeleton */}
            <div className="flex gap-2 mt-2">
              <Skeleton height={36} width={90} className="rounded-lg" />
              <Skeleton height={36} width={90} className="rounded-lg" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
