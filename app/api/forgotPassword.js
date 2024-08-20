// File: forgotPassword.js

// api/forgotPassword.js

import { fetcher } from '../utils/fetcher';

const forgotPassword = async (email) => {
  try {
    const url = `${process.env.NEXT_PUBLIC_BACKEND_ORIGIN}/api/auth/forgotPassword`;
    return await fetcher(url, 'POST', { email });
  } catch (error) {
    console.error('Error sending forgot password email:', error.message);
    throw error.message;
  }
};

export default forgotPassword;
