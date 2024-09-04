import React from 'react'
import ContactUs from '@/app/components/ContactUs'
import { ToastContainer } from 'react-toastify'
import WhiteContainer from '@/app/components/WhiteContainer'
const ContactPage = () => {
    return (
        <>
        <h1 className='px-4 py-8'>Bear with Us, we are updating pricing section! Till then contact us for any query!</h1>
      <WhiteContainer>
        <ContactUs />
      </WhiteContainer>
    
    <ToastContainer />
    </>
  )
}

export default ContactPage