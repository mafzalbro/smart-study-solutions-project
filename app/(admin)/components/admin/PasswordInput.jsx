// PasswordInput.jsx

import React, { useState } from 'react';
import { AiFillEye, AiFillEyeInvisible } from 'react-icons/ai';
import TextInputField from '@/app/components/TextInputField';
import { IoMdLock } from 'react-icons/io';

const PasswordInput = ({ value, onChange, placeholder, label, required = false }) => {
  const [passwordVisible, setPasswordVisible] = useState(false);

  return (
    <div className="relative">
    <IoMdLock className="absolute left-4 top-1/3 transform -translate-y-1/4 text-gray-400 dark:text-gray-500 border-none outline-none " size={20} />
      <TextInputField
        type={passwordVisible ? 'text' : 'password'}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        label={label}
        className="px-12"
        required={required}
      />
      <button
        type="button"
        onClick={() => setPasswordVisible(!passwordVisible)}
        className="absolute right-4 top-1/3 transform -translate-y-1/4 text-gray-400 dark:text-gray-500"
      >
        {passwordVisible ? <AiFillEyeInvisible size={20} /> : <AiFillEye size={20} />}
      </button>
    </div>
  );
};

export default PasswordInput;
