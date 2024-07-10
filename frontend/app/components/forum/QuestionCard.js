import Link from 'next/link';

const QuestionCard = ({ question }) => (
  <div className="relative flex flex-col text-gray-700 bg-white shadow-md bg-clip-border rounded-xl">
    <div className="p-6">
      <h5 className="block mb-2 font-sans text-xl antialiased font-semibold leading-snug tracking-normal text-blue-gray-900">
        {question.title}
      </h5>
      <p className="block font-sans text-base antialiased font-light leading-relaxed text-inherit">
        {question.description}
      </p>
    </div>
    <div className="p-6 pt-0">
      <Link href={`/forum/${question.slug}`}>
        <a className="inline-block py-2 px-4 text-xs font-medium uppercase bg-gradient-to-tr from-pink-600 to-pink-400 hover:shadow-lg hover:shadow-pink-500/40 text-white rounded-lg shadow-md shadow-pink-500/20">
          Read More
        </a>
      </Link>
    </div>
  </div>
);

export default QuestionCard;
