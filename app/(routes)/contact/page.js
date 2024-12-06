"use client"

import React from 'react'
import ContactUs from '@/app/components/ContactUs'
import WhiteContainer from '@/app/components/WhiteContainer'
import { useAuth } from '@/app/customHooks/AuthContext'


const ContactPage = () => {
  const { user } = useAuth()
    return (
    <>
      <WhiteContainer>
      {user && user?.fullname && <h2 className="text-center my-10 text-2xl">Hey, {user?.fullname}</h2>}
        <ContactUs />
      </WhiteContainer>
    
    </>
  )
}

export default ContactPage