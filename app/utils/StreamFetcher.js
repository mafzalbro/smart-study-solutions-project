// components/StreamFetcher.js

import { useState, useEffect } from 'react';

const StreamFetcher = ({ url, body, onResponse, onError, onComplete }) => {
  const [isFetching, setIsFetching] = useState(false);


  console.log({url})
  useEffect(() => {
    const fetchStream = async () => {
      setIsFetching(true);

      // try {
        const token = localStorage.getItem('token'); // Get token from local storage

        const response = await fetch(url, {
          method: 'POST',
          credentials: 'include',
          headers: {
            'Content-Type': 'application/json',
            ...(token ? { 'Authorization': `Bearer ${token}` } : {})
          },
          body: JSON.stringify(body),
        });

        if (!response.body) {
          console.error('ReadableStream not supported in this browser.');
          return;
        }

        const reader = response.body.getReader();
        const decoder = new TextDecoder();
        let fullMessage = '';

        const firstChunk = await reader.read();
        fullMessage += decoder.decode(firstChunk.value);
        onResponse(fullMessage);
        console.log({fullMessage})

        while (true) {
          const { done, value } = await reader.read();
          if (done) break;
          fullMessage += decoder.decode(value);
          console.log({fullMessage})
          onResponse(fullMessage);
        }

        onComplete();
      // } catch (error) {
      //   console.error('Error:', error);
      //   onError(error);
      // } finally {
        // }
          setIsFetching(false);
    };

    fetchStream();
  }, [url, body, onResponse, onError, onComplete]);

  return null;
};

export default StreamFetcher;
