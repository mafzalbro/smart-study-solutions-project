const TextAreaFieldChat = ({
  type,
  value,
  onChange,
  onKeyPress,
  placeholder,
  className,
  disabled,
  required,
  noMargin,
  padding,
  showToggle,
  ref,
}) => {
  return (
    <div
      className={`relative ${noMargin ? "mb-0" : "mb-4"} w-full ${className}`}
    >
      <textarea
        type={type}
        value={value}
        ref={ref ? ref : null}
        onChange={onChange}
        onKeyPress={onKeyPress}
        placeholder={placeholder}
        className={`w-full max-h-40 min-h-[52px] h-14 rounded-lg ${
          padding ? padding : "p-4"
        } focus:outline-none  text-primary dark:text-secondary dark:bg-neutral-800 dark:border-neutral-600 ${
          showToggle && "pr-10"
        }`}
        disabled={disabled}
        required={required}
        autoFocus
      >
        {/* {value} */}
      </textarea>
    </div>
  );
};

export default TextAreaFieldChat;
