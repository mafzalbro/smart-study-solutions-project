"use client"

import { useState, useEffect } from 'react';
import Spinner from '../Spinner';
import UpdateProfile from '../UpdateProfile';


export default function UserDetails({ selectedData }) {
  const [loading, setLoading] = useState(true);
  
  // Simulating fetching data
  useEffect(() => {
    setLoading(true);
    // Simulate fetch or other async operations
    setTimeout(() => {
      setLoading(false);
    }, 1500); // Simulating loading time
  }, []);

  return (
    <div className="w-3/4 h-full bg-white p-4 flex flex-col">
      <h2 className="text-xl mb-4 text-gray-800">User Details</h2>
      <div className="flex-1 overflow-y-auto">
        {loading ? (
          <Spinner />
        ) : (
          <div className="p-4 bg-gray-200 rounded-lg text-gray-700 mb-4">
            {selectedData ? (
              <p>{selectedData}</p>
            ) : (
              // <p className="text-center">No data selected.</p>
              <UpdateProfile />
            )}
          </div>
        )}
      </div>
    </div>
  );
}
