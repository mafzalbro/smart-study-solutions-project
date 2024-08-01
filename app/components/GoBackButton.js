"use client";

import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { FaArrowLeft } from 'react-icons/fa';

const GoBackButton = () => {
  const [canGoBack, setCanGoBack] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const handlePopState = () => {
      setCanGoBack(window.history.length > 1);
    };

    window.addEventListener('popstate', handlePopState);
    handlePopState(); // Check initial state

    return () => {
      window.removeEventListener('popstate', handlePopState);
    };
  }, []);

  const goBack = () => {
    if (canGoBack) {
      router.back();
    } else {
      router.push('/');
    }
  };

  return (
    <button
      onClick={goBack}
      className="flex items-center text-link hover:text-link-hover mb-4 text-sm sm:text-base"
    >
      <FaArrowLeft className="mr-2" />
      Go Back
    </button>
  );
};

export default GoBackButton;
