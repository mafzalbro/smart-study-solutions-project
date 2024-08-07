const WhiteContainer = ({children, className}) => {
  return (
    <div className="min-h-screen flex items-center justify-center px-4 sm:px-6 lg:px-8">
      <div className={`w-full max-w-lg p-6 bg-secondary dark:bg-neutral-800 rounded-lg shadow-lg ${className}`}>          {children}
      </div>
    </div>
  );
};

export default WhiteContainer;
