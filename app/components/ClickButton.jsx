const ClickButton = ({ onClick, text, icon, className, disabled}) => {
  return (
    <span
      onClick={onClick}
      className={`inline-flex cursor-pointer items-center space-x-2 py-2 px-4  text-accent-900 bg-accent-100 hover:bg-accent-200 dark:bg-accent-300 dark:hover:bg-accent-400 rounded-lg ${className}`}
    >
      {icon && <span className="text-lg">{icon}</span>}
      <span>{text}</span>
    </span>
  );
};

export default ClickButton;

// const ClickButton = ({ onClick, text, icon, className }) => {
//   return (
//     <span
//       onClick={onClick}
//       className={`inline-flex cursor-pointer items-center space-x-2 py-2 px-4 bg-accent-600 text-accent-50 rounded-lg shadow-md hover:bg-accent-700 dark:bg-accent-600 dark:hover:bg-accent-700 ${className}`}
//     >
//       {icon && <span className="text-lg">{icon}</span>}
//       <span>{text}</span>
//     </span>
//   );
// };

// export default ClickButton;
