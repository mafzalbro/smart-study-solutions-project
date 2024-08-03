import Link from 'next/link';
import { FaArrowRight } from 'react-icons/fa';

const LinkText = ({ link, text, style = '', ariaLabel, icon: Icon = FaArrowRight, iconPosition = 'left' }) => {
  return (
    <Link href={link} passHref aria-label={ariaLabel} className={`inline-flex items-center text-accent-500 dark:text-accent-400 hover:text-accent-600 dark:hover:text-accent-300 transition duration-300 ease-in-out ${style}`}>
      {Icon && iconPosition === 'left' && <span className="mr-2">{<Icon />}</span>}
      <span>{text}</span>
      {Icon && iconPosition === 'right' && <span className="ml-2">{<Icon />}</span>}
    </Link>
  );
};

export default LinkText;
