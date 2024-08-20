// File: changePassword.js

// api/changePassword.js

import { fetcher } from '../utils/fetcher';

const changePassword = async (currentPassword, newPassword) => {
  try {
    const url = `${process.env.NEXT_PUBLIC_BACKEND_ORIGIN}/api/auth/changePassword`;
    return await fetcher(url, 'PUT', { currentPassword, newPassword });
  } catch (error) {
    console.error('Error changing password:', error.message);
    throw error.message;
  }
};

export default changePassword;
