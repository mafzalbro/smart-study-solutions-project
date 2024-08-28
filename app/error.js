'use client' // Error boundaries must be Client Components
 
import { useEffect } from 'react'
 
export default function Error({ error, reset }) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error(error)
  }, [error])
 
  return (
    <div className='h-screen text-center flex justify-center items-center flex-col'>
      <h2 className='text-xl'>Something went wrong!</h2>
      <button className='bg-primary text-secondary dark:bg-secondary dark:text-primary rounded-full'
        onClick={
          // Attempt to recover by trying to re-render the segment
          () => reset()
        }
      >
        Try again
      </button>
    </div>
  )
}