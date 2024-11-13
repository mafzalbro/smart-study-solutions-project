import Link from "next/link";

const AdminResourceCard = ({ resource }) => {
  return (
    <tr className="border border-neutral-300 dark:border-neutral-600 bg-secondary dark:bg-neutral-900 text-sm">
      <td className="p-4 w-80">
        {resource.profileImage ? (
          <img
            src={resource.profileImage}
            // srcSet="/user/user.png"
            className="h-full w-full object-cover rounded-md"
          />
        ) : (
          "N/A"
        )}
      </td>
      <td className="p-4">{resource.title ? resource.title : "N/A"}</td>
      {/* {resource.description && <h2>{resource.description}</h2>} */}
      <td className="p-4">{resource.status ? "Published" : "Not Published"}</td>
      <td className="p-4">{resource.degree ? resource.degree : "N/A"}</td>
      <td className="p-4">{resource.type ? resource.type : "N/A"}</td>
      <td className="p-4">{resource.semester ? resource.semester : "N/A"}</td>
      <td className="p-4">{resource.tags ? resource.tags.join(",") : "N/A"}</td>
      <td className="p-4">{resource.slug ? resource.slug : "N/A"}</td>
      <td className="p-4">{resource.rating ? resource.rating : "N/A"}</td>
      <td className="p-4">
        {resource.ratingCount ? resource.ratingCount : "N/A"}
      </td>
      <td className="p-4">{resource.likes ? resource.likes : "N/A"}</td>
      <td className="p-4">{resource.dislikes ? resource.dislikes : "N/A"}</td>
      <td className="p-4">{new Date(resource.createdAt).toLocaleString()}</td>
      <td className="p-4">{new Date(resource.updatedAt).toLocaleString()}</td>
      <td className="p-4">
        {resource.pdfLink ? (
          <a
            href={resource.pdfLink[0]}
            className="hover:text-link"
            target="_blank"
          >
            Visit PDF
          </a>
        ) : (
          "N/A"
        )}
      </td>
      <td className="p-4">
        <Link href={`/resources/${resource.slug}`} className="hover:text-link">
          Visit Live
        </Link>
      </td>
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
