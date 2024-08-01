// services/server/server.js
'use server'

export const fetcher = async (url, method = 'GET', body = null, headers = {}) => {
  const options = {
    method,
    headers: {
      'Content-Type': 'application/json',
      ...headers,
    },
    credentials: 'include',
  };

  if (body) {
    options.body = JSON.stringify(body);
  }

  try {
    const response = await fetch(url, options)
  
    if (!response.ok) {
      if (response.status === 401) {
        throw new Error('Unauthorized');
      }

      const data = await response.json();
      throw new Error(data.message || 'Something went wrong');
    }

    return await response.json();
  } catch (error) {
    console.error('Fetcher error:', error);
    throw error;
  }
};
