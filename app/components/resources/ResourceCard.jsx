import Link from 'next/link';
import LinkButton from '../LinkButton';

const ResourceCard = ({ resource }) => {
  return (
    <Link href={`/resources/${resource.slug}`}>

    {/* <div className="p-8 bg-secondary dark:bg-primary border border-neutral-200 dark:border-neutral-700 rounded-lg shadow-md"> */}
    <div className="p-8 hover:text-link border border-neutral-200 dark:border-neutral-700 rounded-lg bg-white dark:bg-neutral-900 h-full">
      { resource.title && <h2 className="text-3xl" >{resource.title}</h2> }
      {resource.description && <p className="mt-4 text-neutral-600 dark:text-neutral-300">{resource.description}</p>}
      </div>
    </Link>
  );
};

export default ResourceCard;



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
