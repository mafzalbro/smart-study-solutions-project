// /app/utils/fetchData.js

export const fetchData = async (url, options) => {
  try {
    const response = await fetch(url, { ...options, credentials: 'include' });
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    const reader = response.body.getReader();
    const decoder = new TextDecoder();
    let accumulatedChunks = '';

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      const chunk = decoder.decode(value);
      accumulatedChunks += chunk;
    }

    return accumulatedChunks;
  } catch (error) {
    console.error('Error fetching data:', error);
    throw error;
  }
};
