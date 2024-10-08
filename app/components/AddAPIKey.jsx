"use client";

import { useState, useEffect } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import { TbExternalLink, TbEye, TbEyeOff, TbEdit } from "react-icons/tb";
import 'react-toastify/dist/ReactToastify.css';
import Spinner from './Spinner';
import { getApiKey, addApiKey } from '@/app/services/api';
import TextInputField from './chat/TextInputField';
import SubmitButton from './SubmitButton';
import WhiteContainer from './WhiteContainer';
import { useRouter } from 'next/navigation';
import LinkButton from './LinkButton';
import { FaArrowLeft } from 'react-icons/fa';
import { MdClose } from 'react-icons/md';
import { HiChat } from 'react-icons/hi';

const AddAPIKey = () => {
  const router = useRouter();
  const [apiKey, setApiKey] = useState('');
  const [originalApiKey, setOriginalApiKey] = useState('');
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
          setOriginalApiKey(response.apiKey);
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
        setOriginalApiKey(apiKey);
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
    // setApiKey('');
  };

  const handleCancelChange = () => {
    setApiKey(originalApiKey);
    setIsChangingApiKey(false);
  };

  return (
    <WhiteContainer className="relative">
      <div className='flex justify-between items-center'>
      <h1 className="text-2xl font-bold mb-6 text-primary dark:text-secondary">API Key Validator</h1>
      <LinkButton text='See Chat' link='/chat' icon={<HiChat />} 
      className='mb-6 mt-0'
      />
      </div>
      {isChangingApiKey && (
            <button
              onClick={handleCancelChange}
              className="px-3 py-4"
            >
              <FaArrowLeft className='inline-block mr-2'/>
              {/* <MdClose size='20'/> */}
            </button>
          )}
      {initialLoad ? (
        <Spinner />
      ) : valid && apiKey && !isChangingApiKey ? (
        <div className="mt-4 p-4 relative bg-accent-50 text-accent-700 rounded-lg truncate transition-opacity duration-1000 opacity-100 pr-16">
          {showApiKey ? apiKey : '•'.repeat(apiKey.length)}
          <button
            onClick={toggleShowApiKey}
            className="ml-2 absolute right-2 top-1/2 transform -translate-y-1/2 text-link hover:text-link-hover transition-opacity duration-1000"
            style={{ fontSize: '1.5rem' }}
          >
            {showApiKey ? <TbEyeOff /> : <TbEye />}
          </button>
          <button
            onClick={handleChangeApiKey}
            className="ml-4 absolute right-10 top-1/2 transform -translate-y-1/2 text-link hover:text-link-hover transition-opacity duration-1000"
            style={{ fontSize: '1rem' }}
          >
            <TbEdit fontSize={22} title='Edit API'/>
          </button>
        </div>
      ) : (
        <>
          {/* {isChangingApiKey && (
            <button
              onClick={handleCancelChange}
              className="absolute top-10 right-10 transition-opacity duration-1000"
            >
              <MdClose size='20'/>
            </button>
          )} */}
          <TextInputField
            value={apiKey}
            onChange={handleApiKeyChange}
            placeholder="Enter API Key"
            type={showApiKey ? 'text' : 'password'}
            showToggle={true}
            showIcon={<TbEye />}
            hideIcon={<TbEyeOff />}
            onToggleShow={toggleShowApiKey}
            className="transition-opacity duration-1000"
          />
          <SubmitButton
            onClick={handleSubmit}
            disabled={apiKey.trim().length === 0}
            processing={processing}
            className="transition-opacity duration-1000"
          />
          <p className="text-primary dark:text-secondary mt-6 text-sm sm:text-base flex gap-1 transition-opacity duration-1000">
            Visit and get a free API key{' '}
            <a
              href="https://aistudio.google.com/app/apikey"
              target="_blank"
              rel="noopener noreferrer"
              className="text-link hover:text-link-hover underline flex gap-2 transition-opacity duration-1000"
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
