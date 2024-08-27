import Skeleton from "react-loading-skeleton"

const QuestionPageSkeleton = () => {
  return (
    // <div className="m-4 md:m-8">
      <div className="my-4">
      {/* Skeleton for the question title */}
      <Skeleton height={40} width={300} className="mb-8" />
      
      {/* Skeleton for the user profile image and name */}
      <div className="flex items-center mb-4">
        <Skeleton circle height={40} width={40} className="mr-4" />
        <div>
          <Skeleton height={20} width={100} className="mb-1" />
          <Skeleton height={15} width={150} />
        </div>
      </div>

      {/* Skeleton for the upvote, downvote, and report buttons */}
      <div className="p-5 my-10 rounded-lg dark:bg-neutral-800 dark:text-neutral-100">
        <div className="flex space-x-4">
          <Skeleton height={20} width={50} />
          <Skeleton height={20} width={50} />
          <Skeleton height={20} width={80} />
        </div>
      </div>

      {/* Skeleton for each answer block */}
      <div>
        {Array.from({ length: 3 }).map((_, index) => (
          <div key={index} className="mb-4 p-8 rounded-lg dark:bg-neutral-800 dark:text-neutral-100">
            <Skeleton height={30} width={150} className="mb-2" />
            <Skeleton height={15} width="80%" className="mb-2" />
            <Skeleton height={15} width="70%" />
            <Skeleton height={15} width="60%" className="my-2" />
            <Skeleton height={15} width="90%" />
          </div>
        ))}
      </div>
    </div>
  )
}

export default QuestionPageSkeleton