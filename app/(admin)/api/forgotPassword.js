import { fetcher } from '@/app/(admin)/utils/fetcher';

const forgotPassword = async (email) => {
  try {
    const url = `${process.env.NEXT_PUBLIC_BACKEND_ORIGIN}/api/admin/forgotPassword`;
    return await fetcher(url, 'POST', { email });
  } catch (error) {
    console.error('Error sending forgot password email:', error.message);
    throw error.message;
  }
};

export default forgotPassword;
