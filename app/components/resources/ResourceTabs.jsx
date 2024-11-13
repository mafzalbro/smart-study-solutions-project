import { usePathname } from "next/navigation";
import Link from "next/link";
import { BiBook, BiNote, BiFile } from "react-icons/bi";

const ResourceTabs = () => {
  const pathname = usePathname();

  // Check if the path includes /resources or /resources/type
  const isInResourcesPath =
    pathname === "/resources" || pathname.includes("/resources/type");

  // Check if the current path matches the specific resource type
  const isNotesActive = pathname === "/resources/type/notes";
  const isPastPapersActive = pathname === "/resources/type/past-papers";
  const isBooksActive = pathname === "/resources/type/books";

  if (!isInResourcesPath) return null; // Return null if the path is not for resources

  return (
    <div className="w-full md:my-10">
      <div className="flex justify-center gap-4 mt-4">
        {/* Notes Tab */}
        <div
          className={`py-2 px-4 md:py-2 md:px-6 text-xs rounded-lg md:text-lg font-medium cursor-pointer transition duration-300 ease-in-out flex items-center gap-2 ${
            isNotesActive
              ? "bg-blue-500 text-white"
              : "bg-gray-200 dark:bg-neutral-800 text-gray-800 dark:text-white hover:bg-blue-300 dark:hover:bg-blue-700"
          }`}
        >
          <Link
            href="/resources/type/notes"
            className="flex items-center gap-2"
          >
            <BiNote size={20} />
            <span>Notes</span>
          </Link>
        </div>

        {/* Past Papers Tab */}
        <div
          className={`py-2 px-4 md:py-2 md:px-6 text-xs rounded-lg md:text-lg font-medium cursor-pointer transition duration-300 ease-in-out flex items-center gap-2 ${
            isPastPapersActive
              ? "bg-blue-500 text-white"
              : "bg-gray-200 dark:bg-neutral-800 text-gray-800 dark:text-white hover:bg-blue-300 dark:hover:bg-blue-700"
          }`}
        >
          <Link
            href="/resources/type/past-papers"
            className="flex items-center gap-2"
          >
            <BiFile size={20} />
            <span>Past Papers</span>
          </Link>
        </div>

        {/* Books Tab */}
        <div
          className={`py-2 px-4 md:py-2 md:px-6 text-xs rounded-lg md:text-lg  font-medium cursor-pointer transition duration-300 ease-in-out flex items-center gap-2 ${
            isBooksActive
              ? "bg-blue-500 text-white"
              : "bg-gray-200 dark:bg-neutral-800 text-gray-800 dark:text-white hover:bg-blue-300 dark:hover:bg-blue-700"
          }`}
        >
          <Link
            href="/resources/type/books"
            className="flex items-center gap-2"
          >
            <BiBook size={20} />
            <span>Books</span>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ResourceTabs;
