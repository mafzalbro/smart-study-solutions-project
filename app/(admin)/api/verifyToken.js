import { fetcher } from '@/app/(admin)/utils/fetcher';

const verifyToken = async (token) => {
  try {
    const url = `${process.env.NEXT_PUBLIC_BACKEND_ORIGIN}/api/admin/verifyToken?token=${token}`;
    return await fetcher(url, 'GET');
  } catch (error) {
    console.error('Error verifying token:', error.message);
    throw error.message;
  }
};

export default verifyToken;
