"use client";

import { useState, useEffect } from 'react';

export default function AddAPIKey() {
  const [apiKey, setApiKey] = useState('');
  const [message, setMessage] = useState('');
  const [valid, setValid] = useState(null);
  const [initialLoad, setInitialLoad] = useState(true);

  useEffect(() => {
    const fetchApiKey = async () => {
      try {
        const request = await fetch('http://localhost:3000/api/chat/getApi', {
          method: 'GET',
          credentials: 'include',
          headers: {
            'Content-Type': 'application/json',
          },
        });
        const response = await request.json();
        if (response.apiKey) {
          setApiKey(response.apiKey);
          setMessage('API Key is valid.');
          setValid(true);
        } else {
          setMessage('No API Key found.');
          setValid(false);
        }
      } catch (error) {
        setMessage('Error fetching API Key.');
        setValid(false);
      } finally {
        setInitialLoad(false);
      }
    };

    fetchApiKey();
  }, []);

  const handleApiKeyChange = (e) => {
    setApiKey(e.target.value);
  };

  const handleSubmit = async () => {
    try {
      const request = await fetch('http://localhost:3000/api/chat/addApi', {
        method: 'PUT',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ apiKey }),
      });
      const response = await request.json();
      console.log(response);
      if (response.valid) {
        setMessage('API Key is valid.');
        setValid(true);
      } else {
        setMessage('API Key is invalid.');
        setValid(false);
      }
    } catch (error) {
      setMessage('Error validating API Key.');
      setValid(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-my-bg-1 to-my-bg-2 dark:bg-gray-800">
      <div className="p-6 rounded-lg shadow-lg bg-gray-100 dark:bg-gray-900">
        <h1 className="text-2xl font-bold mb-4 text-foreground dark:text-gray-100">API Key Validator</h1>
        {initialLoad ? (
          <p>Loading...</p>
        ) : valid && apiKey ? (
          <p className="mt-4 p-2 bg-green-100 text-green-700 rounded">API Key is valid: {apiKey}</p>
        ) : (
          <>
            <input
              type="text"
              value={apiKey}
              onChange={handleApiKeyChange}
              placeholder="Enter API Key"
              className="p-2 w-full border border-gray-300 dark:border-gray-700 rounded mb-4"
            />
            <button
              onClick={handleSubmit}
              className="w-full p-2 bg-orange-500 hover:bg-orange-700 dark:bg-orange-700 dark:hover:bg-orange-500 text-white rounded"
            >
              Test API Key
            </button>
          </>
        )}
        {message && (
          <p
            className={`mt-4 p-2 rounded ${
              valid ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
            }`}
          >
            {message}
          </p>
        )}
      </div>
    </div>
  );
}
