import React from 'react'
import ContactUs from '@/app/components/ContactUs'
import { ToastContainer } from 'react-toastify'
import WhiteContainer from '@/app/components/WhiteContainer'
const ContactPage = () => {
    return (
        <>
    
      <WhiteContainer>
        <ContactUs />
      </WhiteContainer>
    
    <ToastContainer />
    </>
  )
}

export default ContactPage