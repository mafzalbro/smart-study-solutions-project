import Link from 'next/link';

const ResourceCard = ({ resource }) => {
  return (
    <div className="p-8 bg-white rounded-lg shadow-md">
      <h2 className="text-3xl font-semibold text-gray-800 my-6">{resource.title}</h2>
      <p className="mt-2 text-gray-600 font-medium">{resource.description}</p>
      <div className="flex mt-10">
        <Link href={`/resources/${resource.slug}`}>
          <button
            className="bg-orange-500 hover:bg-orange-600 text-white py-2 px-4 rounded-lg shadow-sm transition-colors duration-300"
            type="button"
          >
            Read More
          </button>
        </Link>
      </div>
    </div>
  );
};

export default ResourceCard;
