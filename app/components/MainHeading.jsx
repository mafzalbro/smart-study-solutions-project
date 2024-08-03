import React from 'react';
import { FaStar } from 'react-icons/fa'; // Example icon, you can use any icon library

const MainHeading = ({ name, icon: Icon = FaStar }) => {
  return (
    <div className="my-16 mt-32 flex flex-col items-center">
      <div className="flex items-center mb-4">
        {Icon && <Icon className="mr-2 text-primary dark:text-secondary text-3xl sm:text-4xl" />}
        <h2 className="text-3xl sm:text-4xl font-bold text-primary dark:text-secondary">
          {name}
        </h2>
      </div>
      <div className="w-full flex justify-center">
        <span className="block w-1/4 border-t-2 border-neutral-300 dark:border-neutral-600"></span>
      </div>
    </div>
  );
}

export default MainHeading;
