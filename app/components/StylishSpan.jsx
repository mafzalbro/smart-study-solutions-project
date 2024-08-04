const StylishSpan = ({children}) => {
    return (
        <span className="bg-gradient-to-r from-accent-900 via-accent-500 to-accent-600 dark:from-accent-300 dark:via-accent-300 dark:to-accent-400 bg-clip-text text-transparent">
          {children}
          </span>
        )
};

export default StylishSpan;
