import Link from "next/link";
import {
  BiSolidRightTopArrowCircle,
  BiLike,
  BiCalendar,
  BiArrowToRight,
} from "react-icons/bi";

const RelatedResourceCard = ({ resource, noImg }) => {
  return (
    <div className="border border-neutral-200 dark:border-neutral-700 rounded-lg bg-white dark:bg-neutral-800 shadow-md hover:shadow-lg transition-shadow duration-300 ease-in-out h-full md:flex md:justify-between">
      <div className="md:w-1/3">
        {/* Profile Image */}
        {resource.profileImage && !noImg && (
          <div>
            <img
              src={resource.profileImage}
              alt={resource.title}
              className="w-full h-full object-cover rounded-lg shadow-lg"
            />
          </div>
        )}
      </div>
      <div className="m-4 flex justify-between flex-col md:w-2/3">
        {/* Title */}
        <Link href={`/resources/${resource.slug}`}>
          <h2 className="text-2xl font-semibold text-neutral-800 dark:text-neutral-100 hover:text-link dark:hover:text-link transition-colors duration-300">
            {resource.title}
          </h2>
        </Link>

        {/* Resource Info (Likes, Semester, Degree, Type) */}
        <div className="mt-4 flex text-xs gap-2 flex-wrap capitalize">
          {!!resource.likes && (
            <div className="flex items-center gap-1 bg-neutral-200 dark:bg-neutral-700 text-neutral-600 dark:text-neutral-300 px-4 py-2 rounded-full shadow-sm">
              <BiLike size={18} />
              <span>{resource.likes} Likes</span>
            </div>
          )}

          {!!resource.semester && (
            <div className="flex items-center gap-1 bg-neutral-200 dark:bg-neutral-700 text-neutral-600 dark:text-neutral-300 px-4 py-2 rounded-full shadow-sm">
              <BiCalendar size={18} />
              <span>{resource.semester}</span>
            </div>
          )}

          {resource.degree && (
            <Link
              className="flex items-center gap-1 text-neutral-600 dark:text-neutral-300 bg-neutral-200 dark:bg-neutral-700 px-4 py-2 rounded-full shadow-sm hover:text-link dark:hover:text-link"
              href={`/resources/${resource.degree
                ?.split(" ")
                .join("-")}/${resource.semester?.split(" ").join("-")}`}
            >
              <span className="text-neutral-800 dark:text-neutral-100 border-r border-neutral-600 dark:border-neutral-300 pr-2 mr-2">
                Degree
              </span>
              {resource.degree?.toUpperCase()}
              <BiSolidRightTopArrowCircle size={20} />
            </Link>
          )}

          {resource.type && (
            <Link
              className="flex items-center gap-1 text-neutral-600 dark:text-neutral-300 bg-neutral-200 dark:bg-neutral-700 px-4 py-2 rounded-full shadow-sm hover:text-link dark:hover:text-link"
              href={`/resources/${resource.degree
                ?.split(" ")
                .join("-")}/${resource.semester
                ?.split(" ")
                .join("-")}/${resource.type?.split(" ").join("-")}`}
            >
              <span className="text-neutral-800 dark:text-neutral-100 border-r border-neutral-600 dark:border-neutral-300 pr-2 mr-2">
                Type
              </span>
              {resource.type}
              <BiSolidRightTopArrowCircle size={20} />
            </Link>
          )}
        </div>

        {/* "Read More" Button */}
        {/* <div className="mt-6 flex justify-end">
          <Link
            href={`/resources/${resource.slug}`}
            className="flex items-center text-link dark:text-link-dark hover:text-neutral-100 dark:hover:text-neutral-300 underline-offset-4 transition-all duration-300 ease-in-out text-lg font-medium"
          >
            <span className="mr-2">Read More</span>
            <BiArrowToRight
              size={20}
              className="transition-transform duration-300 transform group-hover:translate-x-2"
            />
          </Link>
        </div> */}
      </div>
    </div>
  );
};

export default RelatedResourceCard;
