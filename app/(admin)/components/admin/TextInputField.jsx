import React from "react";

const TextInputField = React.memo(
  ({
    label,
    type,
    value,
    onChange,
    placeholder,
    className,
    disabled,
    required,
    noMargin,
    padding,
    icon: Icon,
    searchCenter,
  }) => (
    <div
      className={`${Icon ? "relative" : ""} m-0 p-0 ${
        !label ? "flex justify-center items-center flex-col" : ""
      }`}
    >
      {Icon && (
        <Icon
          className={`absolute left-4 top-1/3 ${
            searchCenter ? "" : "transform-translate-y-1/4"
          } text-neutral-400 dark:text-neutral-500`}
          size={18}
        />
      )}
      {label && <label className="mb-4 inline-flex">{label}</label>}
      <input
        type={type}
        value={value}
        onChange={onChange}
        disabled={disabled}
        required={required}
        placeholder={placeholder}
        className={`${label ? "inline" : ""} ${noMargin ? "mb-0" : "mb-4"} ${
          Icon ? "pl-12" : ""
        } w-full border border-neutral-300 rounded-lg ${
          padding ? padding : "p-4"
        } focus:outline-none focus:ring-2 focus:ring-accent-600 text-primary dark:text-secondary dark:bg-neutral-900 dark:border-neutral-800 ${className}`}
      />
    </div>
  )
);

export default TextInputField;
