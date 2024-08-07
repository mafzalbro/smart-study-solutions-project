import React from 'react';

const TextInputField = ({ type, value, onChange, onKeyPress, placeholder, className, disabled, required, noMargin, padding, showToggle, showIcon, hideIcon, onToggleShow }) => (
  <div className="relative w-full">
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
    {showToggle && onToggleShow && (
      <button
        onClick={onToggleShow}
        className="absolute right-2 top-1/2 transform -translate-y-5 text-link hover:text-link-hover"
        style={{ fontSize: '1.5rem' }}
      >
        {type === 'password' ? showIcon : hideIcon}
      </button>
    )}
  </div>
);

export default TextInputField;
