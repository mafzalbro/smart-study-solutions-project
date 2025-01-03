// components/Spinner.js

const Spinner = ({noHeightWidth}) => (
  <div className="flex justify-center items-center min-h-24">
    <div className={`${noHeightWidth ? "h-2 w-2" : "w-8 h-8"} border-2 border-l-accent-600 dark:border-l-accent-400 border-t-accent-600 dark:border-t-accent-400 border-r-transparent border-b-transparent rounded-full animate-spin-fast`}></div>
  </div>
);

export default Spinner;
