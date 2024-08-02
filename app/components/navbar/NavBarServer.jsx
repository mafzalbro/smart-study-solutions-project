import Link from 'next/link';
import { getPathFromReferer } from '@/app/services/server/server';
import { checkAuth } from '@/app/services/server/auth';

const NavBar = async () => {
  const isLoggedIn = await checkAuth();
  const pathname = await getPathFromReferer();

  return (
      <ul className="md:flex md:space-x-6 md:items-center absolute md:static bg-neutral-800 dark:bg-gray-900 top-16 left-0 w-full md:w-auto shadow-lg md:shadow-none p-4 md:p-0">
            <li>
              <Link href="/" passHref>
                <span className="block md:inline-block text-link hover:text-link-hover py-2 md:py-0">Home</span>
              </Link>
            </li>
            <li>
              <Link href="/resources" passHref>
                <span className="block md:inline-block text-link hover:text-link-hover py-2 md:py-0">Resources</span>
              </Link>
            </li>
            {isLoggedIn && (
              <>
                <li>
                  <Link href="/chat" passHref>
                    <span className="block md:inline-block hover:text-link-hover py-2 md:py-0">Ask AI</span>
                  </Link>
                </li>
                <li>
                  <Link href="/dashboard" passHref>
                    <span className="block md:inline-block hover:text-link-hover py-2 md:py-0">Profile</span>
                  </Link>
                </li>
                <li>
                  <Link href="/forum" passHref>
                    <span className="block md:inline-block hover:text-link-hover py-2 md:py-0">Forum</span>
                  </Link>
                </li>
              </>
            )}
            {pathname && pathname.includes('/forum') && (
              <Link href="/forum/submit" passHref>
                <button className="my-4 md:my-0 py-2 px-4 bg-neutral-200 text-link rounded-lg shadow-md hover:bg-link dark:bg-link dark:hover:bg-link-hover">
                  Add Question
                </button>
              </Link>
            )}
            {isLoggedIn ? (
              <li>
                <Link href="/logout" passHref>
                  <button className="my-4 md:my-0 py-2 px-4 bg-neutral-200 text-link rounded-lg shadow-md hover:bg-link dark:bg-link dark:hover:bg-link-hover">
                    Log Out
                  </button>
                </Link>
              </li>
            ) : (
              <li>
                <Link href="/login" passHref>
                  <button className="my-4 md:my-0 py-2 px-4 bg-neutral-200 text-link rounded-lg shadow-md hover:bg-link dark:bg-link dark:hover:bg-link-hover">
                    Log In
                  </button>
                </Link>
              </li>
            )}
          </ul>
  );
};

export default NavBar;
