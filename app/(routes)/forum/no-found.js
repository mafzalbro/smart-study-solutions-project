'use client'

import GoBackButton from "./components/GoBackButton"

const notFound = () => {
  return (
    <>
    <GoBackButton />
    <div className='min-h-[40vh] flex justify-center items-center'>
        Can't Found This Question Page
        </div>
    </>
  )
}

export default notFound