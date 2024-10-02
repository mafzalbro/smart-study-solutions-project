"use client"

import React from 'react'
import { useAuth } from '@/app/customHooks/AuthContext'


const AboutPage = () => {
  const { user } = useAuth()
    return (
    <div className="text-center min-h-64">
    <h1 className="text-center my-10 text-3xl">About US</h1>
      {user && <h2 className="text-center my-10 text-2xl">Hey, {user.fullname}</h2>}
      <p>Thanks for visting!</p>
      <p>About Section getting ready ...</p>
    </div>
  )
}

export default AboutPage