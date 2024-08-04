const ClickButton = ({ onClick, text, icon }) => {
  return (
    <span
      onClick={onClick}
      className="inline-flex cursor-pointer items-center space-x-2 py-2 px-4 bg-accent-600 text-accent-50 rounded-lg shadow-md hover:bg-accent-700 dark:bg-accent-600 dark:hover:bg-accent-700"
    >
      {icon && <span className="text-lg">{icon}</span>}
      <span>{text}</span>
    </span>
  );
};

export default ClickButton;
