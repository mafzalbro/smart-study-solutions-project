import Link from "next/link";
import ResourceCard from "./ResourceCard";

const Sidebar = ({ resource }) => {
  return (
    <div className="overflow-auto md:h-screen md:sticky md:top-0 mt-10 p-2 pt-4 flex flex-col gap-4">
      {/* Quick Links Section */}
      <div className="flex flex-col gap-2">
        <p className="font-bold">Quick Links</p>
        <div>
          <Link
            href="/resources/type/books"
            className="text-blue-600 dark:text-blue-300 hover:underline underline-offset-4"
          >
            Books
          </Link>
        </div>
        <div>
          <Link
            href="/resources/type/past-papers"
            className="text-blue-600 dark:text-blue-300 hover:underline underline-offset-4"
          >
            Past Papers
          </Link>
        </div>
        <div>
          <Link
            href="/resources/type/notes"
            className="text-blue-600 dark:text-blue-300 hover:underline underline-offset-4"
          >
            Notes
          </Link>
        </div>
      </div>

      {/* Ads Section */}
      <div className="mt-4 p-4 text-center border rounded-lg border-gray-300 dark:border-gray-800">
        <p className="font-semibold">Sponsored Ad</p>
        <p className="text-sm text-gray-400">ad here</p>
      </div>

      {/* Resource Cards Section */}
      {/* <div className="mt-4 flex flex-col gap-4">
        {[1].map((e, i) => (
          <ResourceCard
            key={i}
            resource={{
              title: "Dummy Resource",
              description: "Dummy description",
              slug: "/",
            }}
          />
        ))}
      </div> */}
    </div>
  );
};

export default Sidebar;
