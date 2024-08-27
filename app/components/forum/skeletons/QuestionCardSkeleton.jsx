import Skeleton from "react-loading-skeleton"

export const QuestionCardSkeleton = () => {
  return <div className="flex flex-col md:flex-row w-full">
  {/* Sidebar Skeleton */}
  <div className="hidden md:block md:w-1/4 h-full sticky top-0">
    <Skeleton height={500} width="100%" />
  </div>
  
  {/* Main Content Skeleton */}
  <div className="flex flex-col md:w-3/4 w-full h-full space-y-4 md:ml-4">
    {[...Array(5)].map((_, idx) => (
      <Skeleton key={idx} height={120} width="100%" />
    ))}
  </div>
</div>
}
