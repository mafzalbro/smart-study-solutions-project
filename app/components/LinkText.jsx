import Link from 'next/link';

const LinkText = ({ link, text, style = '', ariaLabel, icon, iconPosition = 'left' }) => {
  return (
    <Link href={link} passHref aria-label={ariaLabel} className={`inline-flex items-center text-accent-500 dark:text-accent-400 hover:text-accent-600 dark:hover:text-accent-300 transition duration-300 ease-in-out ${style}`}>
      {icon && iconPosition === 'left' && <span className="mr-2">{icon}</span>}
      <span>{text}</span>
      {icon && iconPosition === 'right' && <span className="ml-2">{icon}</span>}
    </Link>
  );
};

export default LinkText;
