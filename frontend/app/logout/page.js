"use client"

import React, { useEffect } from 'react'
import handleLogout from '../api/logout'
import { useRouter } from "next/navigation";
import Link from 'next/link';

const page = () => {
  
  const router = useRouter()

  useEffect(() => {
    handleLogout(router); // This will run when the component mounts
  }, []);

    return (
    <div className='flex items-center justify-center flex-col h-screen'>
      <p>Redirecting to login page</p>
        <Link href="/login" className='block md:inline-block py-2 px-4 bg-orange-600 text-white rounded-lg shadow-md hover:bg-orange-700 dark:hover:bg-orange-700 dark:bg-orange-600 my-8'>
          Try Login Button
        </Link>
    </div>
  )
}

export default page