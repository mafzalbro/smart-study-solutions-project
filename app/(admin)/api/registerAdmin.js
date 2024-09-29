// api/admin/registerUser.js

import { fetcher } from '@/app/(admin)/utils/fetcher';

const registerUser = async (adminData) => {
  try {
    const url = `${process.env.NEXT_PUBLIC_BACKEND_ORIGIN}/api/admin/create`;
    return await fetcher(url, 'POST', adminData);
  } catch (error) {
    console.error('Error registering user:', error.message);
    throw error.message;
  }
};

export default registerUser;
