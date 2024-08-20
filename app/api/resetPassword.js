// File: resetPassword.js

// api/resetPassword.js

import { fetcher } from '../utils/fetcher';

const resetPassword = async (token, newPassword) => {
  try {
    const url = `${process.env.NEXT_PUBLIC_BACKEND_ORIGIN}/api/auth/resetPassword`;
    return await fetcher(url, 'POST', { token, newPassword });
  } catch (error) {
    console.error('Error resetting password:', error.message);
    throw error.message;
  }
};

export default resetPassword;
