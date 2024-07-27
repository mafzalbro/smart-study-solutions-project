import React from 'react'

const Announcement = () => {
  return (
        <>
        <div className="bg-white p-6 rounded-lg text-center my-auto">
            <h2 className="text-2xl font-bold mb-4">New Announcement</h2>
                <p className="mb-4">We have an exciting new feature for you. Check it out now!</p>
            <button className="bg-orange-600 text-white py-2 px-4 rounded-full hover:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-orange-600 focus:ring-opacity-50">
            Check Now
            </button>
        </div>
    </>
  )
}

export default Announcement