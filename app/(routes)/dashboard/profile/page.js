import UserDetails from '@/app/components/dashboard/userDetails'
import React from 'react'
import { ToastContainer } from 'react-toastify'

const page = () => {
  return (
    <>
      <UserDetails />
      <ToastContainer />
    </>
  )
}

export default page