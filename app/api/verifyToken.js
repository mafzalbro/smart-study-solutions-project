// File: verifyToken.js

// api/verifyToken.js

import { fetcher } from '../utils/fetcher';

const verifyToken = async (token) => {
  try {
    const url = `${process.env.NEXT_PUBLIC_BACKEND_ORIGIN}/api/auth/verifyToken?token=${token}`;
    return await fetcher(url, 'GET');
  } catch (error) {
    console.error('Error verifying token:', error.message);
    throw error.message;
  }
};

export default verifyToken;
