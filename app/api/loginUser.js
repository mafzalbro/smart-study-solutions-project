// File: loginUser.js

// api/loginUser.js

import { fetcher } from '../utils/fetcher';

const loginUser = async (username, password) => {
  try {
    const url = `${process.env.NEXT_PUBLIC_BACKEND_ORIGIN}/api/auth/login`;
    return await fetcher(url, 'POST', { username, password });
  } catch (error) {
    console.error('Error logging in:', error.message);
    throw error.message;
  }
};

export default loginUser;
