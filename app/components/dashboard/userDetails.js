"use client"

import { useState, useEffect } from 'react';
import Spinner from '../Spinner';
import UpdateProfile from '../UpdateProfile';


export default function UserDetails() {
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
    <div className="w-3/4 h-full p-4 flex flex-col">
      <div className="flex-1 overflow-y-auto">
        {loading ? (
          <Spinner />
        ) : (
          <div className="p-4 rounded-lg text-gray-700 mb-4">
              <UpdateProfile />
          </div>
        )}
      </div>
    </div>
  );
}
