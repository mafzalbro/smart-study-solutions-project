// components/TextAreaField.js

const TextAreaField = ({ value, onChange, placeholder, label, className, rows, required }) => (
  <div className="mb-4">
    <label className="block dark:text-secondary font-bold mb-2">{label}</label>
    <textarea
      value={value}
      onChange={onChange}
      style={{resize: 'none'}}
      className={`w-full px-3 py-2 border dark:text-secondary dark:bg-neutral-800 border-gray-300 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent-600 ${className}`}
      placeholder={placeholder}
      rows={rows}
      required={required}
    ></textarea>
  </div>
);

export default TextAreaField;
