// components/TextInputField.js

const TextInputField = ({ type, value, onChange, onKeyPress, placeholder, className, disabled, required, noMargin, padding }) => (
  <input
    type={type}
    value={value}
    onChange={onChange}
    onKeyPress={onKeyPress}
    placeholder={placeholder}
    className={`${noMargin ? 'mb-0' : 'mb-4'} w-full border border-neutral-300 rounded-lg ${padding ? padding : 'p-4'} focus:outline-none focus:ring-2 focus:ring-accent-600 text-primary dark:text-secondary dark:bg-neutral-800 dark:border-neutral-600 ${className}`}
    disabled={disabled}
    required={required}
  />
);

export default TextInputField;
