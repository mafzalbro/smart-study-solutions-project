// File: logout.js

import { removeUserCacheHistory } from '../utils/caching';
// import { fetcher } from '../utils/fetcher';

const handleLogout = async (router) => {
  try {
    // const url = `${process.env.NEXT_PUBLIC_BACKEND_ORIGIN}/api/auth/logout`;
    // const token = localStorage.getItem('token'); // Retrieve the token from local storage

    // const res = await fetcher(url, 'POST', null, {
    //   'Authorization': `Bearer ${token}`, // Include the token in the request header
    // });

    // if (res) {
      await removeUserCacheHistory()
      localStorage.removeItem('token'); // Remove the token from local storage
      // localStorage.removeItem('isLoggedIn'); // Optionally remove the isLoggedIn flag
      router.replace('/login'); // Redirect to the login page
    // }
  } catch (error) {
    console.error('Error logging out:', error);
  }
};

export default handleLogout;
