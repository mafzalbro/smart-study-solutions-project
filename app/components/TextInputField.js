// components/TextInputField.js

const TextInputField = ({ type, value, onChange, placeholder, className, disabled, required }) => (
  <input
    type={type}
    value={value}
    onChange={onChange}
    placeholder={placeholder}
    className={`p-3 w-full border border-neutral-300 rounded-lg mb-4 focus:outline-none focus:ring-2 focus:ring-accent-600 text-primary dark:text-secondary dark:bg-neutral-800 dark:border-neutral-600 ${className}`}
    disabled={disabled}
    required={required}
  />
);

export default TextInputField;
