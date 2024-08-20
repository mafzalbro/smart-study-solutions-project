import React from 'react';
import { FaToiletPaper } from 'react-icons/fa'; 

const MainHeading = ({ name, icon: Icon = FaToiletPaper }) => {
  return (
    <div className="my-16 mt-32 flex flex-col items-center">
      <div className="flex items-center mb-4">
        {Icon && <Icon className="mr-2 text-primary dark:text-secondary text-3xl sm:text-4xl" />}
        <h2 className="text-3xl sm:text-4xl font-bold text-primary dark:text-secondary">
          {name}
        </h2>
      </div>
      <div className="w-full flex justify-center">
        <span className="block w-1/4 border-t-2 border-neutral-200 dark:border-neutral-800"></span>
      </div>
    </div>
  );
}

export default MainHeading;
