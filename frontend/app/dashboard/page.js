"use client"

import { useState } from 'react';
import Sidebar from '../components/dashboard/Sidebar';
import UserDetails from '../components/dashboard/userDetails';

export default function Dashboard() {
  const [selectedData, setSelectedData] = useState(null);

  // Function to handle data selection
  const handleDataSelect = (data) => {
    setSelectedData(data);
  };

  return (
    <div className="flex h-screen">
      <Sidebar height="full" selectedData={selectedData} onSelect={handleDataSelect} />
      <UserDetails selectedData={selectedData} />
    </div>
  );
}