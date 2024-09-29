import React from 'react'
import LoginForm from '@/app/(admin)/components/admin/LoginForm'
import WhiteContainer from '@/app/(admin)/components/admin/WhiteContainer'
const page = () => {
    return (
    <>
        <WhiteContainer className={'max-w-[500px]'}>
      <h2 className="text-center text-2xl font-bold mb-6 text-primary dark:text-secondary">
        Login as a Admin
      </h2>
        <LoginForm />
    </WhiteContainer>
    </>
  )
}

export default page