import React from 'react';

const ClickButton = ({ onClick, text, icon }) => {
  return (
    <span
      onClick={onClick}
      className="inline-flex cursor-pointer items-center space-x-2 py-2 px-4 bg-orange-600 text-white rounded-lg shadow-md hover:bg-orange-700 dark:bg-orange-600 dark:hover:bg-orange-700"
    >
      {icon && <span className="text-lg">{icon}</span>}
      <span>{text}</span>
    </span>
  );
};

export default ClickButton;
