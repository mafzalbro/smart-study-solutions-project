import Link from "next/link";

const AdminQuestionCard = ({ question }) => {
  return (
    <tr className="border-b border-neutral-300 dark:border-neutral-600 bg-white dark:bg-neutral-900 text-neutral-700 dark:text-neutral-300">
      <td className="p-4">{question.question || "N/A"}</td>
      <td className="p-4">{question.category?.name || "N/A"}</td>
      <td className="p-4">{question.askedBy?.username || "N/A"}</td>
      <td className="p-4">
        {question.createdAt
          ? new Date(question.createdAt).toLocaleString()
          : "N/A"}
      </td>
      <td className="p-4 text-blue-600 dark:text-blue-400">
        <Link href={`/admin/forum/${question.slug}`}>Preview</Link>
      </td>
      <td className="p-4 text-yellow-600 dark:text-yellow-400">
        <Link href={`/admin/forum/${question.slug}/edit`}>Edit</Link>
      </td>
      <td className="p-4 text-red-600 dark:text-red-400">
        <Link href={`/admin/forum/${question.slug}/delete`}>Delete</Link>
      </td>
    </tr>
  );
};

export default AdminQuestionCard;
