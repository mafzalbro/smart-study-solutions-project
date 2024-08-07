"use client";

import { useState, useEffect } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import { TbExternalLink, TbEye, TbEyeEdit, TbEyeOff } from "react-icons/tb";
import 'react-toastify/dist/ReactToastify.css';
import Spinner from './Spinner';
import { getApiKey, addApiKey } from '@/app/services/api';
import TextInputField from './TextInputField';
import SubmitButton from './SubmitButton';
import WhiteContainer from './WhiteContainer';
import { useRouter } from 'next/navigation';
import LinkButton from './LinkButton';
import { FaArrowLeft } from 'react-icons/fa';

const AddAPIKey = () => {
  const router = useRouter();
  const [apiKey, setApiKey] = useState('');
  const [valid, setValid] = useState(null);
  const [initialLoad, setInitialLoad] = useState(true);
  const [processing, setProcessing] = useState(false);
  const [showApiKey, setShowApiKey] = useState(false);
  const [isChangingApiKey, setIsChangingApiKey] = useState(false);

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
        router.push('/chat');
        toast.success('API Key is valid.');
        setValid(true);
        setIsChangingApiKey(false);
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

  const toggleShowApiKey = () => {
    setShowApiKey(!showApiKey);
  };

  const handleChangeApiKey = () => {
    setIsChangingApiKey(true);
    setApiKey('');
  };

  return (
    <WhiteContainer>
      <h1 className="text-2xl font-bold mb-6 text-primary dark:text-secondary">API Key Validator</h1>
      <LinkButton text='See Chat' link='/chat' icon={<FaArrowLeft />} />
      {initialLoad ? (
        <Spinner />
      ) : valid && apiKey && !isChangingApiKey ? (
        <div className="mt-4 p-4 relative bg-accent-50 text-accent-700 rounded-lg truncate">
          {showApiKey ? apiKey : '•'.repeat(apiKey.length)}
          <button
            onClick={toggleShowApiKey}
            className="ml-2 absolute right-2 top-1/2 transform -translate-y-1/2 text-link hover:text-link-hover"
            style={{ fontSize: '1.5rem' }}
          >
            {showApiKey ? <TbEyeOff /> : <TbEye />}
          </button>
          <button
            onClick={handleChangeApiKey}
            className="ml-4 absolute right-10 top-1/2 transform -translate-y-1/2 text-link hover:text-link-hover"
            style={{ fontSize: '1rem' }}
          >
            {/* Change API Key */}
            <TbEyeEdit fontSize={22}/>
          </button>
        </div>
      ) : (
        <>
          <TextInputField
            value={apiKey}
            onChange={handleApiKeyChange}
            placeholder="Enter API Key"
            type={showApiKey ? 'text' : 'password'}
            showToggle={true}
            showIcon={<TbEye />}
            hideIcon={<TbEyeOff />}
            onToggleShow={toggleShowApiKey}
          />
          <SubmitButton
            onClick={handleSubmit}
            disabled={apiKey.trim().length === 0}
            processing={processing}
          />
          <p className="text-primary dark:text-secondary mt-6 text-sm sm:text-base flex gap-1">
            Visit and get a free API key{' '}
            <a
              href="https://aistudio.google.com/app/apikey"
              target="_blank"
              rel="noopener noreferrer"
              className="text-link hover:text-link-hover underline flex gap-2"
            >
              Google AI Studio <TbExternalLink />
            </a>
          </p>
        </>
      )}
      <ToastContainer />
    </WhiteContainer>
  );
};

export default AddAPIKey;
