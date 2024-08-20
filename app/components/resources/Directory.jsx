import React from 'react';
import { FaFileAlt, FaBook, FaStickyNote } from "react-icons/fa";

const icons = {
  'past papers': <FaFileAlt />,
  'books': <FaBook />,
  'notes': <FaStickyNote />
};

const Directory = ({ directory }) => {
  return (
    <div className="ml-4">
      <span className="block py-2">{directory.name}</span>
      {directory.subDirs && (
        <ul className="ml-4">
          {directory.subDirs.map((subDir, index) => (
            <li key={index} className="flex items-center gap-2 py-2">
              {icons[subDir.name.toLowerCase()]} {subDir.name}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default Directory;
