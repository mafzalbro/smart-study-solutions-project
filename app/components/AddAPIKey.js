"use client";

import { useState, useEffect } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import { TbExternalLink } from "react-icons/tb";
import 'react-toastify/dist/ReactToastify.css';
import Spinner from './Spinner';
import { getApiKey, addApiKey } from '@/app/services/api';
import TextInputField from './TextInputField';
import SubmitButton from './SubmitButton';

const AddAPIKey = () => {
  const [apiKey, setApiKey] = useState('');
  const [valid, setValid] = useState(null);
  const [initialLoad, setInitialLoad] = useState(true);
  const [processing, setProcessing] = useState(false);

  useEffect(() => {
    const fetchApiKey = async () => {
      try {
        const response = await getApiKey();
        if (response.apiKey) {
          setApiKey(response.apiKey);
          toast.success('API Key is valid.');
          setValid(true);
        } else {
          toast.info('No API Key found.');
          setValid(false);
        }
      } catch (error) {
        toast.error('Error fetching API Key.');
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
    if (!apiKey.trim()) {
      toast.error('Please enter an API Key.');
      return;
    }

    setProcessing(true);
    try {
      const response = await addApiKey(apiKey);
      if (response.valid) {
        toast.success('API Key is valid.');
        setValid(true);
      } else {
        toast.error('API Key is invalid.');
        setValid(false);
      }
    } catch (error) {
      toast.error('Error validating API Key.');
      setValid(false);
    } finally {
      setProcessing(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-neutral-100 dark:bg-neutral-900 px-4 sm:px-6 lg:px-8">
      <div className="p-6 bg-secondary dark:bg-neutral-800 rounded-lg shadow-lg max-w-md w-full">
        <h1 className="text-2xl font-bold mb-6 text-primary dark:text-secondary">API Key Validator</h1>
        {initialLoad ? (
          <Spinner />
        ) : valid && apiKey ? (
          <div className="mt-4 p-4 bg-accent-50 text-accent-700 rounded-lg truncate">
            {apiKey}
          </div>
        ) : (
          <>
            <TextInputField
              value={apiKey}
              onChange={handleApiKeyChange}
              placeholder="Enter API Key"
            />
            <SubmitButton
              onClick={handleSubmit}
              disabled={apiKey.trim().length === 0}
              processing={processing}
            />
            <p className="text-primary dark:text-secondary mt-6 text-sm sm:text-base flex gap-1">
              Visit and get a free API key  <a href="https://aistudio.google.com/app/apikey" target="_blank" rel="noopener noreferrer" className="text-link hover:text-link-hover underline flex gap-2">
                Google AI Studio <TbExternalLink /></a>
            </p>
          </>
        )}
      </div>
    </div>
  );
};

export default AddAPIKey;
