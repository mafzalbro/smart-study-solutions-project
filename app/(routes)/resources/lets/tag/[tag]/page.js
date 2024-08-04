export default function ResourcePage({ params }) {
  const { tag } = params;

  return <div className="flex text-center items-center justify-center min-h-[50vh]">{tag}</div>;
}
