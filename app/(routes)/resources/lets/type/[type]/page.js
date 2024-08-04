export default function ResourcePage({ params }) {
  const { type } = params;

  return <div className="flex text-center items-center justify-center min-h-[50vh]">{type}</div>;
}
