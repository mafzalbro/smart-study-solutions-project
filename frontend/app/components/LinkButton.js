import Link from 'next/link'
import React from 'react'

const LinkButton = ({link, text, style}) => {
  return (
    <Link href={link} passHref>
      <span className={`mr-2 my-5 md:my-2 inline-block py-2 px-4 bg-orange-600 text-white rounded-lg shadow-md hover:bg-orange-700 dark:bg-orange-600 dark:hover:bg-orange-700 ${style}`}>{text}</span>
  </Link>
  )
}

export default LinkButton