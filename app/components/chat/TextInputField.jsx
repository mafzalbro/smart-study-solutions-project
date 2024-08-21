// components/TextInputField.js

// const TextInputField = ({ ref, type, value, onChange, onKeyPress, placeholder, className, disabled, required, noMargin, padding, showToggle, showIcon, hideIcon, onToggleShow }) => {
const TextInputField = ({ type, value, onChange, onKeyPress, placeholder, className, disabled, required, noMargin, padding, showToggle, showIcon, hideIcon, onToggleShow }) => {

  return (
    <div className={`relative ${noMargin ? 'mb-0' : 'mb-4'} w-full ${className}`}>
      <input type={type}
        value={value}
        // ref={ref}
        onChange={onChange}
        onKeyPress={onKeyPress}
        placeholder={placeholder}
className={`w-full border border-neutral-300 rounded-lg ${padding ? padding : 'p-4'} focus:outline-none focus:ring-2 focus:ring-accent-600 text-primary dark:text-secondary dark:bg-neutral-800 dark:border-neutral-600 ${showToggle && 'pr-10'}`}
        disabled={disabled}
        required={required}
        autoFocus
      />
      {showToggle && (
        <button
          type="button"
          onClick={onToggleShow}
          className="absolute right-4 top-1/2 transform -translate-y-1/2 text-link hover:text-link-hover text-xl"
        >
          {type === 'text' ? hideIcon : showIcon}
        </button>
      )}
    </div>
  );
};

export default TextInputField;
        




        // const TextInputField = ({ type, value, onChange, onKeyPress, placeholder, className, disabled, required, noMargin, padding }) => (
        //   <input
        //     type={type}
        //     value={value}
        //     onChange={onChange}
        //     onKeyPress={onKeyPress}
        //     placeholder={placeholder}
        //     className={`${noMargin ? 'mb-0' : 'mb-4'} w-full border border-neutral-300 rounded-lg ${padding ? padding : 'p-4'} focus:outline-none focus:ring-2 focus:ring-accent-600 text-primary dark:text-secondary dark:bg-neutral-800 dark:border-neutral-600 ${className}`}
        //     disabled={disabled}
        //     required={required}
        //   />
        // );
        
        // export default TextInputField;
        
        
        // components/TextInputField.js
