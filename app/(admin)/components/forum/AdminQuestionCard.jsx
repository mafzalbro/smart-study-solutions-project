import Link from "next/link";

const AdminQuestionCard = ({ question }) => {
    return (
      <tr className="border border-neutral-300 dark:border-neutral-600 bg-secondary dark:bg-neutral-900 text-sm">
        <td className="p-4">{question.question ? question.question : 'N/A'}</td>
        <td className="p-4">{question.category?.name ? question.category?.name : 'N/A'}</td>
        <td className="p-4">{question.askedBy?.username ? question.askedBy?.username: 'N/A'}</td>
        {question.createdAt && (
          <td className="p-4">{new Date(question.createdAt).toLocaleString()}</td>
        )}
        <td className="p-4">
          <Link href={`/admin/forum/${question.slug}`} className="hover:text-link">
            Preview
          </Link>
        </td>
        <td className="p-4">
          <Link
            href={`/admin/forum/${question.slug}/edit`}
            className="hover:text-link"
          >
            Edit
          </Link>
        </td>
        <td className="p-4">
          <Link
            href={`/admin/forum/${question.slug}/delete`}
            className="dark:hover:text-red-700 hover:text-red-900 text-red-700 dark:text-red-400"
          >
            Delete
          </Link>
        </td>
      </tr>
    );
  };
  

  export default AdminQuestionCard