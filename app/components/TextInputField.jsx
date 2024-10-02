// components/TextInputField.js

const TextInputField = ({ type, value, onChange, label, onKeyPress, placeholder, className, disabled, required, noMargin, padding, icon: Icon, autoFocus }) => (
  <>
      {label && <label className="dark:text-secondary font-bold mb-2 block">{label}</label>}
  <div className={`${Icon ? 'relative' : ''} m-0 p-0`} autoFocus>
    {Icon && <Icon className={`absolute left-4 ${label ? 'top-1/2': 'top-1/3'} transform -translate-y-1/4 text-gray-400 dark:text-gray-500`} size={18} /> }
  <input
    type={type}
    value={value}
    autoFocus={autoFocus}
    onChange={onChange}
    tabIndex={0}
    onKeyPress={onKeyPress}
    placeholder={placeholder}
    className={`${noMargin ? 'mb-0' : 'mb-4'} ${Icon ? 'pl-12' : ''} w-full border border-neutral-300 rounded-lg ${padding ? padding : 'p-4'} focus:outline-none focus:ring-2 focus:ring-accent-600 text-primary dark:text-secondary dark:bg-neutral-800 dark:border-neutral-600 ${className}`}
    disabled={disabled}
    required={required}
    />
    </div>
  </>
);

export default TextInputField;
