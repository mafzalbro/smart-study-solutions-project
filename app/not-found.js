'use client'

import GoBackButton from "./components/GoBackButton"

const notFound = () => {
  return (
    <>
    <GoBackButton />
    <div className='min-h-[40vh] flex justify-center items-center'>
        notFound
        </div>
    </>
  )
}

export default notFound