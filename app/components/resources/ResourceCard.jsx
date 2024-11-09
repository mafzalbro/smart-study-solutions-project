import Link from "next/link";
import LinkButton from "../LinkButton";
import { BiSolidRightTopArrowCircle } from "react-icons/bi";

const ResourceCard = ({ resource, noImg }) => {
  return (
    <div className="p-2 md:p-3 lg:p-6 border border-neutral-200 dark:border-neutral-700 rounded-lg bg-white dark:bg-neutral-900 h-full">
      {/* {console.log({resource})} */}
      {/* <div className="p-8 bg-secondary dark:bg-primary border border-neutral-200 dark:border-neutral-700 rounded-lg shadow-md"> */}
      {resource.profileImage && (
        <img
          src={resource.profileImage}
          // srcSet="/user/user.png"
          alt={resource.title}
          className="w-full h-60 object-cover rounded-2xl mb-4 min-h-60"
          // mix-blend-multiply 
        />
      )}
      <Link href={`/resources/${resource.slug}`}>
        {resource.title && (
          <h2 className="text-3xl hover:text-link">{resource.title}</h2>
        )}
      </Link>
      {(resource.likes || resource.semester) && (
        <div className="mt-4 flex text-sm gap-2 flex-wrap capitalize">
          {resource.likes && (
            <p className="text-neutral-600 dark:text-neutral-300 bg-neutral-200 dark:bg-neutral-800 px-4 py-2 rounded-full">
              {resource.likes} Likes
            </p>
          )}
          {resource.semester && (
            <p className="text-neutral-600 dark:text-neutral-300 bg-neutral-200 dark:bg-neutral-800 px-4 py-2 rounded-full">
              {resource.semester}
            </p>
          )}
          {resource.degree && (
            <Link
              className="text-neutral-600 dark:text-neutral-300 bg-neutral-200 dark:bg-neutral-800 px-4 py-2 rounded-full hover:text-link dark:hover:text-link cursor-pointer flex justify-center items-center"
              href={`/resources/${resource.degree
                ?.split(" ")
                .join("-")}/${resource.semester?.split(" ").join("-")}`}
            >
              <span className="text-neutral-800 dark:text-neutral-100 border-r border-neutral-600 dark:border-neutral-300 pr-2 mr-2">
                Degree
              </span>
              {resource?.degree?.toUpperCase()}
              <BiSolidRightTopArrowCircle size={20} className="ml-2" />
            </Link>
          )}
          {resource.type && (
            <Link
              className="text-neutral-600 dark:text-neutral-300 bg-neutral-200 dark:bg-neutral-800 px-4 py-2 rounded-full hover:text-link dark:hover:text-link cursor-pointer flex justify-center items-center"
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
              <BiSolidRightTopArrowCircle size={20} className="ml-2" />
            </Link>
          )}
        </div>
      )}
      {/* {resource.description && <p className="mt-4 text-neutral-600 dark:text-neutral-300">{resource.description}</p>} */}
    </div>
  );
};

export default ResourceCard;

// {
//   "_id": "66f94dd213fca8b50ea52157",
//   "title": "ancilla crebro eaque excepturi perferendis",
//   "semester": "semester 3",
//   "degree": "bsce",
//   "type": "books",
//   "slug": "audacia-arbor-occaecati",
//   "description": "Quisquam pecto totus uxor. Spiculum vinco statua pecco terra. Caries dedico tamisium tantillus.",
//   "profileImage": "https://avatars.githubusercontent.com/u/76138719",
//   "likes": 77,
//   "createdAt": "2024-09-29T12:53:40.198Z"
// }

// import Link from 'next/link';
// import LinkButton from '../LinkButton';

// const ResourceCard = ({ resource }) => {
//   return (
//     <div className="p-8 bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-lg shadow-md">
//       { resource.title && <h2 className="text-3xl font-semibold text-neutral-800 dark:text-neutral-300 my-6">{resource.title}</h2> }
//       {resource.description && <p className="mt-2 text-neutral-600 dark:text-neutral-300 font-medium">{resource.description}</p>}
//       { resource.slug && <div className="flex mt-10">
//         <LinkButton link={`/resources/${resource.slug}`} text='Read More' />
//       </div> }
//     </div>
//   );
// };

// export default ResourceCard;
