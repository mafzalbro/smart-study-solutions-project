const StylishTitle = ({colored, simple, addBr, className}) => {
  return (
    <h1 className={`text-5xl my-10 leading-tight ${className}`}>
  <span className="bg-gradient-to-r from-accent-900 via-accent-500 to-accent-600 dark:from-accent-300 dark:via-accent-300 dark:to-accent-400 bg-clip-text text-transparent">
    {colored}
  </span> {addBr && <br />} {simple}
</h1>

  );
};

export default StylishTitle;
