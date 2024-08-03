import React from 'react'
import Spinner from './components/Spinner'


const loading = () => {
  return(
  <div className='flex justify-center items-center mera h-screen'>
    <Spinner />
  </div>
  )
}

export default loading