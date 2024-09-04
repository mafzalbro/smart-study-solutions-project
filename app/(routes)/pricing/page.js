import React from 'react'
import ContactUs from '@/app/components/ContactUs'
import { ToastContainer } from 'react-toastify'
import WhiteContainer from '@/app/components/WhiteContainer'
const ContactPage = () => {
    return (
        <>
    
      <WhiteContainer>
        <h1>Bear with Us, we are updating pricing section! Till then contact us for any query!</h1>
        <ContactUs />
      </WhiteContainer>
    
    <ToastContainer />
    </>
  )
}

export default ContactPage