import Link from "next/link";

const ResourceCard = ({ resource }) => (
  <div className="relative flex flex-col text-gray-700 bg-white shadow-md bg-clip-border rounded-xl">
    <div className="p-6">
      <h5 className="block mb-2 font-sans text-xl antialiased font-semibold leading-snug tracking-normal text-blue-gray-900">
        {resource.title}
      </h5>
      <p className="block font-sans text-base antialiased font-light leading-relaxed text-inherit">
        {resource.description}
      </p>
    </div>
    <div className="p-6 pt-0">
    <Link href={`/resources/${resource.slug}`}>
      <button
        className="align-middle select-none font-sans font-bold text-center uppercase transition-all disabled:opacity-50 disabled:shadow-none disabled:pointer-events-none text-xs py-3 px-6 rounded-lg bg-orange-600 text-white shadow-md shadow-gray-900/10 hover:shadow-lg hover:shadow-gray-900/20 focus:opacity-[0.85] focus:shadow-none active:opacity-[0.85] active:shadow-none"
        type="button"
        >
        Read More
      </button>
        </Link>
    </div>
  </div>
);

export default ResourceCard;
