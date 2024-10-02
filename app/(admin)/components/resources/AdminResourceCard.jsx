import Link from "next/link";

const AdminResourceCard = ({ resource }) => {
  return (
    <tr className="border border-neutral-300 dark:border-neutral-600 bg-secondary dark:bg-neutral-900 text-sm">
      {resource.profileImage && (
        <td className="p-4 w-80">
          <img
            src={resource.profileImage}
            // srcSet="/user/user.png"
            className="h-full w-full object-cover"
          />
        </td>
      )}
      {resource.title && <td className="p-4">{resource.title}</td>}
      {/* {resource.description && <h2>{resource.description}</h2>} */}
      {resource.rating && <td className="p-4">{resource.rating}</td>}
      {resource.ratingCount && <td className="p-4">{resource.ratingCount}</td>}
      {resource.likes && <td className="p-4">{resource.likes}</td>}
      {resource.dislikes && <td className="p-4">{resource.dislikes}</td>}
      {resource.semester && <td className="p-4">{resource.semester}</td>}
      {resource.degree && <td className="p-4">{resource.degree}</td>}
      {resource.type && <td className="p-4">{resource.type}</td>}
      {resource.tags && <td className="p-4">{resource.tags.join(",")}</td>}
      {resource.createdAt && (
        <td className="p-4">{new Date(resource.createdAt).toLocaleString()}</td>
      )}
      {resource.updatedAt && (
        <td className="p-4">{new Date(resource.updatedAt).toLocaleString()}</td>
      )}
      {resource.slug && (
        <td className="p-4">
          <Link
            href={`/resources/${resource.slug}`}
            className="hover:text-link"
          >
            Visit Live
          </Link>
        </td>
      )}
      {resource.pdfLink && (
        <td className="p-4">
          <a
            href={resource.pdfLink[0]}
            className="hover:text-link"
            target="_blank"
          >
            Visit PDF
          </a>
        </td>
      )}

      <td className="p-4">
        <Link
          href={`/admin/resources/${resource.slug}/edit`}
          className="hover:text-link"
        >
          Edit
        </Link>
      </td>
      <td className="p-4">
      <Link
          href={`/admin/resources/${resource.slug}/delete`}
          className="dark:hover:text-red-700 hover:text-red-900 text-red-700 dark:text-red-400"
        >
          Delete
        </Link>
      </td>
    </tr>
  );
};

export default AdminResourceCard;
