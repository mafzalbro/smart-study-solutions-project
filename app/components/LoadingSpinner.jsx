// /app/components/LoadingSpinner.js
"use client";

import React from 'react';
import { ClipLoader } from 'react-spinners';

const LoadingSpinner = ({ loading }) => {
  return (
    loading && (
      <div className="flex justify-center items-center">
        <ClipLoader color={"#000000"} loading={loading} size={35} />
      </div>
    )
  );
};

export default LoadingSpinner;
