// services/api.js
import { fetcher } from '@/app/utils/fetcher'; // Adjust the path as needed

export const getApiKey = async () => {
  try {
    const response = await fetcher(`${process.env.NEXT_PUBLIC_BACKEND_ORIGIN}/api/chat/getApi`);
    return response;
  } catch (error) {
    throw new Error('Error fetching API Key');
  }
};

export const addApiKey = async (apiKey) => {
  try {
    const response = await fetcher(`${process.env.NEXT_PUBLIC_BACKEND_ORIGIN}/api/chat/addApi`, 'PUT', { apiKey });
    return response;
  } catch (error) {
    throw new Error('Error validating API Key');
  }
};
