import Link from 'next/link';
import NavBarClient from './NavBarClient';
import NavBarServer from './NavBarServer';

const NavBar = async () => {

  return (
    <nav className="bg-neutral-800 dark:bg-gray-900 p-4 shadow-lg text-white">
      <div className="container mx-auto flex justify-between items-center">
        <Link href="/">
          <h2 className="text-2xl font-bold cursor-pointer">Code Innovators</h2>
        </Link>
        <NavBarClient>
        <NavBarServer />
        </NavBarClient>
      </div>
    </nav>
  );
};

export default NavBar;
