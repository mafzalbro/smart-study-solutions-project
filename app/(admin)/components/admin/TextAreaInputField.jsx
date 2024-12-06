const TextAreaInputField = ({ name, value, onChange, placeholder }) => {
    return (
      <textarea
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className="w-full p-2 border dark:border-neutral-800 rounded-lg focus:ring-2 focus:ring-accent-600 outline-none bg-white dark:bg-neutral-900 text-neutral-800 dark:text-neutral-200"
      />
    );
  };
  export default TextAreaInputField;
  