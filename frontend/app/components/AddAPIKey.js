"use client"

import Link from 'next/link';
import { useState, useEffect } from 'react';
import useAlert from '../customHooks/useAlert'; // Adjust the path as per your project structure
import Spinner from './Spinner';

const AddAPIKey = () => {
  const [apiKey, setApiKey] = useState('');
  const [valid, setValid] = useState(null);
  const [initialLoad, setInitialLoad] = useState(true);

  // Initialize useAlert hook
  const [message, setMessage] = useAlert('', 5000);

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
  }, [setMessage]);

  const handleApiKeyChange = (e) => {
    setApiKey(e.target.value);
    // Clear message when input changes
    setMessage('');
  };

  const handleSubmit = async () => {
    if (!apiKey.trim()) {
      setMessage('Please enter an API Key.');
      return;
    }

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
    <div className="min-h-screen flex items-center justify-center">
      <div className="p-6 rounded-lg shadow-lg w-96">
        <Link href="/chat" className='mb-5 text-black inline-block'>&larr; Go to Chat Home</Link>
        <h1 className="text-2xl font-bold mb-4 text-black">API Key Validator</h1>
        {initialLoad ? (
          <Spinner />
        ) : valid && apiKey ? (
          <div className="mt-4 p-2 bg-green-100 text-green-700 rounded-lg">{apiKey}</div>
        ) : (
          <>
            <input
              required
              type="text"
              value={apiKey}
              onChange={handleApiKeyChange}
              placeholder="Enter API Key"
              className="p-2 w-full border rounded-lg mb-4 focus:outline-none focus:ring-2 focus:ring-orange-500"
            />
            <button
              onClick={handleSubmit}
              className={`block md:inline-block py-2 px-4 bg-orange-600 text-black rounded-lg shadow-md hover:bg-orange-700 dark:hover:bg-orange-700 dark:bg-orange-600 w-full text-center ${apiKey.trim().length === 0 ? 'opacity-50 cursor-not-allowed' : ''}`}
              disabled={apiKey.trim().length === 0}
            >
              Test API Key
            </button>
            <p className='text-black mt-8'>Visit and get free api key <a href="https://aistudio.google.com/app/apikey" target='_blank' rel='noopener noreferrer' className='text-blue-400'>Google AI Studio</a></p>
          </>
        )}
        {message && (
          <p
            className={`mt-4 p-2 rounded-lg ${valid ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}
          >
            {message}
          </p>
        )}
      </div>
    </div>
  );
};

export default AddAPIKey;
