// File: registerUser.js

// api/registerUser.js

import { fetcher } from '../utils/fetcher';

const registerUser = async (userData) => {
  try {
    const url = `${process.env.NEXT_PUBLIC_BACKEND_ORIGIN}/api/auth/register`;
    return await fetcher(url, 'POST', userData);
  } catch (error) {
    console.error('Error registering user:', error.message);
    throw error.message;
  }
};

export default registerUser;
