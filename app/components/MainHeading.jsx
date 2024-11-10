import React from 'react';
import { AiOutlineBulb } from 'react-icons/ai'; // New AI-related icon

const MainHeading = ({ name, icon: Icon = AiOutlineBulb }) => {
  return (
    <div className="my-16 mt-32 flex flex-col items-center px-4 sm:px-8">
      {/* Icon and Title Wrapper */}
      <div className="flex items-center mb-6">
        {Icon && (
          <Icon
            className="mr-3 text-primary dark:text-secondary text-4xl sm:text-5xl transition-transform transform hover:scale-110"
            aria-hidden="true"
          />
        )}
        <h2
          className="text-3xl sm:text-4xl font-semibold text-primary dark:text-secondary tracking-tight leading-tight"
          aria-label={name}
        >
          {name}
        </h2>
      </div>
    </div>
  );
}

export default MainHeading;
