import Link from 'next/link';

const LinkButton = ({ link, text, style = '', ariaLabel, icon, iconPosition = 'left'}) => {
  return (
    <Link href={link} passHref
        aria-label={ariaLabel} 
        className={`inline-block mr-2 my-5 md:my-2 py-2 px-4 bg-neutral-900 text-secondary rounded-lg shadow-md hover:bg-neutral-700 active:bg-neutral-500 dark:bg-neutral-600 dark:hover:bg-neutral-700 transition duration-300 ease-in-out ${style}`} 
      >
        <span className='flex justify-center items-center'>
        {icon && iconPosition === 'left' && <span className="mr-2">{icon}</span>}
        <span>{text}</span>
        {icon && iconPosition === 'right' && <span className="ml-2">{icon}</span>}
        </span>
    </Link>
  );
};


export default LinkButton;
