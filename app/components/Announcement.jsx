import React from 'react'
import LinkButton from './LinkButton'

const Announcement = ({data}) => {
  return (
        <>
        {data && 
        // <div className='flex items-center justify-center bg-accent-50 rounded-full p-10'>
          <div className="bg-secondary dark:bg-neutral-900 p-6 rounded-lg text-center my-auto m-1">
            {data.title && <h2 className="text-2xl font-bold mb-4">{data.title}</h2>}
                {data.description && <p className="mb-4">{data.description}</p>}
            {data.btnLink && data.icon && <LinkButton link={data.btnLink} text={data.btnText} icon={data.icon}/>}
            {!data.icon && <LinkButton link={data.btnLink} text={data.btnText}/>}
        </div>
        // </div>
        }
    </>
  )
}

export default Announcement