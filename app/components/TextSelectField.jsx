const SelectField = ({ value, nameOfField, onChange, options, label, className, required }) => (
    <div className="mb-4">
      <label className="block dark:text-secondary font-bold mb-2">{label}</label>
      <select
        value={value}
        onChange={onChange}
        className={`w-full p-4 border dark:text-secondary dark:bg-neutral-800 border-gray-300 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent-600 ${className}`}
        required={required}
      >
        <option value="">Select a {nameOfField}</option>
        {options.map(option => (
          <option key={option._id} value={option._id}>{option.name}</option>
        ))}
      </select>
    </div>
  );
  
  export default SelectField;
  