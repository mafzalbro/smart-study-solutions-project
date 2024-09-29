
import { fetcher } from '@/app/(admin)/utils/fetcher';


const resetPassword = async (token, newPassword) => {
  try {
    const url = `${process.env.NEXT_PUBLIC_BACKEND_ORIGIN}/api/admin/resetPassword`;
    return await fetcher(url, 'POST', { token, newPassword });
  } catch (error) {
    console.error('Error resetting password:', error.message);
    throw error.message;
  }
};

export default resetPassword;
