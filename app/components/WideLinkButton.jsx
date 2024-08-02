import Link from 'next/link'
import React from 'react'

const WideLinkButton = ({link, text, style}) => {
  return (
    <Link href={link} passHref>
      <span className={`block md:inline-block py-2 px-4 bg-accent-600 text-white rounded-lg shadow-md hover:bg-accent-700 dark:hover:bg-accent-700 dark:bg-accent-600 my-8 ${style}`}>{text}</span>
      
  </Link>
  )
}

export default WideLinkButton